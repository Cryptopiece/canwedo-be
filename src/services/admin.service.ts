import {Elysia} from "elysia";
import {initORM, Services} from "../db";

export class AdminService {

    async getSystemInfo() {
        const db = await initORM()
        const totalUser = await db.user.count();
        const totalOrder = await db.fingerprintImage.count();
        const orderChecked = await db.fingerprintImage.count({checked: true});
        const userGrowth = await this.getUserGrowth(db);
        const orderGrowth = await this.getOrderGrowth(db);
        return {totalUser, totalOrder, orderChecked, orderPending: totalOrder - orderChecked, userGrowth, orderGrowth};
    }

    async getUserGrowth(db: Services) {
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthUsers = await db.user.count({
            createdAt: {
                $gte: firstDayOfCurrentMonth
            }
        });

        const previousMonthUsers = await db.user.count({
            createdAt: {
                $gte: firstDayOfPreviousMonth,
                $lt: lastDayOfPreviousMonth
            }
        });

        const growthPercentage = previousMonthUsers > 0 ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(2) : 0;

        return {
            currentMonthUsers,
            previousMonthUsers,
            growthPercentage: Number(growthPercentage)
        };
    }

    async getOrderGrowth(db: Services) {
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthOrders = await db.fingerprintImage.count({
            createdAt: {
                $gte: firstDayOfCurrentMonth
            }
        });

        const previousMonthOrders = await db.fingerprintImage.count({
            createdAt: {
                $gte: firstDayOfPreviousMonth,
                $lt: lastDayOfPreviousMonth
            }
        });

        const growthPercentage = previousMonthOrders > 0 ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders * 100).toFixed(2) : 0;

        return {
            currentMonthOrders,
            previousMonthOrders,
            growthPercentage: Number(growthPercentage)
        };
    }
}

export default new Elysia().decorate('adminService', new AdminService())