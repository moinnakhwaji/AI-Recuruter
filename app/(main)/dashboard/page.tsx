"use client "
import React from 'react';
import DashBoardCard from '../__components/DashBoardCard';
import { Video } from 'lucide-react';
import PreviouslyCreated from '../__components/PreviouslyCreated';
import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';



const DashboardPage = async () => {
   const user = await currentUser();

   
  //  console.log(user?.emailAddresses[0].emailAddress,"user hai ");
 
   // Important: call checkUser here!
   await checkUser();
  return (
    <div className="px-6 py-6">
      <h2 className="px-6 py-4 text-3xl font-bold font-sans">Dashboard</h2>
      <div className="flex justify-between items-center w-full mx-3">
        <DashBoardCard
          icons={<Video />}
          heading="Create A New Interview"
          text="create ai image schedule then with candidate"
        />
        <DashBoardCard
          icons={<Video />}
          heading="Create Phone Screening Call"
          text="Schedule phone screening call with candidates"
        />
      </div>
      <PreviouslyCreated  />
    </div>
  );
};

export default DashboardPage;

