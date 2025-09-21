import { jwtDecode } from 'jwt-decode'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import authService from '../../authentication/auth'

function ChangePassword({quizId}) {
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    const handleSubmit=async()=>{
        const token=localStorage.getItem("token")
        if(!token)
        {
            navigate("/")
            return 0;
        }
        try {
            const {exp}=jwtDecode(token)
            if(exp*1000<Date.now())
            {
                authService.logout()
                navigate("/")
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='mt-6 w-full flex flex-col md:w-1/3 p-2 rounded-md border bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300'>
        <div className='flex flex-col items-start'>
            <label htmlFor="pass">Password</label>
            <input type='text' placeholder='Enter Password' value={password} onChange={(e)=>e.target.value} required/>
        </div>
        <div className='flex space-x-2'>
            <button onClick={()=>navigate("/resultHistory")}>Back</button>
            <button onSubmit={handleSubmit}>Change Password</button>
        </div>
    </div>
  )
}

export default ChangePassword