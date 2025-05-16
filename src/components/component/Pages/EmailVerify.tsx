import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import logo from "../../../assets/logo.png";

const EmailVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");
    console.log(userId, token);
    if (!userId || !token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    fetch(`http://localhost:3000/api/verify-email?userId=${userId}&token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.message && data.message.includes("successfully")) {
          setStatus("success");
          setMessage("Your email has been verified!");
          toast.success("Email verified! You can now log in.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Verification failed. Please try again later.");
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <img src={logo} alt="Logo" className="w-28 h-28 rounded-3xl" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20"
      >
        {/* Background gradient circles */}
        <div className="absolute -z-10 inset-0 blur-3xl opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-cyan-500 rounded-full" />
        </div>

        <div className="relative z-10">
          {status === "pending" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
              <h2 className="text-xl font-semibold text-white">Verifying your email...</h2>
              <p className="text-gray-300 text-center">Please wait while we verify your email address</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                  className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl"
                />
                <CheckCircle2 className="w-16 h-16 text-green-400 relative z-10" />
              </div>
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              <p className="text-gray-300 text-center">Redirecting you to login...</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-1 bg-green-400 rounded-full"
              />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                  className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl"
                />
                <XCircle className="w-16 h-16 text-red-400 relative z-10" />
              </div>
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 group"
                onClick={() => navigate("/login")}
              >
                Go to Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
