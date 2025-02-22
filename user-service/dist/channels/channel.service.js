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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const channel_dao_1 = require("./channel.dao");
let ChannelsService = class ChannelsService {
    constructor(channelDao) {
        this.channelDao = channelDao;
        this.unauthorisedAccessMessage = 'You are not allowed only super admin can access';
    } // Inject `ChannelDao`
    async createChannel(input, context) {
        if (context.role === 'SUPERADMIN') {
            return this.channelDao.createChannelDao(input, context);
        }
        else {
            throw new common_1.UnauthorizedException(this.unauthorisedAccessMessage);
        }
    }
    async getChannel(context) {
        if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
            return this.channelDao.getChannelsDao(context);
        }
        else {
            throw new common_1.UnauthorizedException('You are not allowed only super admin or admin can access');
        }
    }
    async deleteChannel(input, context) {
        if (context.role === 'SUPERADMIN') {
            return this.channelDao.deleteChannelDao(input, context);
        }
        else {
            throw new common_1.UnauthorizedException(this.unauthorisedAccessMessage);
        }
    }
    async updateChannel(input, context) {
        if (context.role === 'SUPERADMIN') {
            return this.channelDao.updateChannel(input, context);
        }
        else {
            throw new common_1.UnauthorizedException(this.unauthorisedAccessMessage);
        }
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [channel_dao_1.ChannelDao])
], ChannelsService);
