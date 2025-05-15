import React, { useState } from "react";
import type { FormEvent } from "react";
import {toast }from "sonner";
import { Link, useNavigate } from "react-router-dom";

// Define types for state variables
const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Define the type of event in the registeruser function
  async function registeruser(event: FormEvent) {
    event.preventDefault();
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

  return (
    <div className="flex flex-col justify-center place-content-center w-full lg:w-[50%] items-center h-screen bg-white">
      <div className="w-96 shadow-md rounded-xl p-3">
        <h1 className="text-2xl font-semibold text-center">Welcome</h1>
        <p className="text-center text-gray-500 pb-2 lg:pb-4">Create Your Account</p>
        <form className="flex flex-col gap-4" onSubmit={registeruser}>
          <label htmlFor="firstname" className="font-semibold leading-0">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter Your First Name"
            name="firstname"
            className="border border-gray-300 p-2 rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="lastname" className="font-semibold leading-0">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter Your Last Name"
            name="lastname"
            className="border border-gray-300 p-2 rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="email" className="font-semibold leading-0">
            Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border border-gray-300 p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="font-semibold leading-0">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter Your Password"
            className="border border-gray-300 p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="flex items-center gap-2 leading-0">
            <input type="checkbox" name="remember" id="" />
            <span>Remember me</span>
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-gray-700 text-white p-2 rounded-xl flex items-center cursor-pointer justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center mt-1">
          <p className="text-center p-2">OR CONTINUE WITH</p>

          <p className="flex items-center gap-2 justify-center shadow-md shadow-gray-500 w-24 rounded-lg p-3">
            <i className="fa-regular fa-envelope"></i>Google
          </p>

          <Link className="text-blue-600 pt-5 cursor-pointer" to={"/login"}>
            Already have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
