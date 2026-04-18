/* eslint-disable @typescript-eslint/no-explicit-any */ import passport from "passport";
import { envVars } from "./env";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20"
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';



passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        async (email: string, password: string, done: any) => {
            try {
                const isUserExits = await User.findOne({ email })
                /*      if (!isUserExits) {
                       return done(null, false, { message: "User does not exist" })
                   }
                      */
                if (!isUserExits) {
                    return done(null, false, { message: "User does not exist", statusCode: 401 })
                }

                // Email verification (disabled for now)
                // if (!isUserExits.isVerified) {
                //     return done(null, false, { message: "User is not verified", statusCode: 403 })
                // }

                if (isUserExits.isActive === IsActive.BLOCKED || isUserExits.isActive === IsActive.INACTIVE) {
                    return done(null, false, { message: `User is ${isUserExits.isActive}`, statusCode: 403 })
                }

                if (!isUserExits.isDeleted) {
                    return done(null, false, { message: "User is deleted", statusCode: 403 })
                }

                const isGoogleAuthenticated = isUserExits.auths.some(providerObjects => providerObjects.provider === "google")

                if (isGoogleAuthenticated && !isUserExits.password) {
                    return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
                }

                /* if (isGoogleAuthenticated) {
               return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
                } */

                const isPasswordMatch = await bcryptjs.compare(password as string, isUserExits.password as string)
                if (!isPasswordMatch) {
                    return done(null, false, { message: "Password does not match", statusCode: 401 })
                }

                return done(null, isUserExits)

            } catch (error) {
                //console.log(error)
                done(error)

            }
        }
    ))

// google login passport-google-oauth20
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "No email found" })
                }

                let isUserExist = await User.findOne({ email })


                // Email verification (disabled for now)
                // if (isUserExist && !isUserExist.isVerified) {
                //     return done(null, false, { message: "User is not verified" })
                // }

                if (isUserExist && (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)) {
                    done(`User is ${isUserExist.isActive}`)
                }

                if (isUserExist && isUserExist.isDeleted) {
                    return done(null, false, { message: "User is deleted" })
                }

                if (!isUserExist) {
                    isUserExist = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, isUserExist,
                    { message: "user create successfully" })

            } catch (error) {
                return done(error)

            }

        }
    ));


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        done(error)
    }
})


// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token

// Bridge == Google -> user db store -> token
//Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
//Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access
