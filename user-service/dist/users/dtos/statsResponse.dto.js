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
exports.StatsResponseDto = exports.PostDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const dist_1 = require("database-service-arth/dist");
// Assuming you have a Post entity
let PostDto = class PostDto {
};
exports.PostDto = PostDto;
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }),
    __metadata("design:type", BigInt)
], PostDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PostDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PostDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }),
    __metadata("design:type", BigInt)
], PostDto.prototype, "modifiedBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }),
    __metadata("design:type", BigInt)
], PostDto.prototype, "createdBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }),
    __metadata("design:type", BigInt)
], PostDto.prototype, "channelId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PostDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], PostDto.prototype, "modifiedAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], PostDto.prototype, "deletedAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PostDto.prototype, "isDeleted", void 0);
exports.PostDto = PostDto = __decorate([
    (0, graphql_1.ObjectType)()
], PostDto);
let StatsResponseDto = class StatsResponseDto {
};
exports.StatsResponseDto = StatsResponseDto;
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }),
    __metadata("design:type", BigInt)
], StatsResponseDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return PostDto;
    }, { nullable: true }),
    __metadata("design:type", Object)
], StatsResponseDto.prototype, "postWithMaxLikes", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return PostDto;
    }, { nullable: true }),
    __metadata("design:type", Object)
], StatsResponseDto.prototype, "postWithMinLikes", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "totalComments", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "totalReplies", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "totalLikesOnPosts", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "totalLikesOnComments", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "totalLikesOnReplies", void 0);
exports.StatsResponseDto = StatsResponseDto = __decorate([
    (0, graphql_1.ObjectType)()
], StatsResponseDto);
