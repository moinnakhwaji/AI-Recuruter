import { Button } from "@/components/ui/button";
import { ArrowBigDownIcon, Clock, Copy, Mail, Send } from "lucide-react";
import Link from "next/link";
import React from "react";

const Interviewlink = ({ data }: { data: any }) => {
  const interviewLink = `https://vocalhire-lime.vercel.app/interview/${data?.interview_id}`;
  console.log(interviewLink,"interview")
  console.log(`${process.env.NEXT_PUBLIC_HOST_url}`)
  const message = `Hi! 👋\n\nYou’ve been invited to attend an AI-powered interview. Please follow this link to begin:\n\n${interviewLink}\n\nThis link is valid for 30 days.`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaMail = () => {
    const subject = "AI Interview Invitation";
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <div className="bg-[#0a0a0a] text-white p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto space-y-6 border border-[#1f1e24]">
      <div className="flex items-center gap-3">
        <ArrowBigDownIcon className="text-white w-8 h-8" />
        <h2 className="text-2xl font-semibold">Your AI Interview is Ready</h2>
      </div>

      <p className="text-gray-400 text-sm">
        Share the link below with your candidate to begin the interview.
      </p>

      <div className="bg-[#121217] border border-[#2a2a35] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="w-4 h-4" />
          <span>Duration: {data?.interview?.duration} minutes</span>
        </div>
        <div className="text-white font-medium break-words text-sm">
          {interviewLink}
        </div>
        <div className="text-gray-500 text-xs">Valid for 30 days</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={copyToClipboard}
          className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </Button>

        <Button
          onClick={shareViaWhatsApp}
          className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          WhatsApp
        </Button>

        <Button
          onClick={shareViaMail}
          className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
      </div>

      <div className="pt-4">
        <Link href="/dashboard" className="w-full block">
          <Button className="bg-[#1f1e24] hover:bg-[#2a2a35] text-white w-full rounded-lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Interviewlink;
