import passport from "passport";
import { Op } from "sequelize";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./database";
import bcrypt from "bcrypt";

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
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Either email or password are incorrect",
          });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
  });

  done(null, user);
});

passport;
