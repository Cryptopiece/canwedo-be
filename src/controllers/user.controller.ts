import {Elysia, t} from "elysia";
import userService from "../services/UserService";
import authMacro from "../macros/auth";
import {DermatoglyphicsType} from "../entities/Dermatoglyphics";

const userController = new Elysia()
    .group("/users", group =>
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
                        default: DermatoglyphicsType.AR,
                        description: "Left litter finger type"
                    }),
                    leftLitterFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left litter finger percent"
                    }),
                    leftLitterFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left litter finger rank"
                    }),
                    leftRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left ring finger type"
                    }),
                    leftRingFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left ring finger percent"
                    }),
                    leftRingFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left ring finger rank"
                    }),
                    leftMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left middle finger type"
                    }),
                    leftMiddleFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left middle finger percent"
                    }),
                    leftMiddleFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left middle finger rank"
                    }),
                    leftIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left index finger type"
                    }),
                    leftIndexFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left index finger percent"
                    }),
                    leftIndexFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left index finger rank"
                    }),
                    leftThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Left thumb type"
                    }),
                    leftThumbPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left thumb percent"
                    }),
                    leftThumbRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Left thumb rank"
                    }),
                    rightLitterFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right litter finger type"
                    }),
                    rightLitterFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right litter finger percent"
                    }),
                    rightLitterFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right litter finger rank"
                    }),
                    rightRingFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right ring finger type"
                    }),
                    rightRingFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right ring finger percent"
                    }),
                    rightRingFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right ring finger rank"
                    }),
                    rightMiddleFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right middle finger type"
                    }),
                    rightMiddleFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right middle finger percent"
                    }),
                    rightMiddleFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right middle finger rank"
                    }),
                    rightIndexFingerType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right index finger type"
                    }),
                    rightIndexFingerPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right index finger percent"
                    }),
                    rightIndexFingerRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right index finger rank"
                    }),
                    rightThumbType: t.Enum(DermatoglyphicsType, {
                        default: DermatoglyphicsType.AR,
                        description: "Right thumb type"
                    }),
                    rightThumbPercent: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right thumb percent"
                    }),
                    rightThumbRank: t.Number({
                        default: 0,
                        minimum: 0.1,
                        description: "Right thumb rank"
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