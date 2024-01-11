
import UserDetails from '@/components/UserDetails'
import React from 'react'

const page = (params) => {
  
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
