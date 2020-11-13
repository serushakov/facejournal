import passport from "passport";
import { Op } from "sequelize";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "./database";

passport.use(
  new JwtStrategy(
    {
      secretOrKey: "very secret", // FIXME
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jsonWebTokenOptions: {
        maxAge: "1 day",
      },
    },
    async ({ email }, done) => {
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
