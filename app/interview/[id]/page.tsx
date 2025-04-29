"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { VideoIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

type Question = {
  question: string
  id?: string
}

type Interview = {
  jobposition: string
  jobdescription: string
  createdAt: string
  duration: string
  questionlist: Question[]
  useremail: string
  interview_id: string
}

const InterviewStart = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [InterviewData, setInterviewData] = useState<Interview | null>(null)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)

  // Fetch interview data when the component mounts
  useEffect(() => {
    const fetchInterviewData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/interview/${id}`)
        const data = await response.json()
        setInterviewData(data)
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviewData()
  }, [id])

  const onSubmit = async () => {
    if (!username.trim()) return alert("Please enter your name")
    
    if (InterviewData) {
      setInterviewInfo({
        ...InterviewData,
        username,
      })

      router.push(`/interview/${id}/start`)
    } else {
      alert("Interview data is not available.")
    }
  }

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="text-center">Loading interview data...</div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">VocalHire</h2>
          <p className="text-gray-400">AI Powered Interview Platform</p>
        </div>
        <div className="space-y-4">
          <Image
            alt="robot image"
            src="/robot.gif"
            width={120}
            height={120}
            className="mx-auto rounded-full"
          />
          <h1 className="text-2xl font-semibold">
            {InterviewData?.jobposition || "Loading..."}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
            <span>{InterviewData?.duration} mins</span>
          </div>
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm text-gray-300">Enter your name</label>
          <Input
            placeholder="John Doe"
            className="bg-gray-800 border-gray-700 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="text-left text-gray-400 space-y-1 text-sm">
          <p>Before you begin:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure you have a stable internet connection</li>
            <li>Test your camera and microphone</li>
            <li>Find a quiet place for the interview</li>
          </ul>
        </div>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
          onClick={onSubmit}
          disabled={loading} // Disable button while loading
        >
          <VideoIcon className="w-5 h-5" /> Join Interview
        </Button>
      </div>
    </div>
  )
}

export default InterviewStart
