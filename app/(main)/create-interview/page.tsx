"use client";

import axios from "axios";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Code, User, Briefcase, Puzzle, Gem, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Questioncreated from "../__components/Questioncreated";
import Interviewlink from "../__components/Interviewlink";
// import Questioncreated from "@/components/Questioncreated"; // Import the new component

const Createinterview = () => {
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [interviewDuration, setInterviewDuration] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [Error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<{ question: string; type: string }[]>([]); // State for generated questions

  const { user } = useUser();
  const postData = {
    jobposition: jobPosition,
    jobdescription: jobDescription,
    duration: interviewDuration,
    // questionlist: selected,
    useremail: user?.emailAddresses[0]?.emailAddress,
  };

  const handlesubmit = async (e: any) => {
    e.preventDefault();

    if (!jobPosition || !jobDescription || !interviewDuration || !selected) {
      setError("Please fill all the values");
      return;
    }

    const postData = {
      jobposition: jobPosition,
      jobdescription: jobDescription,
      duration: interviewDuration,
      questionlist: selected,
      useremail: user?.emailAddresses[0]?.emailAddress,
    };

    try {
      setIsLoading(true);
      const response = await axios.post("/api/interview", postData);
      if (response) {
        console.log("Interview created successfully:", response?.data);
        console.log(response.data,"response")
        const interviewLink = response?.data.interviewLink; 
        console.log(interviewLink,"this is interview link")
        setGeneratedQuestions(response?.data.questions); // Assume the response contains the generated questions
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      setError("Failed to create interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const types = [
    { id: "technical", icon: <Code className="w-4 h-4 mr-2" />, label: "Technical" },
    { id: "behavioral", icon: <User className="w-4 h-4 mr-2" />, label: "Behavioral" },
    { id: "experience", icon: <Briefcase className="w-4 h-4 mr-2" />, label: "Experience" },
    { id: "problem", icon: <Puzzle className="w-4 h-4 mr-2" />, label: "Problem Solving" },
    { id: "leadership", icon: <Gem className="w-4 h-4 mr-2" />, label: "Leadership" },
  ];

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-6 py-8 flex flex-col items-center bg-black min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Interview</h2>

      {isSubmitted ? (
        <div className="bg-white text-black p-6 rounded-md mb-4 text-center">
          <h3 className="text-xl">Interview Created Successfully!</h3>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] text-gray-300 rounded-md w-full md:w-1/2 p-6 space-y-6">
          {/* Form content */}
          <div>
            <label className="block mb-1 text-sm">Job Position</label>
            <Input
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="Enter job position"
              className="w-full bg-[#1f1e24] text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
              className="w-full p-2 rounded-md bg-[#1f1e24] border border-gray-600 text-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Interview Duration</label>
            <Select value={interviewDuration} onValueChange={setInterviewDuration}>
              <SelectTrigger className="w-full bg-[#1f1e24] text-white border border-gray-600">
                <SelectValue placeholder="Select a Duration" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="10">10 MIN</SelectItem>
                <SelectItem value="20">20 MIN</SelectItem>
                <SelectItem value="25">25 MIN</SelectItem>
                <SelectItem value="30">30 MIN</SelectItem>
                <SelectItem value="45">45 MIN</SelectItem>
                <SelectItem value="60">60 MIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Interview Type</label>
            <div className="flex flex-wrap gap-3">
              {types.map((type) => {
                const isSelected = selected.includes(type.id);
                return (
                  <Button
                    key={type.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`rounded-full px-4 py-2 text-sm font-normal ${
                      isSelected
                        ? "bg-white text-black"
                        : "bg-transparent border-white text-white"
                    }`}
                    onClick={() => toggleSelection(type.id)}
                  >
                    {type.icon}
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button onClick={handlesubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <span className="loader"></span> {/* Add a loading spinner */}
                Generating questions...
              </>
            ) : (
              <>
                Generate questions <ArrowRight />
              </>
            )}
          </Button>
        </div>
      )}
{/* <Interviewlink Interviewlink={""}/> */}
      {/* Use the Questioncreated component to display the generated questions */}
      {isSubmitted && <Questioncreated generatedQuestions={generatedQuestions} postData={postData} /> }
    </div>
  );
};

export default Createinterview;
