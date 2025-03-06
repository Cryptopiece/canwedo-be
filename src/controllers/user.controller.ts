import {Elysia, t} from "elysia";
import userService from "../services/UserService";
import authMacro from "../macros/auth";

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
            .get("/me", async ({user, userService}) => {
                return await userService.me(user)
            }, {
                checkAuth: ['user'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
            .get("/admin", async ({user}) => {
                return user
            }, {
                checkAuth: ['admin'],
                detail: {
                    tags: ["User"],
                    security: [
                        {JwtAuth: []}
                    ],
                },
            })
    )

export default userController