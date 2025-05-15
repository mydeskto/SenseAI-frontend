import  { useEffect } from 'react'
import SidePage from './SidePage'
import SignupForm from './SignupForm'

const Signup = () => {

   const checkToken = () => {
        const token = localStorage.getItem('token')
        if (token) {
          window.location.href = '/'
        }
        return token
      }
    
      useEffect(()=>{
        checkToken()
      },[])
  return (
    <div className='flex flex-row h-screen'>
      <SidePage/>
      <SignupForm/>
    </div>
  )
}

export default Signup
