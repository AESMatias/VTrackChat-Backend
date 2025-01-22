import { Request, Response, NextFunction } from "express";


const queue: Request[] = [];
const MAX_CONCURRENT_REQUESTS = parseInt(process.env.MAX_CONCURRENT_REQUESTS, 10)

// This middleware will use a queue to limit the number of concurrent requests to the server on /openai/query route.
// This way, we avoid the server has run out of memory, because the image processing is a heavy task in memory terms.
export const requestQueueMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (queue.length >= MAX_CONCURRENT_REQUESTS) {
        return res.status(503).json({ error: "Error: Server busy, please wait a moment and try again" });
    }

    queue.push(req);
    next();

    const removeFromQueue = () => {
        const index = queue.indexOf(req);
        if (index !== -1) queue.splice(index, 1);
    };

    res.on("finish", removeFromQueue);
    res.on("close", removeFromQueue); // In case the client closes the connection early, remove the request from the queue.
};