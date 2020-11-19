import express from "express";
import passport from "passport";
import handleLogin from "./handleLogin";
import handleRegister from "./handleRegister";

const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate("jwt"));

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) return res.send(401);

  res.send(req.user);
});

export default router;
