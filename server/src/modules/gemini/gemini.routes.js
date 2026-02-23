import { Router } from "express";
import { askGeminiToMakeTaskAccordingToCarrer } from "./gemini.controller.js";

const router = Router();

router.post("/askGeminiToMakeTaskAccordingToCarrer", askGeminiToMakeTaskAccordingToCarrer);

export default router;