"use client"

import React, { createContext, Dispatch, SetStateAction } from 'react';
type Interview = {
    jobposition: string;
    jobdescription: string;
    createdAt: string;
    duration: string;
    questionlist: any;
    useremail: string;
    interview_id: string;
    username?: string;  // Add username as an optional property
  };
  
// Define the shape of the context's value
// Define the shape of the context's value
interface InterviewContextType {
    interviewInfo: Interview | null; // Make sure to use the correct type
    setInterviewInfo: Dispatch<SetStateAction<Interview | null>>; // Use Interview | null
  }
  
  // Create the context with a default value
  export const InterviewDataContext = createContext<InterviewContextType>({
    interviewInfo: null, // Default to null
    setInterviewInfo: () => {}, // No-op function as default
  });
  