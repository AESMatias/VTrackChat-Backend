import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";


const rateLimiterAuth = new RateLimiterMemory({
    points: 50, // Allow n request
    duration: 1, // Every x seconds
});

// Rate limiter for login and register routes
export const limitAuthRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiterAuth.consume(req.ip);
        next();
    } catch {
        return res.status(429).json({ error: "Error: Too many requests. Please try again later." });
    }
};