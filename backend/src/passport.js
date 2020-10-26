import passport from "passport";
import { Op } from "sequelize";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./database/index";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: {
            email: {
              [Op.eq]: email,
            },
            password: {
              [Op.eq]: password,
            },
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Either email or password are incorrect",
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
