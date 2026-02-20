import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools'; 

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("Messages are ",messages)
  //TODO TASK 1
  const context=`
  College Culturals & Extra-Curricular Information:

  Responsibilities:
  - Organizing cultural events and inter-college fests
  - Managing club activities (music, dance, drama, coding, sports, etc.)
  - Coordinating event registrations
  - Sharing practice schedules and venue details
  - Guiding students on participation rules

  Event Timings:
  Usually conducted after college hours (4:30pm onwards) or on weekends.

  Contact:
  Students can approach the culturals office for approvals and event-related queries.
  `
  const systemPrompt = `You are the College Culturals and Extra-Curricular Head.
  You guide students about events, club activities, registrations, schedules, and participation rules.
  Always respond in an enthusiastic yet professional tone.
  Keep responses crisp and within 2 sentences maximum.
  Following is the context:
  ${context}
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use (model calls tool → gets result → responds)
  });

  return result.toUIMessageStreamResponse();
}