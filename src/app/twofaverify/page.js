import TwoFaverify from '@/components/TwoFaverify'
import React from 'react'

const page = () => {
  return (
    <>
      <TwoFaverify/>
    </>
  )
}

export default page

export function generateMetadata({params}) {
  return{
    title:"GA"
  }
}