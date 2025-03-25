import {Elysia} from "elysia";
import authMacro from "../macros/auth";
import adminService from "../services/admin.service";

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
    )

export default adminController;