import { useState } from "react";
import type { FormEvent } from "react";
import {toast }from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { useUserContext } from "../../../context/UserContext";// Import the custom hook

const LoginForm = () => {
  const navigate = useNavigate();
  const { setInDoc, setAdmin } = useUserContext(); // Use the custom hook to access context values
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handle login logic
  async function loginUser(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('user', data);
      console.log(data.message);

      if (data.status === 'ok') {
        setLoading(false);
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('useremail', data.user.email);
        localStorage.setItem('userType', data.userType);
        // console.log('Login successful:', data.token);
        
        // Set inDoc state to true
        setInDoc(true);
        
        // Handle navigation based on user type
        if (data.user.usr && data.user.userType === 'usr') {
          navigate('/user/dashboard');
        } else if ((data.user.adm || data.user.supAdmin) || (data.user.userType === 'supAdmin' || data.user.userType === 'adm')) {
          setAdmin(true);
          navigate('/');
        } else if (data.user.mgm && data.user.userType === 'mgm') {
          navigate('/org/dashboard');
        }

        console.log('User:', data.user.name);
        toast.success('Login successful!');
      } else {
        setLoading(false);
        toast.error('Please check your Email and Password!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      toast.error('An error occurred. Please try again later.');
    }
  }

  return (
    <div className="flex flex-col justify-center place-content-center w-full lg:w-[50%] items-center h-screen bg-white">
      <div className="w-96 shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center">Welcome</h1>
        <p className="text-center text-gray-500 pb-8">Create Your Account</p>
        <form className="flex flex-col gap-4" onSubmit={loginUser}>          <div className="space-y-2">
            <label htmlFor="email" className="font-semibold leading-0">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="font-semibold leading-0">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full border border-gray-300 p-2 rounded-lg pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <span className="flex items-center gap-2">
            <input type="checkbox" name="remember" id="" />
            <span>Remember me</span>
          </span>
          <span className="flex items-center gap-2">
            <Link to='/forgot-password' className="text-blue-600 hover:underline cursor-pointer">Forgot Password?</Link>
          </span>
          </div>
          <button
            type="submit"
            className="bg-gray-700 text-white p-2 rounded-xl cursor-pointer"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                Logging <ClipLoader size={20} color="white" />
              </div>
            ) : (
              <>Login</>
            )}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center mt-1">
          <p className="text-center p-4">OR CONTINUE WITH</p>

          <p className="flex items-center gap-2 justify-center shadow-md shadow-gray-500 w-24 rounded-lg p-3">
            <i className="fa-regular fa-envelope"></i>Google
          </p>

          <Link className="text-blue-600 pt-5" to={"/Sign-up"}>
            Don't have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
