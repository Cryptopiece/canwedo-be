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
            .get("/me", ({user, userService}) => {
                return userService.me(user.id)
            }, {
                checkAuth: ['user', 'admin', 'contributor'],
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
            .post("/update-profile-info", ({user, userService, body}) => {
                return userService.updateProfileInfo(user.id, body)
            }, {
                checkAuth: ['contributor', 'admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
                body: t.Object({
                    firstName: t.String(),
                    lastName: t.String(),
                    phone: t.String(),
                    bio: t.String(),
                })
            })
    )

export default userController