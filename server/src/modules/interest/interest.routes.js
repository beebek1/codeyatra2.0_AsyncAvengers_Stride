import { Router } from "express";
import { addInterest, getUserInterests } from "./interest.controller.js";
import authGuard from "../../middleware/authGuard.js";

const router = Router();

// Add new interest(s) for a user
router.post("/",authGuard, addInterest);

// Get all interests for a user
router.get("/:userId", getUserInterests);

export default router;