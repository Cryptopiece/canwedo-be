import {Elysia, t} from "elysia";
import userService from "../services/UserService";
import authMacro from "../macros/auth";
import {DermatoglyphicsType} from "../entities/Dermatoglyphics";

const userController = new Elysia()
    .group("/users", group =>
        group
            .use(userService)
            .use(authMacro)
            .post("/register", async ({body, userService}) => {
                const {username, password, email} = body
                return await userService.register(username, password, email);
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
            .post("/login", async ({body, userService}) => {
                return await userService.login(body.username, body.password);
            }, {
                detail: {
                    tags: ["User"],
                },
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                })
            })
            .post("/update-fingerprint-image", async ({body, user, userService}) => {
                return await userService.updateFingerprintImage(user.id, body)
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
            .post("/admin-update-fingerprint-result", async ({userService, body}) => {
                return await userService.updateFingerprintResult(body)
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
                        default: DermatoglyphicsType.AR,
                        description: "Left litter finger type"
                    }),
                    leftRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left ring finger type"
                    }),
                    leftMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left middle finger type"
                    }),
                    leftIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left index finger type"
                    }),
                    leftThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left thumb type"
                    }),
                    rightLitterFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right litter finger type"
                    }),
                    rightRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right ring finger type"
                    }),
                    rightMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right middle finger type"
                    }),
                    rightIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right index finger type"
                    }),
                    rightThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right thumb type"
                    }),
                    prefrontalLobePercent: t.Number({
                        default: 0,
                        description: "Prefrontal lobe percent"
                    }),
                    frontalLobePercent: t.Number({
                        default: 0,
                        description: "Frontal lobe percent"
                    }),
                    parietalLobePercent: t.Number({
                        default: 0,
                        description: "Parietal lobe percent"
                    }),
                    occipitalLobePercent: t.Number({
                        default: 0,
                        description: "Occipital lobe percent"
                    }),
                    temporalLobePercent: t.Number({
                        default: 0,
                        description: "Temporal lobe percent"
                    }),
                    happinessIndex: t.Number({
                        default: 0,
                        description: "Happiness index"
                    }),
                    hearingIndex: t.Number({
                        default: 0,
                        description: "Hearing index"
                    }),
                    movementIndex: t.Number({
                        default: 0,
                        description: "Movement index"
                    }),
                    visualIndex: t.Number({
                        default: 0,
                        description: "Visual index"
                    }),
                    userId: t.Number({
                        default: 0,
                        description: "User id"
                    })
                })
            })
            .get("/me", async ({user, userService}) => {
                return await userService.me(user.id)
            }, {
                checkAuth: ['user', 'admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
            .get("/get-fingerprint-result/:userId", async ({params, userService}) => {
                return await userService.getFingerprintResult(params.userId);
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
    )

export default userController