'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { ArrowUpRightFromSquare, Calendar, Clock, Briefcase, Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface Interview {
  id: string;
  interview_id?: string;
  jobposition?: string;
  duration?: string;
  createdAt: string;
}

const ScheduleInterview = () => {
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

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-600 to-indigo-700',
      'from-indigo-600 to-purple-700',
      'from-purple-600 to-pink-700',
      'from-pink-600 to-rose-700',
      'from-rose-600 to-orange-700',
      'from-orange-600 to-amber-700'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-300 border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-500/40 text-red-400 px-6 py-4 rounded-lg shadow-lg mb-6">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
  <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
    Previously Created Interviews
  </h2>
  <Link href="/create-interview">
    <button className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-indigo-500/30">
      <Plus size={16} className="sm:size-5" />
      <span className="hidden xs:inline">New Interview</span>
    </button>
  </Link>
</div>

      
      {interviews.length === 0 ? (
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-12 text-center">
          <div className="bg-gray-800/50 p-4 rounded-full inline-flex items-center justify-center mb-4">
            <Briefcase size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No interviews found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first interview to start conducting professional technical assessments.</p>
          <Link href="/create-interview">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700">
              Create Interview
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-400">{interviews.length} interview{interviews.length !== 1 ? 's' : ''} found</div>
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                className="bg-gray-800/70 border border-gray-700 text-gray-300 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Search interviews..." 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview, index) => (
              <div key={index} className="bg-gray-900/90 rounded-xl shadow-xl border border-gray-800 overflow-hidden hover:border-gray-700 hover:shadow-indigo-900/20 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getRandomGradient()} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                      {interview.jobposition?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {interview.jobposition || 'Untitled Interview'}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Calendar size={14} className="mr-1.5" />
                        <span>{formatDate(interview.createdAt) || formatDate(new Date().toISOString())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-3 flex items-center text-gray-300 mt-4">
                    <Clock size={16} className="mr-2 text-indigo-400" />
                    <span>{interview.duration || '15'} Min Interview</span>
                  </div>
                </div>
                
                <div className="mt-2 border-t border-gray-800">
                  <Link href={`/scheduled-interviews/${interview?.interview_id}/detail`} className="w-full">
                    <button
                      className="flex items-center justify-center py-4 w-full text-indigo-400 hover:bg-gray-800/70 transition-all font-medium"
                    >
                      <ArrowUpRightFromSquare size={16} className="mr-2" />
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleInterview;