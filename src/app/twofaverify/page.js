"use client"
import React,{ useState } from 'react';
import { getAccessToken  } from "@/utils/common";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Lock from "@/image/lock.png"
let accessToken = getAccessToken();

const Page = () => {
  const router = useRouter(); 
  const [otp, setOtp] = useState('');

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/otp-verification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            otp: otp,
        
        }),
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
        return;
      }

      const data = await response.json();
      if(data.message ==="OTP verification successful"){
        router.push("/adminpanel");
       }
       else{
        alert("You are the beast")
       }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
   <> 
   <div className='flex justify-center mt-5'>
    <h1>Please Enter The OTP </h1>
    <Image src={Lock} width={20} height={20}/>
   </div>
     <div className='flex justify-center mt-10'>
        <input 
          className='outline-none border-solid border-2 border-black'
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
    </div>
    <div className='flex justify-center mt-10'>
    <button className="bg-[#E3F2FD] px-10 py-2" onClick={handleButtonClick}>Submit</button>
    </div>
   </>
  );
};

export default Page;
