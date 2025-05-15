import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const reset = async () => {
    if (!password) {
      toast.error("Please Enter New Password");
      return;
    }

    try {
        const email = localStorage.getItem("email");
        const pin = localStorage.getItem("pin");
      setIsLoading(true);
      await axios.post("http://localhost:3000/api/reset-password", {
        email,
        pin,
        newPassword: password,
      });
      toast.success("Password changed successfully!");
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleback = ()=>{
    localStorage.removeItem('email')
    localStorage.removeItem('pin')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />

        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold bg-gray-600 bg-clip-text text-transparent mb-3">
            Reset Password
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your email, PIN, and new password
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/5">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={reset}
                disabled={isLoading}
                className="w-full h-12 bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
               <p onClick={handleback} className="text-gray-400 hover:text-gray-600 font-medium transition-colors">
                 <Link
                  to="/login"
                  className="text-gray-600 hover:text-white font-medium transition-colors" 
                >
                  Back to Login
                </Link>
               </p>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
