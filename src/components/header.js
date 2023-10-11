import React from 'react'
import Image from 'next/image'
import Logo from "../image/arcgate-logo.png"
import Logout from '../image/logout.png'

const Header = () => {
    return (
        <>
            <div className='header bg-[#1D2E3E] p-4 flex items-center justify-between'>
                <div className='logo w-36 md:w-32 text-center md:text-left md:m-auto'>
                    <Image
                        src={Logo}
                        alt="Arcgate"
                    />
                </div>
                <div className='flex gap-x-2 md:gap-x-4 items-center md:items-start mt-2 md:mt-0'>
                    <p className='text-[#ffff] uppercase text-lg md:text-xl'>username</p>
                    <Image
                        src={Logout}
                        alt='Logout'
                        className='w-5 md:w-8'
                    />
                </div>
            </div>
        </>
    )
}

export default Header