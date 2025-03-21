import {Elysia, t} from "elysia";
import userService from "../services/user.service";
import authMacro from "../macros/auth";
import {DermatoglyphicsType} from "../entities/Dermatoglyphics";

const userController = new Elysia()
    .group("/user", group =>
        group
            .use(userService)
            .use(authMacro)
            .post("/register", ({body, userService}) => {
                const {username, password, email} = body
                return userService.register(username, password, email);
            }, {
                detail: {
                    tags: ["User"],
                },
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                    email: t.String(),
                })
            })
            .post("/login", ({body, userService}) => {
                return userService.login(body.username, body.password);
            }, {
                detail: {
                    tags: ["User"],
                },
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                })
            })
            .post("/update-fingerprint-image", ({body, user, userService}) => {
                return userService.updateFingerprintImage(user.id, body)
            }, {
                checkAuth: ['user', 'admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                body: t.Object({
                    leftLitterFinger: t.String(),
                    leftRingFinger: t.String(),
                    leftMiddleFinger: t.String(),
                    leftIndexFinger: t.String(),
                    leftThumb: t.String(),
                    rightLitterFinger: t.String(),
                    rightRingFinger: t.String(),
                    rightMiddleFinger: t.String(),
                    rightIndexFinger: t.String(),
                    rightThumb: t.String(),
                })
            })
            .post("/admin-update-fingerprint-result", ({userService, body}) => {
                return userService.updateFingerprintResult(body)
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                body: t.Object({
                    leftLitterFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Left litter finger type"
                    }),
                    leftRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Left ring finger type"
                    }),
                    leftMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Left middle finger type"
                    }),
                    leftIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Left index finger type"
                    }),
                    leftThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Left thumb type"
                    }),
                    rightLitterFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Right litter finger type"
                    }),
                    rightRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Right ring finger type"
                    }),
                    rightMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Right middle finger type"
                    }),
                    rightIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Right index finger type"
                    }),
                    rightThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.WX,
                        description: "Right thumb type"
                    }),
                    userId: t.Number({
                        default: 0,
                        description: "User id"
                    })
                })
            })
            .get("/me", ({user, userService}) => {
                return userService.me(user.id)
            }, {
                checkAuth: ['user', 'admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
            .get("/get-fingerprint-result/:userId", ({params, userService}) => {
                return userService.getFingerprintResult(params.userId);
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                params: t.Object({
                    userId: t.Number()
                })
            })
            .post('/chat', ({body, userService}) => {
                return userService.chainAI(body.message)
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                body: t.Object({
                    message: t.String(),
                })
            })
    )

export default userController