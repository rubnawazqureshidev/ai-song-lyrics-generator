// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';
const openai = new OpenAI();


export const runtime = 'edge'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if(req.method !== "POST") {
    res.status(403).json({ error: "Method not allowed" })
    return;
  }

  const body = JSON.parse(req.body);

  console.log((body.prompt));

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    max_tokens: 500,
    messages: [
      {
        role: "assistant",
        content: "Your job is to finish any sentence the user start without repeating the sentence the user save"
      },
      { role: "user", content: `${body.prompt}` }
    ],
    stream: true
  });


  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || '');
  }

  
  res.write("END STREAMS");
  res.end();
}
