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
exports.ChannelDao = void 0;
const common_1 = require("@nestjs/common");
const dist_1 = require("database-service-arth/dist");
const drizzle_orm_1 = require("drizzle-orm");
let ChannelDao = class ChannelDao {
    constructor(userActivityDao) {
        this.userActivityDao = userActivityDao;
    }
    formatDateForMySQL(dateString) {
        const [day, month, year] = dateString.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
    async createChannelDao(input, context) {
        console.log('in create block');
        try {
            const dataObject = {
                name: input.name,
                createdAt: new Date(),
                isDeleted: false,
            };
            const newChannel = await dist_1.db.insert(dist_1.channels).values(dataObject); // .returning() returns inserted row(s)
            if (newChannel[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, dataObject);
                return 'ok done with status 200';
            }
            throw new Error('Check your data');
            // Return the first inserted channel
        }
        catch (error) {
            console.log(error);
            throw new Error('Database error !');
        }
    }
    async getChannelsDao(context) {
        try {
            const response = (await dist_1.db
                .select()
                .from(dist_1.channels));
            await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { request: 'success' });
            return response;
        }
        catch (error) {
            console.log('error-->', error);
            throw new Error('Database error !');
        }
    }
    async deleteChannelDao(input, context) {
        try {
            const { id } = input;
            const response = await dist_1.db.delete(dist_1.channels).where((0, drizzle_orm_1.eq)(dist_1.channels.id, id));
            console.log(response);
            if (response[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { id: id.toString() });
                return `channel with id ${id} deleted successfully`;
            }
            throw new Error(`channel id not found -> ${id}`);
        }
        catch (error) {
            throw new Error(`error in db with mesage -> ${error}`);
        }
    }
    async updateChannel(input, context) {
        try {
            const { id, name } = input;
            const channel = await dist_1.db
                .select()
                .from(dist_1.channels)
                .where((0, drizzle_orm_1.eq)(dist_1.channels.id, id))
                .limit(1);
            if (!channel) {
                throw new Error(`channel with id ${id} not found`);
            }
            const updatedData = {};
            // Update only the fields that were provided in the input
            if (name !== undefined) {
                updatedData.name = name;
            }
            updatedData.modifiedAt = new Date();
            // Save the updated channel
            const response = await dist_1.db
                .update(dist_1.channels)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(dist_1.channels.id, id));
            if (response[0].affectedRows !== 0) {
                await this.userActivityDao.addUserActivity(context.activityDone, context.userId, { ...input, id: id.toString() });
                return `channel of id  ${input.id} updated successfully`;
            }
            throw new Error(`channel of id ${id} not updated`);
        }
        catch (error) {
            throw new Error(`database error-> ${error}`);
        }
    }
};
exports.ChannelDao = ChannelDao;
exports.ChannelDao = ChannelDao = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dist_1.UserActivityDao])
], ChannelDao);
