import {Elysia, t} from "elysia";
import authMacro from "../macros/auth";
import adminService from "../services/admin.service";
import {DermatoglyphicsType} from "../entities/Dermatoglyphics";

const adminController = new Elysia()
    .group("/admin", group =>
        group
            .use(adminService)
            .use(authMacro)
            .get("/system-info", ({adminService}) => {
                return adminService.getSystemInfo();
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
            .get('/users', ({adminService, query}) => {
                return adminService.getUsers(query.limit, query.offset, query.role);
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                query: t.Object({
                    limit: t.Number(),
                    offset: t.Number(),
                    role: t.String()
                })
            })
            .get("/chart-12-months", ({adminService}) => {
                return adminService.getChartData();
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
            .get('/latest-orders', ({adminService, query}) => {
                return adminService.getLatestOrders(query.limit, query.offset);
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                query: t.Object({
                    limit: t.Number(),
                    offset: t.Number(),
                })
            })
            .get('/orders', ({adminService, query}) => {
                return adminService.getOrders(query.limit, query.offset, query.checked);
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                query: t.Object({
                    limit: t.Number(),
                    offset: t.Number(),
                    checked: t.Boolean()
                })
            })
            .get("/get-result/:userId", ({adminService, params}) => {
                return adminService.getFingerprintResult(+params.userId);
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                params: t.Object({
                    userId: t.Number()
                })
            })
            .get(`/get-dermatoglyphics/:validatorId`, ({adminService, params, query}) => {
                const {limit, offset} = query;
                return adminService.getDermatoglyphics(+params.validatorId, limit, offset);
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                params: t.Object({
                    validatorId: t.Number()
                }),
                query: t.Object({
                    limit: t.Number(),
                    offset: t.Number(),
                })
            })
            .post("/update-fingerprint-result", ({adminService, body, user}) => {
                return adminService.updateFingerprintResult(body, user.id);
            }, {
                checkAuth: ['admin', 'contributor'],
                detail: {
                    tags: ["Admin"],
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
            .post('/update-user/:userId', ({adminService, body, params}) => {
                return adminService.updateUser(+params.userId, body);
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["Admin"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                body: t.Object({
                    role: t.String(),
                }),
                params: t.Object({
                    userId: t.Number()
                })
            })
    )

export default adminController;