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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const dist_1 = require("database-service-arth/dist");
const drizzle_orm_1 = require("drizzle-orm");
let AuthGuard = class AuthGuard {
    constructor(jwtService // Inject JwtService to verify token
    ) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        // const requested_service = context.args[3].fieldName
        const request = context.getArgs()[2];
        console.log(request.req);
        const token = request.req.raw?.headers.authorization;
        const { fieldName } = context.getArgs()[3];
        // Check if the token is provided
        if (fieldName === 'login') {
            request.activityDone = fieldName;
            return true;
        }
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            // Extract the JWT payload (email and roles)
            const decodedToken = this.jwtService.verify(token);
            console.log('decoded token: ', decodedToken);
            const { email } = decodedToken;
            const { role } = decodedToken;
            const id = decodedToken.sub;
            // Query the database to check if the email and roles exist in the users table
            const user = await dist_1.db
                .select()
                .from(dist_1.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(dist_1.users.email, email), (0, drizzle_orm_1.eq)(dist_1.users.role, role)));
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid email or roles');
            }
            // Attach user information to the request object (for use in other guards or controllers)
            request.email = email;
            request.role = role;
            request.userId = id;
            request.activityDone = fieldName;
            const getChannelIds = (data) => {
                return data.map(({ channelId }) => {
                    return channelId;
                });
            };
            console.log(request.role);
            // write logic to extract list of channels he have accessed to admin
            if (role === 'ADMIN') {
                const channelsAccess = await dist_1.db
                    .select()
                    .from(dist_1.usersChannelMapping)
                    .where((0, drizzle_orm_1.eq)(dist_1.usersChannelMapping.userId, id));
                request.channels = getChannelIds(channelsAccess);
            }
            // console.log("context req",context.a)
            return true; // Allow access if the user is found and roles match
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`Invalid or expired token -> ${error}`);
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService // Inject JwtService to verify token
    ])
], AuthGuard);
