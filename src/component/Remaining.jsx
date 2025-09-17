import React from 'react'
import { useNavigate } from 'react-router'

function Remaining() {
    const navigate=useNavigate()
  return (
    <div className='flex items-center justify-center'>
    <div className='w-full md:w-1/3 mt-6 p-6 rounded-md bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col border space-y-3'>
        <h1 className='font-bold text-2xl bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300'>Thanks For Your Interest!</h1>
        <h2 className='font-semibold text-lg bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300'>Backend is in progress. Please wait atleast for a week.</h2>
        <button className='p-2 bg-green-600 rounded-md' onClick={()=>navigate("/")}>Go To Homepage</button>
    </div>
    </div>
  )
}

export default Remaining