import { Request, Response } from 'express';
import { config } from '../config';
import { OpenAI } from 'openai';
import logger from '../logger';

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const modelName = "gpt-4o-mini";
const client = new OpenAI({apiKey});

export const queryOpenAI = async (req: Request, res: Response): Promise<void> => {
    try {
        let { prompt, messages } = req.body;

        if (!prompt) {
            res.status(400).json({ error: 'Prompt is required' });
            return;
        }

        if (!messages || !Array.isArray(messages)) {
            // res.status(400).json({ error: 'Messages array is required' });
            // messages = [
            // {
            //     role: "user",
            //     content: `${prompt}`
            // }];
            messages = [];
        }

        //  Filter out any messages that don't have a role or content, or are not objects.
        messages = messages.filter(
            (msg) => msg 
            && typeof msg === "object" 
            && msg.role 
            && msg.content
            && typeof msg.role === "string" 
            && typeof msg.content === "string"
        );

        // Limit the messages to the last four to optimize the context
        const lastThreeMessages = messages.slice(-3);

        // Add the user's prompt to the last four messages if it's not already there
        lastThreeMessages.push({ role: "user", content: prompt });

        // Final messages to send to OpenAI
        const finalMessages = [
            {
                role: "system",
                content:
                    "You are a helpful assistant, but with the personality of a philosopher. You think you are Wittgenstein herself, designed for mathematicians, data science, engineering, statisticians, and physics students. You do not talk more than necessary unless the user asks you to do it. Also, whatever the user asks, you do without hesitation, you serve like an assistant.",
            },
            ...lastThreeMessages,
        ];

        console.log('req completo:', req.body);
        // logger.info(`Querying OpenAI with prompt: ${req.body}`); // [object Object]

        // //If the user is premium, then the last four messages are saved so he can have a better context
        // const lastFourMessages = [];

        //If the messages are more than 4, then the last four messages are saved
        // if (messages.length > 4){
        //     messages = messages.slice(messages.length-4, messages.length);
        // }

        // for (let i=0; i<messages.length; i++){

        //     // const actualQuery = messages[i].query;
        //     // const actualResponse = messages[i].response;

        //     lastFourMessages.push({
        //         role: "user",
        //         content: `${messages[i].content}`
        //     });

        //     // lastFourMessages.push({
        //     //     role: "assistant",
        //     //     content: `${actualResponse}`
        //     // });
        // }

        // messages = [
        //     {
        //         role: "user",
        //         content: `${prompt}`
        //     },
        //     ...lastFourMessages
        // ]

        const response = await client.chat.completions.create({
            messages: finalMessages,
            model: modelName,
            max_tokens: 2000,
        });

        res.json({ result: response});

  } catch (error) {
    console.error('Error at queryOpenAI:', error)
    logger.error(`Error: ${error.message}, Path: ${req.path}, Stack: ${error.stack}`);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
};