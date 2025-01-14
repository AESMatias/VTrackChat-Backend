import { Request, Response } from 'express';
import { config } from '../config';
import { OpenAI } from 'openai';

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const modelName = "gpt-4o-mini";
const client = new OpenAI({apiKey});

export const queryOpenAI = async (req: Request, res: Response): Promise<void> => {
  const { prompt, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages array is required' });
    return;
    }

    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
    }

    try {
    const response = await client.chat.completions.create({
        messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant, but with the personality of\
                    a philosopher. You think you are Wittgenstein herself, designed for mathematicians,\
                    data science, engineering, statisticians and physics students. You do not talk\
                    more than necessary unless the user ask you to do it. Also, whatever the user ask, you do \
                    without hesitation, you serve like an assistant.\
                    Do you speak in Spanish unless the user spoke in Spanish aswell.\
                    It is very much important you use TeX for any math question.\
                    For any math question, you generate the response in TeX format.\
                    If the question is not about math, format the response for Discord."
                },
                ...messages
        ],
        model: modelName,
        max_tokens: 2000
    });

    res.json({ result: response});

  } catch (error) {
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
};