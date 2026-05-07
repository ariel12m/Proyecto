"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_service_1 = require("./auth/auth.service");
const auth_controller_1 = require("./auth/auth.controller");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const user_service_1 = require("./user/user.service");
const user_controller_1 = require("./user/user.controller");
const event_service_1 = require("./event/event.service");
const event_controller_1 = require("./event/event.controller");
const event_module_1 = require("./event/event.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '1h' }
                })
            }),
            event_module_1.EventModule
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController, event_controller_1.EventController],
        providers: [
            prisma_service_1.PrismaService,
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            user_service_1.UserService,
            event_service_1.EventService,
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map