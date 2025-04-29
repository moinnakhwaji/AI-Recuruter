'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Calendar, Clock, Copy, Send } from 'lucide-react';

interface Interview {
  id: string;
  interview_id?: string;
  jobposition?: string;
  duration?: string;
  createdAt: string;
}

const PreviouslyCreated = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [email, setEmail] = useState<string | undefined>(undefined);

  // Set the email once user object is available
  useEffect(() => {
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      setEmail(user.emailAddresses[0]?.emailAddress);
    }
  }, [user]);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (email) {
        try {
          const response = await axios.get(`/api/fetchall?email=${email}`);
          console.log(response.data);
          setInterviews(response.data?.interviews || []);
        } catch (err) {
          setError('Failed to fetch interviews');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInterviews();
  }, [email]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCopyLink = (interview: Interview): void => {
    const linkId = interview.interview_id || interview.id;
    navigator.clipboard.writeText(`${window.location.origin}/interview/${linkId}`);
    alert("Link copied to clipboard!");
  };

  const handleSend = (interview: Interview): void => {
    const linkId = interview.interview_id || interview.id;
    // Implement send functionality
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {error}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">
        Previously Created Interviews
      </h2>
     
      {interviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No interviews found. Create your first interview to see it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.slice(0, 6).map((interview, index) => (
            <div key={index} className="bg-gray-900 rounded-lg shadow-md border border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {interview.jobposition?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-xl font-semibold text-white truncate">
                      {interview.jobposition || 'Untitled Interview'}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(interview.createdAt) || formatDate(new Date().toISOString())}</span>
                    </div>
                  </div>
                </div>
               
                <div className="flex items-center text-gray-300 mt-2">
                  <Clock size={16} className="mr-2" />
                  <span>{interview.duration || '15'} Min</span>
                </div>
              </div>
             
              <div className="flex border-t border-gray-700">
                <button
                  onClick={() => handleCopyLink(interview)}
                  className="flex items-center justify-center py-3 flex-1 text-blue-400 hover:bg-gray-800 transition-colors"
                >
                  <Copy size={16} className="mr-2" />
                  Copy Link
                </button>
                <div className="w-px bg-gray-700"></div>
                <button
                  onClick={() => handleSend(interview)}
                  className="flex items-center justify-center py-3 flex-1 text-blue-400 hover:bg-gray-800 transition-colors"
                >
                  <Send size={16} className="mr-2" />
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviouslyCreated;