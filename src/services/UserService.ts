import {initORM} from "../db";
import {Elysia} from "elysia";
import jwt from "jsonwebtoken";
import {wrap} from "@mikro-orm/core";

export class UserService {

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
            dermatoglyphics: null
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
        const data = await db.user.findOneOrFail({id: userId}, {populate: ['fingerprintImage', 'dermatoglyphics']});
        return data.miniUser();
    }

    async updateFingerprintImage(userId: number, body: any) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({id: userId});
        if (user.fingerprintImage) {
            const fingerprint = await db.fingerprintImage.findOneOrFail({user: user})
            wrap(fingerprint).assign(body)
            await db.em.persistAndFlush(fingerprint)
            return {message: "Fingerprint image updated"};
        }
        const fingerprint = db.fingerprintImage.create({
            ...body,
            user: user,
            checked: false
        })
        await db.em.persistAndFlush(fingerprint)
        return {message: "Fingerprint image updated"};
    }

    async updateFingerprintResult(body: any) {
        const db = await initORM()
        const user = await db.user.findOneOrFail({id: body.userId});
        delete body.userId;
        if (user.dermatoglyphics) {
            const dermatoglyphics = await db.dermatoglyphics.findOneOrFail({user: user})
            wrap(dermatoglyphics).assign(body)
            await db.em.persistAndFlush(dermatoglyphics)
            return {message: "Fingerprint result updated"};
        }
        const dermatoglyphics = db.dermatoglyphics.create({
            ...body,
            user: user
        });
        await db.em.persistAndFlush(dermatoglyphics);
        return {message: "Fingerprint result updated"};
    }
}

export default new Elysia().decorate('userService', new UserService())