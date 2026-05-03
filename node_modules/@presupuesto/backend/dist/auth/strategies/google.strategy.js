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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth2_1 = require("passport-google-oauth2");
const auth_service_1 = require("../auth.service");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth2_1.Strategy, 'google') {
    constructor(authService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || '676999413369-srbf0l03q8l1fm77fo6nap5ef0hi7n5s.apps.googleusercontent.com',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
            scope: ['profile', 'email'],
            authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account',
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, name, emails, photos } = profile;
        const user = {
            googleId: id,
            email: emails[0].value,
            name: name.givenName + (name.familyName ? ' ' + name.familyName : ''),
            picture: photos[0].value,
        };
        const jwt = await this.authService.validateGoogleUser(user);
        done(null, jwt);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map