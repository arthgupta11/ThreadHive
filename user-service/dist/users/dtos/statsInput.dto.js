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
exports.StatsUserInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const dist_1 = require("database-service-arth/dist");
let StatsUserInput = class StatsUserInput {
};
exports.StatsUserInput = StatsUserInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], StatsUserInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], StatsUserInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => {
        return dist_1.BigIntScalar;
    }, { nullable: true }) // Assuming BigIntScalar is properly imported
    ,
    __metadata("design:type", BigInt)
], StatsUserInput.prototype, "userId", void 0);
exports.StatsUserInput = StatsUserInput = __decorate([
    (0, graphql_1.InputType)()
], StatsUserInput);
