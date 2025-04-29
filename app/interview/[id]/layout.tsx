"use client";
import React, { useState } from 'react';
import { InterviewDataContext } from "@/context/InterviewDataContext";

const InterviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [interviewInfo, setInterviewInfo] = useState<any>(undefined); // Use 'any' or a specific type

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className='bg-black text-white '>
        <main className='w-full'>
          {children}
        </main>
      </div>
    </InterviewDataContext.Provider>
  );
}

export default InterviewProvider;
