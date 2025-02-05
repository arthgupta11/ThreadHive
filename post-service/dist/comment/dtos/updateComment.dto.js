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
exports.UpdateCommentInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const dist_1 = require("database-service/dist");
let UpdateCommentInput = class UpdateCommentInput {
};
exports.UpdateCommentInput = UpdateCommentInput;
__decorate([
    (0, graphql_1.Field)(() => dist_1.BigIntScalar) // Assuming BigIntScalar is properly imported
    ,
    __metadata("design:type", BigInt)
], UpdateCommentInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => dist_1.BigIntScalar),
    __metadata("design:type", BigInt)
], UpdateCommentInput.prototype, "modifiedBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateCommentInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => dist_1.BigIntScalar),
    __metadata("design:type", BigInt)
], UpdateCommentInput.prototype, "channelId", void 0);
__decorate([
    (0, graphql_1.Field)(() => dist_1.BigIntScalar),
    __metadata("design:type", BigInt)
], UpdateCommentInput.prototype, "postId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UpdateCommentInput.prototype, "modifiedAt", void 0);
exports.UpdateCommentInput = UpdateCommentInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateCommentInput);
