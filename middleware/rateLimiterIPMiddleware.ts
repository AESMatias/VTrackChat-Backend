import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiterIP = new RateLimiterMemory({
    points: 4, // Maximum 10 requests
    duration: 10, // Every 60 seconds
});

export const limitMiddlewareIP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiterIP.consume(req.ip);
        next();
    } catch {
        return res.status(429).json({ error: "Error: Too many requests in a short time, please try again later." });
    }
};