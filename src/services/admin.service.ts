import {Elysia} from "elysia";
import {initORM, Services} from "../db";
import {wrap} from "@mikro-orm/core";
import {fingerprintScore} from "../utils/constant";
import BigNumber from "bignumber.js";

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

    async getChartData() {
        return {
            userChart: await this.getUserChart12Month(),
            orderChart: await this.getOrderChart12Months()
        }
    }

    async getLatestOrders(limit: number, offset: number) {
        const db = await initORM()
        const data = await db.fingerprintImage.findAndCount({}, {
            populate: ['user'],
            orderBy: {
                createdAt: 'DESC'
            },
            limit,
            offset,
        })
        return {
            data: data[0],
            total: data[1]
        }
    }

    async getUsers(limit: number, offset: number, role: string) {
        const db = await initORM();
        const data = await db.user.findAndCount({role}, {limit, offset, populate: ["orderValidated"]});
        return {
            data: data[0],
            total: data[1]
        }
    }

    async updateFingerprintResult(body: any, validatorId: number) {
        const db = await initORM()
        const {score, totalScore} = this.getDetailScore(body);
        const fingerprintsPercentAndRank = this.calculateFingerprintProportion(totalScore, score);
        const lobePercent = this.calculateLobeProportion(totalScore, score);
        const vakIndex = this.calculateVakIndex(score);
        const happinessIndex = 50 - totalScore;
        const user = await db.user.findOneOrFail({id: body.userId});
        const validator = await db.user.findOneOrFail({id: validatorId});
        delete body.userId;
        if (user.dermatoglyphics) {
            const dermatoglyphics = await db.dermatoglyphics.findOneOrFail({user: user})
            if (dermatoglyphics.validator.id !== validatorId) throw new Error("You can't update this fingerprint result");
            wrap(dermatoglyphics).assign({
                ...body,
                ...fingerprintsPercentAndRank,
                ...lobePercent,
                ...vakIndex,
                happinessIndex,
            })
            await db.em.persistAndFlush(dermatoglyphics)
            return {message: "Fingerprint result updated"};
        }
        const dermatoglyphics = db.dermatoglyphics.create({
            ...body,
            ...fingerprintsPercentAndRank,
            ...lobePercent,
            ...vakIndex,
            happinessIndex,
            user,
            validator,
        });
        const fingerprint = await db.fingerprintImage.findOneOrFail({user: user});
        wrap(fingerprint).assign({checked: true});
        await db.em.persistAndFlush(dermatoglyphics);
        return {message: "Fingerprint result created"};
    }

    async updateUser(userId: number, body: any) {
        const db = await initORM();
        const user = await db.user.findOneOrFail({id: userId});
        wrap(user).assign(body);
        await db.em.persistAndFlush(user);
        return {message: "User updated"};
    }

    async getFingerprintResult(userId: number): Promise<any> {
        const db = await initORM();
        return await db.user.findOneOrFail({id: userId}, {populate: ['fingerprintImage', 'dermatoglyphics']});
    }

    private async getOrderChart12Months() {
        const db = await initORM()
        const now = new Date();
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const categories: string[] = [];
        const data: number[] = [];

        for (let i = 0; i < 12; i++) {
            const firstDay = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const count = await db.fingerprintImage.count({
                createdAt: {
                    $gte: firstDay,
                    $lt: lastDay
                }
            });

            categories.push(monthNames[firstDay.getMonth()]);
            data.push(count);
        }

        return {
            categories: categories.reverse(),
            data: data.reverse()
        };
    }

    private async getUserChart12Month() {
        const db = await initORM()
        const now = new Date();
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const categories: string[] = [];
        const data: number[] = [];

        for (let i = 0; i < 12; i++) {
            const firstDay = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const count = await db.user.count({
                createdAt: {
                    $gte: firstDay,
                    $lt: lastDay
                }
            });

            categories.push(monthNames[firstDay.getMonth()]);
            data.push(count);
        }

        return {
            categories: categories.reverse(),
            data: data.reverse()
        };
    }

    private async getUserGrowth(db: Services) {
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

    private async getOrderGrowth(db: Services) {
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

    private getDetailScore(body: any) {
        const score = {
            leftLitterFinger: fingerprintScore[body.leftLitterFingerType],
            leftRingFinger: fingerprintScore[body.leftRingFingerType],
            leftMiddleFinger: fingerprintScore[body.leftMiddleFingerType],
            leftIndexFinger: fingerprintScore[body.leftIndexFingerType],
            leftThumb: fingerprintScore[body.leftThumbType],
            rightLitterFinger: fingerprintScore[body.rightLitterFingerType],
            rightRingFinger: fingerprintScore[body.rightRingFingerType],
            rightMiddleFinger: fingerprintScore[body.rightMiddleFingerType],
            rightIndexFinger: fingerprintScore[body.rightIndexFingerType],
            rightThumb: fingerprintScore[body.rightThumbType],
        };
        const totalScore = Object.values(score).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0);
        return {score, totalScore}
    }

    private calculateFingerprintProportion(totalScore: any, score: any) {
        const res: any = {}
        Object.keys(score).forEach(key => {
            res[`${key}Percent`] = new BigNumber(score[key]).div(totalScore).times(100).toNumber()
        });
        const sortedScore = Object.keys(score).sort((a, b) => score[b] - score[a]);
        sortedScore.forEach((key, index) => {
            res[`${key}Rank`] = index + 1;
        });
        return res;
    }

    private calculateLobeProportion(totalScore: number, detailScore: any) {
        return {
            prefrontalLobePercent: new BigNumber(detailScore.leftThumb).plus(detailScore.rightThumb).div(totalScore).times(100).toNumber(),
            frontalLobePercent: new BigNumber(detailScore.leftIndexFinger).plus(detailScore.rightIndexFinger).div(totalScore).times(100).toNumber(),
            parietalLobePercent: new BigNumber(detailScore.leftMiddleFinger).plus(detailScore.rightMiddleFinger).div(totalScore).times(100).toNumber(),
            occipitalLobePercent: new BigNumber(detailScore.leftRingFinger).plus(detailScore.rightRingFinger).div(totalScore).times(100).toNumber(),
            temporalLobePercent: new BigNumber(detailScore.leftLitterFinger).plus(detailScore.rightLitterFinger).div(totalScore).times(100).toNumber(),
        }
    }

    private calculateVakIndex(detailScore: any) {
        const vakTotalNumber = new BigNumber(detailScore.leftLitterFinger)
            .plus(detailScore.leftRingFinger)
            .plus(detailScore.leftMiddleFinger)
            .plus(detailScore.rightLitterFinger)
            .plus(detailScore.rightRingFinger)
            .plus(detailScore.rightMiddleFinger);
        return {
            movementIndex: new BigNumber(detailScore.leftLitterFinger).plus(detailScore.rightLitterFinger).div(vakTotalNumber).times(100).toNumber(),
            hearingIndex: new BigNumber(detailScore.leftRingFinger).plus(detailScore.rightRingFinger).div(vakTotalNumber).times(100).toNumber(),
            visualIndex: new BigNumber(detailScore.leftMiddleFinger).plus(detailScore.rightMiddleFinger).div(vakTotalNumber).times(100).toNumber(),
        }
    }
}

export default new Elysia().decorate('adminService', new AdminService())