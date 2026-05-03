import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private authService: AuthService) {
    super({
      clientID:
        process.env.GOOGLE_CLIENT_ID ||
        "676999413369-srbf0l03q8l1fm77fo6nap5ef0hi7n5s.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "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",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "https://presupuesto-backend-39io.onrender.com/auth/google/callback",
      scope: ["profile", "email"],
      authorizationURL:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account",
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      googleId: id,
      email: emails[0].value,
      name: name.givenName + (name.familyName ? " " + name.familyName : ""),
      picture: photos[0].value,
    };

    const jwt = await this.authService.validateGoogleUser(user);
    done(null, jwt);
  }
}
