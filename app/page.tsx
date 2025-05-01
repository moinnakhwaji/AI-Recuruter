import React from 'react'
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import Navbar from '@/components/ui/Navbar'
// import { currentUser } from '@clerk/nextjs/server'
import { checkUser } from '@/lib/checkUser'




const page = async () => {
  // const user = await currentUser();
  // console.log(user);

  // Important: call checkUser here!
  await checkUser();
  return (
    <div className=''>

     <Navbar/>
   
      <HeroGeometric 
        badge="Welcome to VocalHire"
        title1="Revolutionizing Your"
        title2="Hiring Experience"
      />

   
      


    </div>
  )
}

export default page
