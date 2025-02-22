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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const activityResponse_dto_1 = require("database-service-arth/dist/commonHelpers/activityResponse.dto");
const authGaurd_gaurds_1 = require("../gaurds/authGaurd.gaurds");
const authGuardContext_dto_1 = require("../gaurds/authGuardContext.dto");
const createInput_dto_1 = require("./dtos/createInput.dto");
const deleteInput_dto_1 = require("./dtos/deleteInput.dto");
const response_dto_1 = require("./dtos/response.dto");
const statsInput_dto_1 = require("./dtos/statsInput.dto");
const statsResponse_dto_1 = require("./dtos/statsResponse.dto");
const updateInput_dto_1 = require("./dtos/updateInput.dto");
const user_service_1 = require("./user.service");
let UsersResolver = class UsersResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers(context) {
        if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
            return this.usersService.getUsers(context);
        }
        throw new common_1.UnauthorizedException('You dont have access to this request with role of user}');
    }
    async getUserActivity(context) {
        if (context.role === 'ADMIN' || context.role === 'SUPERADMIN') {
            return this.usersService.getUserActivity();
        }
        throw new common_1.UnauthorizedException('You dont have access to this request with role of user}');
    }
    async getUserByEmail(email, context) {
        // console.log("resolver access",cont)
        if (email === context.email) {
            return this.usersService.findUserByEmail(email, context);
        }
        throw new common_1.UnauthorizedException(`You dont have access to this request of email ${email}`);
    }
    async getUserStats(input, context) {
        return this.usersService.getUserStats(input, context);
    }
    async createUser(input, context) {
        if (input.role === 'SUPERADMIN') {
            throw new common_1.UnauthorizedException(`You dont have access to this request of creating user of role ${context.role}`);
        }
        else if (input.role === 'ADMIN' && context.role !== 'SUPERADMIN') {
            throw new common_1.UnauthorizedException(`You dont have access to this request of creating user of role ${context.role}`);
        }
        else {
            return this.usersService.createUser(input, context);
        }
    }
    async deleteUser(input, context) {
        const { id } = input;
        if ((id === context.userId && context.role === 'USER') ||
            context.role === 'SUPERADMIN') {
            return this.usersService.deleteUser(input, context.role, context); // You can access `input.id` directly
        }
        else if (context.role === 'ADMIN') {
            return this.usersService.deleteUser(input, context.role, context, context.channels);
        }
        throw new common_1.UnauthorizedException(`You dont have rights to this to delete user of id ${id}`);
    }
    async updateUser(input, context) {
        const { id } = input;
        if (id === context.userId || context.role === 'SUPERADMIN') {
            return this.usersService.updateUser(input, context); // You can access `input.id` directly
        }
        throw new common_1.UnauthorizedException(`You dont have rights to this to update user of id ${id}`);
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, graphql_1.Query)(() => {
        return [response_dto_1.UserResponseDto];
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUsers", null);
__decorate([
    (0, graphql_1.Query)(() => {
        return [activityResponse_dto_1.UserActivityResponseDto];
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUserActivity", null);
__decorate([
    (0, graphql_1.Query)(() => {
        return [response_dto_1.UserResponseDto];
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUserByEmail", null);
__decorate([
    (0, graphql_1.Query)(() => {
        return [statsResponse_dto_1.StatsResponseDto];
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statsInput_dto_1.StatsUserInput,
        authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUserStats", null);
__decorate([
    (0, graphql_1.Mutation)(() => {
        return String;
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createInput_dto_1.CreateUserInput,
        authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "createUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => {
        return String;
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deleteInput_dto_1.DeleteUserInput,
        authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "deleteUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => {
        return String;
    }),
    (0, common_1.UseGuards)(authGaurd_gaurds_1.AuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateInput_dto_1.UpdateUserInput,
        authGuardContext_dto_1.AuthGaurdContextDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [user_service_1.UsersService])
], UsersResolver);
