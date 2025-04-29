import React from 'react';

type DashBoardCardProps = {
  icons: React.ReactNode;
  heading: string;
  text: string;
};

const DashBoardCard = ({ icons, heading, text }: DashBoardCardProps) => {
  return (
    <div className='bg-gradient-to-r from-[#1f1e24] via-[#2d2a35] to-[#1a1a1a] text-white p-6 rounded-lg shadow-lg w-full max-w-sm md:mx-4 transform transition-transform hover:scale-105'>
      <div className='flex items-center mb-4'>
        <div className='text-[#6556cd] text-3xl mr-4 transition-transform transform hover:scale-110'>{icons}</div>
        <h2 className='text-xl font-semibold text-[#ececec] tracking-wide'>{heading}</h2>
      </div>
      <p className='text-[#b3b3b3] text-sm leading-relaxed'>{text}</p>
    </div>
  );
};

export default DashBoardCard;
