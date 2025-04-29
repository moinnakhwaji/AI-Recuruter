import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Your Prompt
const PROMPT = `{{conversation}}

Based on this interview conversation between assistant and user:

Give me feedback for the user's interview. Rate out of 10 for technical skills, 
communication, problem-solving, and experience. Also, give a summary in 3 lines 
and one line recommendation whether the candidate is recommended for hire or not.

Respond ONLY in the following JSON format WITHOUT any explanation:

{
  "feedback": {
    "rating": {
      "technicalSkills": 5,
      "communication": 6,
      "problemSolving": 4,
      "experience": 7
    },
    "summary": "<in 3 lines>",
    "recommendation": true,
    "recommendationMsg": "<message>"
  }
}
`;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('Interview ID:', id);

    const { conversation, username } = await request.json();

    if (!conversation || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the interview
    const interview = await db.interview.findUnique({
      where: { interview_id: id },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Replace {{conversation}} inside the prompt
    const FinalPrompt = PROMPT.replace('{{conversation}}', conversation);

    const model = 'gemini-2.5-flash-preview-04-17';

    const contents = [
      {
        role: 'user',
        parts: [{ text: FinalPrompt }],
      },
    ];

    const config = { responseMimeType: 'text/plain' };

    const response = await ai.models.generateContentStream({ model, config, contents });

    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk.text;
    }

    // Clean the response
    const cleanedResponse = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Extract JSON block
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    const jsonString = cleanedResponse.slice(jsonStart, jsonEnd + 1);

    console.log('Extracted JSON String:', jsonString);

    const parsedResponse = JSON.parse(jsonString);

    // Save Feedback to Database
    const savedFeedback = await db.feedback.create({
      data: {
        interview_id: id,
        feedback: parsedResponse.feedback,
        recommendation: parsedResponse.feedback.recommendation,
        username,
      },
    });

    return NextResponse.json({ message: 'Feedback saved successfully', savedFeedback });
  } catch (error) {
    console.error('Error generating/saving feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
