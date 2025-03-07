import {initORM} from "../db";
import {Elysia} from "elysia";
import jwt from "jsonwebtoken";
import {wrap} from "@mikro-orm/core";
import {YescaleService} from "./YescaleService";

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
        return {message: "Fingerprint result created"};
    }

    async getFingerprintResult(userId: number) {
        try {
            const db = await initORM()
            const user = await db.user.findOneOrFail({id: userId}, {populate: ['fingerprintImage', 'dermatoglyphics']});
            if (!user.dermatoglyphics) throw new Error("Fingerprint result not found");
            // @ts-ignore
            delete user.dermatoglyphics.user;
            const {
                leftLitterFingerType,
                leftRingFingerType,
                leftThumbType,
                rightRingFingerType,
                rightThumbType,
                leftIndexFingerType,
                leftMiddleFingerType,
                rightIndexFingerType,
                rightLitterFingerType,
                rightMiddleFingerType,
                happinessIndex,
                hearingIndex,
                movementIndex,
                visualIndex,
                parietalLobePercent,
                prefrontalLobePercent,
                frontalLobePercent,
                occipitalLobePercent,
                temporalLobePercent
            } = user.dermatoglyphics;
            const completion = await this.yescaleService.createChatCompletions(
                1000,
                [
                    {
                        role: 'user',
                        content: `Phân tích cho tao về kết quả sinh chắc học vân tay của tao dựa vào data dưới đây:
                          - Ngón út bên tay trái thuộc loại: ${leftLitterFingerType},
                          - Ngón đeo nhẫn bên trái thuộc loại: ${leftRingFingerType},
                          - Ngón giữa bên trái thuộc loại: ${leftMiddleFingerType},
                          - Ngón trỏ bên trái thuộc loại: ${leftIndexFingerType}, 
                          - Ngón cái bên trái thuộc loại: ${leftThumbType}, 
                          - Ngón út bên tay phải thuộc loại: ${rightLitterFingerType},
                          - Ngón đeo nhẫn bên phải thuộc loại: ${rightRingFingerType},
                          - Ngón giữa bên phải thuộc loại: ${rightMiddleFingerType},
                          - Ngón trỏ bên phải thuộc loại: ${rightIndexFingerType},
                          - Ngón cái bên phải thuộc loại: ${rightThumbType},
                          - Phần trăm vùng não trước trán là: ${prefrontalLobePercent},
                          - Phần trăm vùng não trán là: ${frontalLobePercent},
                          - Phần trăm vùng não chẩm là: ${parietalLobePercent}, 
                          - Phần trăm vùng não sau đầu là: ${occipitalLobePercent},
                          - Phần trăm vùng não thái dương là: ${temporalLobePercent},
                          - Chỉ số hạnh phúc là: ${happinessIndex},
                          - Chỉ số nghe là: ${hearingIndex}, 
                          - Chỉ số vận động là: ${movementIndex},
                          - Chỉ số thị giác là: ${visualIndex}`
                    }
                ],
                "gpt-4o-mini"
            );
            console.log(completion.data.choices)
            return {message: "Result generated"};
        } catch (e) {
            console.log(e)
            throw new Error("Get fingerprint result failed");
        }
    }
}

export default new Elysia().decorate('userService', new UserService())