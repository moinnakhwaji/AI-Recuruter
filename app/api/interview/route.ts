import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Ensure the API key is correctly set
});

const PROMPT = `You are an expert technical interviewer. Based on the following inputs, generate a well-structured list of high-quality interview questions: Job Title: {{jobTitle}} Job Description:{{jobDescription}} Interview Duration: {{duration}} Interview Type: {{type}}

 Your task: Analyze the job description to identify key responsibilities, required skills, and expected experience. Generate a list of interview questions depending on interview duration. Adjust the number and depth of questions to match the interview duration. Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with an array list of questions. format: interviewQuestions=[ { question:"", type:"Technical/Behavioral/Experience/Problem Solving/Leadership" },{ ... }] The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role`;

export async function POST(req: any) {
  try {
    const { jobposition, jobdescription, duration, questionlist } = await req.json();
    
    // Replace placeholders in the prompt
    const Final_Prompt = PROMPT.replace('{{jobTitle}}', jobposition)
                                .replace('{{jobDescription}}', jobdescription)
                                .replace('{{type}}', questionlist)
                                .replace("{{duration}}", duration);

    console.log(Final_Prompt);  // Debugging the final prompt text

    const config = {
      responseMimeType: 'text/plain',  // You can adjust MIME type based on your needs
    };

    const model = 'gemini-2.5-flash-preview-04-17';  // Use the appropriate model

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: Final_Prompt,
          },
        ],
      },
    ];

    // Streaming content response
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk.text;  // Accumulate the streamed chunks
    }

    // Remove code block syntax and clean the response
    const cleanedResponse = responseText
      .replace(/```json/g, '')  // Remove opening code block
      .replace(/```/g, '');  // Remove closing code block

    // Debugging cleaned response
    console.log('Cleaned Response:', cleanedResponse);

    // Assuming cleanedResponse is in JSON format, parse it and return the questions
    const parsedResponse = JSON.parse(cleanedResponse);

    if (parsedResponse.interviewQuestions) {
      return NextResponse.json({ questions: parsedResponse.interviewQuestions });
    } else {
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



