import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";


const rateLimiterAuthenticated = new RateLimiterMemory({
    points: 1, // Maximum n requests
    duration: 1, // Every x seconds
});

export const limitMiddlewareAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user; // Asumming that the user object is attached to the request object.
        await rateLimiterAuthenticated.consume(user.id);
        next();
    } catch {
        return res.status(429).json({ error: "Rate limit exceeded" });
    }
};