"use client";

import { useContext, useEffect, useState } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Timer, Mic, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ConversationPage() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [seconds, setSeconds] = useState(0);
  const [conversation, setConversation] = useState([]);
  const { id } = useParams<{ id: string }>();
const router = useRouter()
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAP_PUBLIC_KEY || "");
  // console.log(conversation)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (interviewInfo && vapi) {
      startCall();
    }
  }, [interviewInfo]);

  const startCall = async () => {
    if (!interviewInfo || !vapi) return;

    const questionList = interviewInfo.questionlist
      .map((item: any) => item.question)
      .join(", ");

    const firstMessage = `Hi ${interviewInfo.username}, how are you? Ready for your interview on ${interviewInfo.jobposition}?`;

    const systemContent = `
      You are an AI voice assistant conducting interviews.
      Your job is to ask candidates provided interview questions and assess their responses.
      Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
      Ask one question at a time and wait for the candidate’s response before proceeding.
      Questions: ${questionList}
      Provide brief, encouraging feedback after each answer.
      After 5-7 questions, wrap up the interview smoothly by summarizing their performance.
    `.trim();

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemContent,
          },
        ],
      },
    };

    vapi.on("call-start", () => console.log("Call has started."));
    vapi.on("speech-start", () => console.log("Assistant speech has started."));
    vapi.on("speech-end", () => console.log("Assistant speech has ended."));
    vapi.on("call-end", () => console.log("Call has ended."));

    vapi.on("message", (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    });

    try {
   // @ts-expect-error: prop comes from dynamic route param and may be undefined

      await vapi.start(assistantOptions);
      console.log("Assistant Options:", assistantOptions);
    } catch (error) {
      console.error("Vapi Start Error:", error);
    }
  };

  const finishInterview = async () => {
    try {
      vapi.say("Our time's up, goodbye!", true);
      // console.log(conversation)
  
      // Ensure mic is off before submitting feedback and redirecting
      vapi.stop(); // Stop microphone or audio
      console.log("Microphone turned off.");
  
      const response = await axios.post(`/api/feedback/${id}`, {
        username: interviewInfo?.username,
        conversation,
      });
      console.log(response?.data);
  
      if (response) {
        const dynamicUrl = `/interview/${id}/complete`;
        router.push(dynamicUrl); // Redirect after microphone is stopped
      }
  
      console.log("Interview finished and feedback submitted successfully.");
    } catch (error) {
      console.error("Error finishing the interview:", error);
    }
  };
  

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!interviewInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
          <div className="text-2xl font-bold text-purple-500">
            Loading Interview...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-white">AI Interview Session</h1>
        <div className="flex items-center gap-2 text-white">
          <Timer size={20} />
          <span className="font-semibold">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Recruiter */}
        <div className="bg-[#1f1e24] rounded-lg flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-500 mb-4">
            <Image
              src="/robot.gif"
              alt="AI Recruiter"
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          </div>
          <p className="text-white font-medium">AI Recruiter</p>
        </div>

        {/* User */}
        <div className="bg-[#1f1e24] rounded-lg flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-600 text-white text-4xl font-bold mb-4">
            {interviewInfo.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="text-white font-medium">{interviewInfo.username}</p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col items-center gap-4 mt-10">
        <div className="flex items-center gap-6">
          <button className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
            <Mic size={28} className="text-white" />
          </button>
          <button
            onClick={finishInterview}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
          >
            <PhoneOff size={28} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
