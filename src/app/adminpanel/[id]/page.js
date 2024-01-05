
import UserDetails from '@/components/UserDetails'
import React from 'react'

const page = (params) => {
  console.log(params,"ss");
  
  return (
    <>
      <UserDetails id={params}/>
    </>
  )
}

export default page
export function generateMetadata({params}) {
  return{
    title:"User Detils"
  }
}