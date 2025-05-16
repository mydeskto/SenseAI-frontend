import React, { useState } from "react";
import type { FormEvent } from "react";
import {toast }from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

// Define types for state variables
const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  // Password validation states
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);

  // Check password strength
  const checkPasswordStrength = (value: string) => {
    setHasUpperCase(/[A-Z]/.test(value));
    setHasLowerCase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(value));
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };
  // Check if password is strong
  const isPasswordStrong = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  // Define the type of event in the registeruser function
  async function registeruser(event: FormEvent) {
    event.preventDefault();
    
    if (!isPasswordStrong) {
      toast.error("Please create a stronger password that meets all requirements.");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "ok") {
        toast.success("Verification email sent. Please check your inbox.");
        // Store user info in localStorage (except password)
        localStorage.setItem("signupUser", JSON.stringify({
          firstName,
          lastName,
          email
        }));
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (data.status === "error") {
        setIsLoading(false);
        toast.error(`Account Creation Failed ... ${data.error}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while registering. Please try again.");
      console.error("Error during registration:", error);
    }
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   if (!acceptedTerms) {
  //     toast.error("Please accept the terms and conditions");
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
  //     toast.error("Please meet all password requirements");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:3000/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstName,
  //         lastName,
  //         email,
  //         password,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     if (data.status === "ok") {
  //       toast.success("Verification email sent. Please check your inbox.");
  //       // Store user info in localStorage (except password)
  //       localStorage.setItem("signupUser", JSON.stringify({
  //         firstName,
  //         lastName,
  //         email
  //       }));
  //       setTimeout(() => {
  //         navigate("/login");
  //       }, 1500);
  //     } else if (data.status === "error") {
  //       setIsLoading(false);
  //       toast.error(`Account Creation Failed ... ${data.error}`);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     toast.error("An error occurred while registering. Please try again.");
  //     console.error("Error during registration:", error);
  //   }
  // }

  return (
    <div className="flex flex-col justify-start w-full lg:w-[50%] items-center min-h-screen bg-white py-4 px-2 overflow-y-auto">
      <div className="w-full max-w-md shadow-md rounded-xl p-4 sm:p-6 my-4">        <h1 className="text-xl sm:text-2xl font-semibold text-center">Welcome</h1>
        <p className="text-center text-gray-500 pb-2 lg:pb-4 text-sm sm:text-base">Create Your Account</p>
        <form className="flex flex-col gap-3 sm:gap-4" onSubmit={registeruser}>
          <label htmlFor="firstname" className="font-semibold leading-0">
            First Name
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter Your First Name"
              name="firstname"
              className="border border-gray-300 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="lastname" className="font-semibold leading-0">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter Your Last Name"
              name="lastname"
              className="border border-gray-300 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="email" className="font-semibold leading-0">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="example@gmail.com"
              className="border border-gray-300 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label htmlFor="password" className="font-semibold leading-0">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Enter Your Password"
              className="border border-gray-300 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
            <p className={`${hasUpperCase ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-xs sm:text-sm`}>
              {hasUpperCase ? "✓" : "✗"} At least one uppercase letter
            </p>
            <p className={`${hasLowerCase ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-xs sm:text-sm`}>
              {hasLowerCase ? "✓" : "✗"} At least one lowercase letter
            </p>
            <p className={`${hasNumber ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-xs sm:text-sm`}>
              {hasNumber ? "✓" : "✗"} At least one number
            </p>
            <p className={`${hasSpecialChar ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-xs sm:text-sm`}>
              {hasSpecialChar ? "✓" : "✗"} At least one special character
            </p>            {isPasswordStrong ? (
              <div className="mt-2 bg-green-50 p-2 rounded-lg border border-green-200">
                <p className="text-green-600 font-medium flex items-center gap-2 text-sm">
                  <span className="text-lg">✨</span> 
                  Great! Your password meets all security requirements
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Complete all requirements for a strong password
              </p>
            )}
          </div>
          {/* Terms and conditions */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I accept the terms and conditions
            </label>
          </div>

          <button            className="w-full py-2.5 px-4 text-sm font-semibold text-center text-white bg-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            disabled={!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !acceptedTerms || isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                Creating Account <ClipLoader size={20} color="white" />
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="text-center text-sm sm:text-base text-gray-600">OR CONTINUE WITH</p>

          <button 
            type="button"
            className="flex items-center gap-2 justify-center shadow-md hover:shadow-lg transition-shadow duration-200 w-auto px-6 rounded-lg p-2 sm:p-3 bg-white text-sm sm:text-base"
          >
            <i className="fa-regular fa-envelope"></i>Google
          </button>

          <Link 
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base cursor-pointer" 
            to={"/login"}
          >
            Already have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
