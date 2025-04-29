"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Clock, Calendar, Briefcase, FileText, User, X, Star, Award, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

type Question = {
  question: string;
  id?: string;
};

type Interview = {
  jobposition: string;
  jobdescription: string;
  createdAt: string;
  duration: string;
  questionlist: Question[];
  useremail: string;
  interview_id: string;
};

type ScheduledInterview = {
  id: string;
  username: string;
  candidateEmail?: string;
  scheduledDate?: string;
  createdAt?: string;
  status?: "pending" | "completed" | "cancelled";
  score?: number;
  totalQuestions?: number;
  interviewId: string;
  feedback?: {
    summary: string;
    recommendation: boolean;
    recommendationMsg: string;
    rating?: {
      technical?: number;
      communication?: number;
      problemSolving?: number;
      experience?: number;
    };
  };
};

const Page = () => {
  const { id } = useParams() as { id: string };
  const [interviewData, setInterviewData] = useState<Interview | null>(null);
  const [scheduledData, setScheduledData] = useState<ScheduledInterview[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<ScheduledInterview | null>(null);

  const openReportDialog = (candidate: ScheduledInterview) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const closeReportDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [interviewRes, scheduledRes] = await Promise.all([
          fetch(`/api/interview/${id}`),
          fetch(`/api/scheduled-interviews/${id}`)
        ]);
        
        if (!interviewRes.ok || !scheduledRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const interviewData = await interviewRes.json();
        const scheduledData = await scheduledRes.json();
        console.log(scheduledData);

        setInterviewData(interviewData);
        setScheduledData(scheduledData);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
        <div className="text-center p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-3 text-red-400">Interview Not Found</h2>
          <p className="text-gray-400">The interview you're looking for couldn't be loaded.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const getRandomInitialBackground = () => {
    const colors = [
      "bg-indigo-600", "bg-purple-600", "bg-blue-600", 
      "bg-pink-600", "bg-teal-600", "bg-cyan-600"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Interview Details
          </h1>
          <span className="px-4 py-2 bg-gray-800 rounded-full text-sm font-medium border border-gray-700 shadow-md">
            ID: {id.substring(0, 8)}...
          </span>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Interview Details */}
          <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                {interviewData.jobposition}
              </h2>
              <div className="flex flex-wrap gap-8 mt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-900/50 rounded-lg">
                    <Clock size={20} className="text-indigo-400" />
                  </div>
                  <span className="text-gray-300">{interviewData.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-900/50 rounded-lg">
                    <Calendar size={20} className="text-indigo-400" />
                  </div>
                  <span className="text-gray-300">
                    {new Date(interviewData.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-900/50 rounded-lg">
                    <Briefcase size={20} className="text-indigo-400" />
                  </div>
                  <span className="text-gray-300">Interview</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-indigo-900/30 rounded-lg">
                <FileText size={22} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Job Description</h3>
            </div>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap bg-gray-800/50 p-6 rounded-xl">
              {interviewData.jobdescription}
            </p>
          </div>

          {/* Interview Questions */}
          <div className="p-8 border-b border-gray-800">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-900/30 rounded-lg">
                <span className="flex items-center justify-center text-indigo-400">
                  <FileText size={22} />
                </span>
              </div>
              Interview Questions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewData.questionlist.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-5 bg-gray-800/70 rounded-xl hover:bg-gray-700/80 transition-colors border border-gray-700/50 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </span>
                    <p className="text-gray-200 leading-relaxed">{item.question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Candidates Section */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-900/30 rounded-lg">
                  <User size={22} className="text-indigo-400" />
                </div>
                Candidates ({scheduledData.length})
              </h3>

              <Link
                href={`/invite/${id}`}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                Invite Candidate
              </Link>
            </div>

            {scheduledData.length === 0 ? (
              <div className="bg-gray-800/70 p-8 rounded-xl text-center border border-gray-700/50">
                <User size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No candidates have been scheduled for this interview yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {scheduledData.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-gray-800/70 p-5 rounded-xl flex items-center justify-between hover:bg-gray-750 transition-colors border border-gray-700/50 shadow-md"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 ${getRandomInitialBackground()} text-white flex items-center justify-center rounded-full uppercase font-bold shadow-lg`}>
                        {candidate?.username?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">{candidate.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {candidate.status && (
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(candidate.status)}`}></span>
                          )}
                          <p className="text-gray-400 text-sm">
                            {candidate.createdAt
                              ? `Completed: ${new Date(candidate.createdAt).toLocaleDateString()}`
                              : "Not yet completed"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {candidate.score !== undefined && candidate.totalQuestions !== undefined && (
                        <div className="bg-gray-900/60 py-2 px-4 rounded-lg flex items-center gap-2">
                          <Star size={16} className="text-yellow-500" />
                          <span className="text-indigo-300 font-semibold">
                            {candidate.score}/{candidate.totalQuestions}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => openReportDialog(candidate)}
                        className="px-5 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-700/50 rounded-lg text-indigo-300 text-sm font-medium transition-colors shadow-md"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Feedback Dialog */}
      {openDialog && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            {/* Dialog Header */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-all hover:bg-gray-700"
                onClick={closeReportDialog}
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                {selectedCandidate.username}'s Report
              </h2>
              
              <p className="text-gray-400 mt-2">
                {selectedCandidate.createdAt 
                  ? `Completed on ${new Date(selectedCandidate.createdAt).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric"
                    })}` 
                  : "Not completed yet"}
              </p>
            </div>
            
            <div className="p-6 space-y-8 text-gray-300">
              {/* Score Overview */}
              {selectedCandidate.score !== undefined && selectedCandidate.totalQuestions !== undefined && (
                <div className="bg-gray-800/70 p-5 rounded-xl border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award size={20} className="text-yellow-500" />
                      <h3 className="text-xl font-semibold text-white">Overall Score</h3>
                    </div>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-indigo-400">{selectedCandidate.score}</span>
                      <span className="text-xl text-gray-400">/{selectedCandidate.totalQuestions}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Skills Assessment */}
              {selectedCandidate.feedback?.rating && (
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30">
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                    <Star size={18} className="text-yellow-500" />
                    Skills Assessment
                  </h3>
                  
                  <div className="space-y-6">
                    {selectedCandidate.feedback.rating.technical !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">Technical Skills</p>
                          <p className="font-semibold text-indigo-300">{selectedCandidate.feedback.rating.technical}/10</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                            style={{ width: `${selectedCandidate.feedback.rating.technical * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCandidate.feedback.rating.communication !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">Communication</p>
                          <p className="font-semibold text-indigo-300">{selectedCandidate.feedback.rating.communication}/10</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                            style={{ width: `${selectedCandidate.feedback.rating.communication * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCandidate.feedback?.rating?.problemSolving !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">Problem Solving</p>
                          <p className="font-semibold text-indigo-300">{selectedCandidate.feedback?.rating?.problemSolving}/10</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                            style={{ width: `${selectedCandidate.feedback?.rating?.problemSolving * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCandidate.feedback?.rating?.experience !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">Experience</p>
                          <p className="font-semibold text-indigo-300">{selectedCandidate.feedback.rating.experience}/10</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                            style={{ width: `${selectedCandidate.feedback.rating.experience * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Performance Summary */}
              {selectedCandidate.feedback?.summary && (
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-400" />
                    Performance Summary
                  </h3>
                  <div className="bg-gray-800 p-5 rounded-lg whitespace-pre-line text-gray-300 leading-relaxed border border-gray-700/50">
                    {selectedCandidate.feedback.summary}
                  </div>
                </div>
              )}
              
              {/* Recommendation */}
              {selectedCandidate.feedback?.recommendationMsg && (
                <div className={`p-6 rounded-xl border ${
                  selectedCandidate.feedback.recommendation 
                  ? 'bg-green-900/20 border-green-700/30' 
                  : 'bg-red-900/20 border-red-700/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedCandidate.feedback.recommendation ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <XCircle size={24} className="text-red-500" />
                    )}
                    <h3 className="text-xl font-semibold">
                      {selectedCandidate.feedback.recommendation ? 'Recommended' : 'Not Recommended'}
                    </h3>
                  </div>
                  <p className="text-gray-300">{selectedCandidate.feedback.recommendationMsg}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;