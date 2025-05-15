import { useEffect } from 'react'
import SidePage from './SidePage'
import LoginForm from './LoginForm'
import { useUserContext } from '@/context/UserContext';

const Login = () => {
  
const { setIsLogin } = useUserContext(); 
  const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        window.location.href = '/'
        setIsLogin(true)
      }
      return token
    }
  
    useEffect(()=>{
      checkToken()
    },[])
  return (
    <div className='flex flex-row h-screen'>
      <SidePage/>
      <LoginForm/>
    </div>
  )
}

export default Login
