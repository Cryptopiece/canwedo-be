import {initORM} from "../db";
import {Elysia} from "elysia";
import jwt from "jsonwebtoken";
import {wrap} from "@mikro-orm/core";
import {YescaleService} from "./yescale.service";
import * as fs from "node:fs";
import {fingerprintScore} from "../utils/constant";
import BigNumber from "bignumber.js";

export class UserService {
    private readonly yescaleService = new YescaleService();

    async register(username: string, password: string, email: string) {
        const db = await initORM()
        const existUser = await db.user.findOne({username})
        if (existUser) throw new Error("User already exists");
        const hashPassword = await Bun.password.hash(password, 'bcrypt')
        const user = db.user.create({
            username,
            password: hashPassword,
            email,
            role: "user",
            fingerprintImage: null,
            dermatoglyphics: null,
            firstName: null,
            lastName: null,
            phone: null,
            bio: email
        })
        await db.em.persistAndFlush(user)
        return user.miniUser();
    }

    async login(username: string, password: string) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({$or: [{username}, {email: username}]});
        const isValid = await Bun.password.verify(password, user.password, 'bcrypt')
        if (!isValid) throw new Error("Invalid password");
        const token = jwt.sign({id: Number(user.id), role: user.role}, process.env.JWT_SECRET ?? "")
        return {
            user: {
                id: Number(user.id),
                username: user.username,
                role: user.role
            },
            jwt: token
        }
    }

    async me(userId: number) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({id: userId}, {populate: ['fingerprintImage', 'dermatoglyphics']});
        return user.miniUser();
    }

    async updateFingerprintImage(userId: number, body: any) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({id: userId});
        if (user.fingerprintImage) {
            const fingerprint = await db.fingerprintImage.findOneOrFail({user: user})
            if (fingerprint.updatedCount >= 3) throw new Error("You can't update fingerprint image more than 3 times");
            wrap(fingerprint).assign({
                ...body,
                updatedCount: fingerprint.updatedCount + 1
            })
            await db.em.persistAndFlush(fingerprint)
            return {message: "Fingerprint image updated"};
        }
        const fingerprint = db.fingerprintImage.create({
            ...body,
            user: user,
            checked: false
        })
        await db.em.persistAndFlush(fingerprint)
        return {message: "Fingerprint image created"};
    }

    async getFingerprintResult(userId: number) {
        try {
            const db = await initORM()
            const user = await db.user.findOneOrFail({id: userId}, {populate: ['fingerprintImage']});
            if (!user.fingerprintImage) throw new Error("User haven't uploaded fingerprint image yet");
            const {leftLitterFinger, leftRingFinger, leftMiddleFinger, leftIndexFinger, leftThumb, rightLitterFinger, rightRingFinger, rightMiddleFinger, rightIndexFinger, rightThumb} = user.fingerprintImage;
            const completion = await this.yescaleService.createChatCompletions(
                10000,
                [
                    {
                        role: 'user',
                        content: `Dưới đây là dữ liệu về hình ảnh vân tay của tao, hãy cho tao biết dựa vào các hình ảnh này thì ngón tay của tao thuộc chủng gì: Hình ảnh ngón út trái: ${leftLitterFinger}, Hình ảnh ngón áp út trái: ${leftRingFinger}, Hình ảnh ngón giữa trái: ${leftMiddleFinger}, Hình ảnh ngón trỏ trái: ${leftIndexFinger}, Hình ảnh ngón cái trái: ${leftThumb}, Hình ảnh ngón út phải: ${rightLitterFinger}, Hình ảnh ngón áp út phải: ${rightRingFinger}, Hình ảnh ngón giữa phải: ${rightMiddleFinger}, Hình ảnh ngón trỏ phải: ${rightIndexFinger}, Hình ảnh ngón cái phải: ${rightThumb}`
                    }
                ],
                "gpt-4o"
            );
            fs.writeFileSync('response5', completion.data.choices[0].message.content);
            return {message: "Result generated"};
        } catch (e) {
            console.log(e)
            throw new Error("Get fingerprint result failed");
        }
    }

    async updateProfileInfo(userId: number, body: any) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({id: userId});
        wrap(user).assign(body);
        await db.em.persistAndFlush(user);
        return {message: "Profile updated"};
    }

}

export default new Elysia().decorate('userService', new UserService())