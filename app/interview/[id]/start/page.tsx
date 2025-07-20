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
  const [callStarted, setCallStarted] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAP_PUBLIC_KEY || "");

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("✅ Call started");
      setCallStarted(true);
    });
    vapi.on("speech-start", () => console.log("🎙️ Assistant speaking"));
    vapi.on("speech-end", () => console.log("🔇 Assistant finished"));
    vapi.on("message", msg => console.log("📩 Transcript:", msg.transcript));
    vapi.on("call-end", () => {
      console.log("📞 Call ended");
      setCallStarted(false);
    });
    vapi.on("error", err => {
      console.error("❌ Vapi Error:", err);
      if (err.message?.toLowerCase().includes("microphone")) {
        alert("Please allow microphone access.");
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const startCall = async () => {
    if (!interviewInfo) return;

    try {
      //@ts-ignore
      await vapi.requestMic(); // Prompt mic permission

      const questionList = interviewInfo.questionlist
        .map((q: any) => q.question)
        .join(", ");
      const firstMessage = `Hi ${interviewInfo.username}, how are you? Ready for your interview on ${interviewInfo.jobposition}?`;

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage,
        silenceTimeoutSeconds: 60,
        customerJoinTimeoutSeconds: 45, // Prevent join-timeout :contentReference[oaicite:1]{index=1}
        transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
        voice: { provider: "11labs", voiceId: "burt" },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                `You are an AI voice assistant conducting interviews.\n` +
                `Ask one question at a time from: ${questionList}\n` +
                `Provide brief encouraging feedback.\n` +
                `After 5–7 questions, summarize their performance.`,
            },
          ],
        },
      };

      console.log("Assistant Options:", assistantOptions);
      //@ts-ignore
      await vapi.start(assistantOptions);
    } catch (err) {
      console.error("❌ Start failed:", err);
    }
  };

  const finishInterview = async () => {
    vapi.say("Our time's up, goodbye!", true);
    vapi.stop();
    try {
      await axios.post(`/api/feedback/${id}`, {
        username: interviewInfo?.username,
        conversation,
      });
      router.push(`/interview/${id}/complete`);
    } catch (err) {
      console.error("❌ Feedback failed:", err);
    }
  };

  if (!interviewInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-pulse text-purple-500 text-2xl font-bold">
          Loading Interview...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h1 className="text-2xl text-white font-bold">AI Interview Session</h1>
        <div className="flex items-center text-white gap-2">
          <Timer size={20} />
          <span className="font-semibold">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI */}
        <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
          <Image src="/robot.gif" alt="AI Recruiter" width={100} height={100} />
          <p className="text-white mt-4">AI Recruiter</p>
        </div>

        {/* Interviewee */}
        <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
          <div className="bg-blue-600 rounded-full text-white text-4xl w-24 h-24 flex items-center justify-center mb-4">
            {interviewInfo?.username?.charAt(0).toUpperCase()}
          </div>
          <p className="text-white">{interviewInfo.username}</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 flex gap-6">
        <button
          onClick={startCall}
          disabled={callStarted}
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            callStarted ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <Mic size={28} className="text-white" />
        </button>

        <button
          onClick={finishInterview}
          className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
        >
          <PhoneOff size={28} className="text-white" />
        </button>
      </footer>
    </div>
  );
}
