import { Request, Response } from 'express';
import { config } from '../config';
import { OpenAI } from 'openai';

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const modelName = "gpt-4o-mini";
const client = new OpenAI({apiKey});

export const queryOpenAI = async (req: Request, res: Response): Promise<void> => {
  let { prompt, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
    // res.status(400).json({ error: 'Messages array is required' });
    messages = [
      {
          role: "user",
          content: `${prompt}`
      }];
    }

      messages = messages.map(message => ({
        role: "user", // TODO: Not always user, sometimes assistant, sometimes system, FIX THIS!
        content: `${prompt}`,
    }));

    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
    }
    
    console.error('req completo:', req.body)
    console.error('messags', messages)

    try {

        //If the user is premium, then the last four messages are saved so he can have a better context
        const lastFourMessages = [];
        //If the messages are more than 4, then the last four messages are saved
        if (messages.length > 4){
            messages = messages.slice(messages.length-4, messages.length);
        }

        for (let i=0; i<messages.length; i++){

            const actualQuery = messages[i].query;
            const actualResponse = messages[i].response;

            lastFourMessages.push({
                role: "user",
                content: `${actualQuery}`
            });

            lastFourMessages.push({
                role: "assistant",
                content: `${actualResponse}`
            });
        }

        messages = [
            {
                role: "user",
                content: `${prompt}`
            },
            ...lastFourMessages
        ]


    const response = await client.chat.completions.create({
        messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant, but with the personality of\
                    a philosopher. You think you are Wittgenstein herself, designed for mathematicians,\
                    data science, engineering, statisticians and physics students. You do not talk\
                    more than necessary unless the user ask you to do it. Also, whatever the user ask, you do \
                    without hesitation, you serve like an assistant"
                },
                ...messages
        ],
        model: modelName,
        max_tokens: 2000
    });

    res.json({ result: response});

  } catch (error) {
    console.error('Error at queryOpenAI:', error)
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
};