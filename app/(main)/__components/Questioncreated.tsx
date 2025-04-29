"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Interviewlink from "./Interviewlink";
import { Loader2 } from "lucide-react";

interface Question {
  question: string;
  type: string;
}

interface QuestionCreatedProps {
  generatedQuestions: Question[];
  postData: any;
}

const Questioncreated: React.FC<QuestionCreatedProps> = ({ generatedQuestions, postData }) => {
  const [data, setData] = useState(null);
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleonSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const postDatas = {
      jobposition: postData?.jobposition,
      jobdescription: postData?.jobdescription,
      duration: postData?.duration,
      useremail: postData?.useremail,
      questionlist: generatedQuestions,
    };

    try {
      const response = await axios.post("/api/create", postDatas);

      if (response?.data) {
        setData(response.data);
        setShowLink(true);
        console.log("Interview created:", response.data);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showLink && data) {
    return <Interviewlink data={data} />;
  }

  return (
    <div className="bg-[#0a0a0a] text-gray-300 rounded-xl w-full md:w-2/3 p-6 md:p-8 space-y-8 border border-[#1f1e24] shadow-lg">
      <h3 className="text-2xl font-bold text-white text-center">Generated Questions</h3>

      {generatedQuestions.length > 0 ? (
        <div className="space-y-5 py-4 my-4">
          {generatedQuestions.map((question, index) => (
            <div
              key={index}
              className="border border-[#2a2a35] rounded-lg bg-[#121217] px-5 py-4 transition hover:border-[#6556cd]"
            >
              <p className="text-base md:text-lg font-medium text-white leading-relaxed">
                {index + 1}. {question.question}
              </p>
              <p className="text-sm text-[#888] mt-1 italic">Type: {question.type}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-center">No questions generated.</p>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleonSubmit}
          disabled={loading}
          className="bg-white hover:bg-white text-black px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Creating..." : "Create interview link & Finish"}
        </Button>
      </div>
    </div>
  );
};

export default Questioncreated;
