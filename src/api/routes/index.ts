import { Router } from "express";
import { authenticationRoutes } from "./Authentication";
import { userRouter } from "./User";

export const router = Router();

router.use("/", authenticationRoutes);
router.use("/user", userRouter);
