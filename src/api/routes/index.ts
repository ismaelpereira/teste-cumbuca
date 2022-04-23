import { Router } from "express";
import { userRouter } from "./User";

export const router = Router();

router.use("/user", userRouter);
