"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChannelDao = void 0;
const common_1 = require("@nestjs/common");
const dist_1 = require("database-service-arth/dist");
const drizzle_orm_1 = require("drizzle-orm");
let UserChannelDao = class UserChannelDao {
    constructor(userActivityDao) {
        this.userActivityDao = userActivityDao;
    }
    async createUserChannelMapppingDao(input, context) {
        try {
            const dataObject = {
                userId: input.userId,
                channelId: input.channelId,
            };
            const newUser = await dist_1.db.insert(dist_1.usersChannelMapping).values(dataObject); // .returning() returns inserted row(s)
            if (newUser[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, {
                    userId: dataObject.userId.toString(),
                    channelId: dataObject.channelId.toString(),
                });
                return 'ok done with status 200';
            }
            throw new Error('Check your data');
            // Return the first inserted user
        }
        catch (error) {
            console.log(error);
            throw new Error('Database error !');
        }
    }
    async getUsersChannelDao(context) {
        try {
            const response = (await dist_1.db
                .select()
                .from(dist_1.usersChannelMapping));
            await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { request: 'success' });
            return response;
        }
        catch (error) {
            console.log('error-->', error);
            throw new Error('Database error !');
        }
    }
    async deleteUserChannelDao(input, context) {
        try {
            const { id } = input;
            const response = await dist_1.db
                .delete(dist_1.usersChannelMapping)
                .where((0, drizzle_orm_1.eq)(dist_1.usersChannelMapping.id, id));
            console.log(response);
            if (response[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { id: id.toString() });
                return `user mapping with if ${id} deleted successfully`;
            }
            throw new Error(`user id not found -> ${id}`);
        }
        catch (error) {
            throw new Error(`error in db with mesage -> ${error}`);
        }
    }
    async updateUserChannel(input, context) {
        try {
            const { id, userId, channelId } = input;
            const user = await dist_1.db
                .select()
                .from(dist_1.usersChannelMapping)
                .where((0, drizzle_orm_1.eq)(dist_1.usersChannelMapping.id, id))
                .limit(1);
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
            const updatedData = {};
            // Update only the fields that were provided in the input
            if (userId !== undefined) {
                updatedData.userId = userId;
            }
            if (channelId !== undefined) {
                updatedData.channelId = channelId;
            }
            updatedData.modifiedAt = new Date();
            // Save the updated user
            const response = await dist_1.db
                .update(dist_1.usersChannelMapping)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(dist_1.usersChannelMapping.id, id));
            if (response[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { ...input, id: id.toString() });
                return `user mapping of id  ${input.id} updated successfully`;
            }
            throw new Error(`user of id ${id} not updated`);
        }
        catch (error) {
            throw new Error(`database error->  ${error}`);
        }
    }
};
exports.UserChannelDao = UserChannelDao;
exports.UserChannelDao = UserChannelDao = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dist_1.UserActivityDao])
], UserChannelDao);
