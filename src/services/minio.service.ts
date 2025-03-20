import * as Minio from 'minio'
import {Elysia} from "elysia";

export class MinioService {
    private readonly MinioClient = new Minio.Client({
        region: 'ap-east-1',
        endPoint: Bun.env.FCS_WEB3_END_POINT as string,
        useSSL: true,
        accessKey: Bun.env.FCS_WEB3_ACCESS_KEY,
        secretKey: Bun.env.FCS_WEB3_SECRET_KEY,
    })
    private readonly MINIO_BUCKET_NAME = Bun.env.FCS_WEB3_BUCKET_NAME as string


    async makePresignedUrl(objectName: string, expiry: number = 24 * 60 * 60) {
        return {
            url: await this.MinioClient.presignedPutObject(this.MINIO_BUCKET_NAME, objectName, expiry)
        }
    }
}

export default new Elysia().decorate('minioService', new MinioService())