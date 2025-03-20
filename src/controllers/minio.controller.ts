import {Elysia, t} from "elysia";
import minioService from "../services/minio.service";
import authMacro from "../macros/auth";

const minioController = new Elysia()
    .group("/minio", group =>
        group
            .use(minioService)
            .use(authMacro)
            .get("/presigned-url", ({query, minioService}) => {
                return minioService.makePresignedUrl(query.objectName);
            }, {
                detail: {
                    tags: ["Minio"],
                },
                query: t.Object({
                    objectName: t.String()
                })
            })
    )
export default minioController;