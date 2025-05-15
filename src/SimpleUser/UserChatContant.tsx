import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoAttachSharp } from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";
import { PiScreencastDuotone } from "react-icons/pi";
// import { PiEyesDuotone } from "react-icons/pi";
import { IoIosMore } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import {toast }from "sonner";
import { motion, AnimatePresence } from "framer-motion";
// import { CgProfile } from "react-icons/cg";
import { useUserContext } from "../context/UserContext";
import logo from '../assets/logo.png'
// import { useSearchParams } from "react-router-dom";
import profile from '../assets/profile-pic.jpg'
// import { useLocation, useNavigate } from "react-router-dom";
import { Switch } from '@headlessui/react'; // Add this import at the top
import { MessageCircle } from 'lucide-react';
import type  { FC } from "react";
import type { ReactNode } from "react";




import axios from "axios"; // Added missing axios import
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Type definitions
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  userName?: string;
  timestamp: string;
  isLoading?: boolean;
}

interface UserContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  inDoc: boolean;
  setInDoc: (inDoc: boolean) => void;
  conversationId1: string | null;
}

// Add error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

interface MessageBoxWidths {
  [key: number]: number;
}

const UserChatContent: React.FC = () => {
  const { conversationId: routeConversationId } = useParams<{ conversationId: any }>();
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { open, setOpen, isOpen, setIsOpen,  setIsLogin ,name , img,  setInDoc, allowChat} = useUserContext();
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [userN, setUserN] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [messageBoxWidths, setMessageBoxWidths] = useState<MessageBoxWidths>({});
  const [jfile, setjFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    setInDoc(true)
  },[])
  

  // const {conversationId} = useParams();
  // console.log(conversationId)

  // const idFromUrl = searchParams.get("conversationId");
  // useEffect(() => {
  //   if (idFromUrl) {
  //     setConversationId(idFromUrl);
  //     console.log("Conversation ID from URL:", idFromUrl);
  //   }
  // }, [searchParams]);

  // Update the useEffect for fetchMessageHistory
  useEffect(() => {
    const controller = new AbortController();
    
    const loadHistory = async () => {
      if (routeConversationId) {
        try {
          await fetchMessageHistory(controller.signal);
          setShowWelcome(false);
        } catch (error) {
          console.error("Error loading history:", error);
          setShowWelcome(true);
        }
      } else {
        setMessages([]);
        setShowWelcome(true);
      }
    };

    loadHistory();
    
    return () => {
      controller.abort();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [routeConversationId]);

  useEffect(() => {
    const user : any = localStorage.getItem("userName") ; // Provide default value
    const userId : any = localStorage.getItem("userId") ;
    const token : any = localStorage.getItem("token") ;

    if(!user && !userId && !token){
      navigate('/login')
      setIsLogin(false)
      
    }
    setUserN(user);
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (!messages?.length || !messagesEndRef.current) return;
  
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  }, [messages]);

  // Function to handle the file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setjFile(file);
      console.log("File selected:", file);
      toast.success(`File "${file.name}" selected`);
    } else {
      console.log("No file selected");
    }
  };

  // Function to upload the context file
  const uploadContext = async () => {
    if (!jfile) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    console.log("Uploading file:", jfile);
    
    const formData = new FormData();
    formData.append("file", jfile , );
    
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      const response = await axios.post(
        "http://localhost:3000/api/chat/upload-context", 
        
          formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Upload response:", response.data);
      toast.success("Context file uploaded successfully.");
      setjFile(null); // Clear the file state after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    } catch (error) {
      const err = error as ApiError;
      console.error("Error uploading file:", err);
      toast.error(err.response?.data?.message || err.message || "Error uploading the context file.");
    }
  };

  // Add function to handle URL upload
  const handleUrlUpload = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      toast.success("Processing URL content...");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/chat/upload-context",
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("URL upload response:", response.data);
      toast.success("URL content processed successfully");
      setUrl("");
      setShowUrlInput(false);
    } catch (error: any) {
      console.error("Error processing URL:", error);
      toast.error(error.response?.data?.message || "Error processing the URL");
    }
  };

  // Update fetchMessageHistory implementation
  const fetchMessageHistory = async (signal: AbortSignal) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/chat/history", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          conversationId: routeConversationId 
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format");
      }

      // Clear existing messages before adding new ones
      setMessages([]);

      // Process and add messages
      const formattedMessages = data.data.flatMap((msg: any) => [
        {
          id: `${msg.id}-user`,
          text: msg.message,
          isUser: true,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          id: `${msg.id}-assistant`,
          text: msg.response,
          isUser: false,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      ]);

      setMessages(formattedMessages);
      setShowWelcome(formattedMessages.length === 0);

    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error("Error fetching message history:", error);
      toast.error("Failed to load message history");
      setMessages([]);
      setShowWelcome(true);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") {
      toast.error("The field cannot be empty");
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      userName: userN,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setShowWelcome(false);
    
    // If a file is selected, upload it first
    if (jfile) {
      await uploadContext();
    }
    
    await sendMessage(currentInput);
  };

  // Update sendMessage to handle cleanup better
  const sendMessage = async (Text: string) => {
      try {
        setIsGenerating(true);
        
        // Create new abort controller for this request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
    
        const loadingMessage = {
          id: Date.now(),
          text: "Generating response...",
          isUser: false,
          isLoading: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, loadingMessage]);
        const token = localStorage.getItem("token");
    
        let currentConversationId = conversationId || routeConversationId || null;
    
        const response = await fetch("http://localhost:3000/api/chat/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: Text, 
            conId: currentConversationId,
            isActive: isActive // Add isActive to request body
          }),
          signal: abortControllerRef.current.signal,
        });
    
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
    
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === 'Conversation limit reached') {
            toast.error(errorData.message);
            // Navigate to a new chat
            navigate('/org/chat');
            return;
          }
          throw new Error(errorData.error || "Failed to send message");
        }
  
        if (!response.body) throw new Error("No readable stream available");
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let botMessageId = Date.now();
    
        const newBotMessage = {
          id: botMessageId,
          text: "",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
    
        setMessages((prev) => [...prev, newBotMessage]);
    
        let hasUpdatedConversationId = false;
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");
    
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6);
              if (jsonStr === "[DONE]") continue;
    
              try {
                const parsed = JSON.parse(jsonStr);
    
                // Set new conversationId if returned
                if (!hasUpdatedConversationId && parsed.conversationId) {
                  const newConversationId = parsed.conversationId;
                  console.log("New conversation ID:", newConversationId);
                  window.history.pushState({}, '', `/org/chat/${newConversationId}`);
                  // setConversationId1(newConversationId);
                  setConversationId(newConversationId);
                  // Update URL without reloading the page
                  hasUpdatedConversationId = true;
                }
    
                if (parsed.token !== undefined) {
                  accumulatedText += parsed.token;
    
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId
                        ? { ...msg, text: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error("Error parsing stream JSON:", e);
              }
            }
          }
        }
      } catch (error) {
        const err = error as Error;
        if (err.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        console.error("Send message error:", err);
        toast.error("Failed to send message.");
      } finally {
        setIsGenerating(false);
      }
    };
  
  
  
  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };


  type CodeProps = {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: ReactNode; // <-- make it optional
  };
  
  const CustomCodeBlock: FC<CodeProps> = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  // Replace the existing useEffect for allowChat with this
  useEffect(() => {
    if (!allowChat) {
      setShowPermissionDialog(true);
    }
  }, [allowChat]);

  // Add this near other JSX before the main return
  const PermissionDialog = () => (
    <Dialog open={showPermissionDialog} onOpenChange={(open) => {
      setShowPermissionDialog(open);
      if (!open) { // This triggers when dialog is closed by any means
        navigate('/user/dashboard');
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat Access Restricted</DialogTitle>
          <DialogDescription>
            You don't have permission to access the chat feature. Please contact your administrator for access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => {
            setShowPermissionDialog(false);
            navigate('/user/dashboard');
          }}>
            Return to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <PermissionDialog />
      <div className="flex flex-col h-[90%] lg:pb-0 mb-4 sm:mb-10 bg-white text-white">
        <div className="flex justify-end items-center gap-2 text-black pt-2 sm:pt-3 pr-3 sm:pr-5">
          <MessageCircle onClick={()=>{setOpen(!open)}}/>
        </div>
        {showWelcome && messages.length === 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center w-full h-[70%] flex-grow px-4">
            <motion.img
              src="src/assets/logo.png"
              className="w-14 sm:w-18 rounded-3xl"
              alt=""
              initial={{ y: -200, rotate: 0 }}
              animate={{
                y: [0, 20, 0], // Move from top to bottom and back
                rotate: [0, 15, 0], // Rotate clockwise and then back
              }}
              transition={{
                duration: 2, // Duration of the animation (for the jump and rotation)
                ease: "easeInOut", // Smoother easing
              }}
            />
            <motion.p className="text-2xl sm:text-3xl text-gray-400">
              Hi, {userN}
            </motion.p>
            <motion.p className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 text-center">
              Can I help you with anything?
            </motion.p>
            <motion.p className="text-sm sm:text-base text-center pt-2 sm:pt-3 text-gray-400">
              Ready to assist you with anything you need?
              <br className="hidden sm:block" />
              from answers to questions, generation to providing
              <br className="hidden sm:block" />
              recommendations. Let's get started!
            </motion.p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 lg:gap-0 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-200px)] scrollbar-thumb-transparent overflow-y-auto items-center w-full flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="flex-grow w-[95%] sm:w-[90%] md:w-4/5 lg:w-3/4 xl:w-2/3 text-[14px] sm:text-[16px] text-gray-500">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`flex flex-col ${message.isUser ? "justify-end" : "justify-start"} mb-3 sm:mb-4`}
                  >
                    <div className="flex flex-row gap-1 sm:gap-2">
                      <div>
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          {message.isUser ? (
                            <span className="flex flex-row pt-3 sm:pt-4 gap-1 sm:gap-2 items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                  src={`http://localhost:3000/${img}`}
                                  alt="Profile picture"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </span>
                          ) : (
                            <span className="flex pt-2 sm:pt-3 flex-row gap-1 sm:gap-2 items-center">
                              <img
                                src={logo}
                                alt="AI"
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl"
                              />
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-w-[85vw] sm:max-w-none">
                        <div className="flex items-center gap-2 mb-2">
                          {message.isUser ? (
                            <>
                              <span
                                className="flex flex-row items-center justify-between"
                                style={{
                                  width: messageBoxWidths[message.id]
                                    ? `${messageBoxWidths[message.id]}px`
                                    : "auto",
                                }}
                              >
                                <span className="text-sm">{name}</span>

                                <p className="text-xs text-gray-300 mt-1 text-right">
                                  {message.timestamp}
                                </p>
                              </span>
                            </>
                          ) : (
                            <>
                              <span
                                className="flex flex-row gap-2 items-center justify-between"
                                style={{
                                  width: messageBoxWidths[message.id]
                                    ? `${messageBoxWidths[message.id]}px`
                                    : "auto",
                                }}
                              >
                                <span className="text-sm">
                                  {message.isLoading ? "Generating..." : "Sense AI"}
                                </span>

                                <span>
                                  <p className="text-xs text-gray-300 mt-1 text-right">
                                    {message.timestamp}
                                  </p>
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          ref={(el) => {messageRefs.current[message.id] = el}}
                          className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-3 rounded-lg border ${
                            message.isUser
                              ? "bg-white text-black border-gray-400"
                              : message.isLoading
                              ? "bg-gray-100 text-black border-gray-400 animate-pulse"
                              : "bg-white text-black border-gray-400"
                          }`}
                        >
                          <div className="prose max-w-none">
                            {message.isLoading ? (
                              <div className="flex items-center gap-2 text-black">
                                <span>Generating</span>
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-100">.</span>
                                <span className="animate-bounce delay-200">.</span>
                              </div>
                            ) : (
                              <ReactMarkdown components={{ code: CustomCodeBlock }}>
                                {message.text}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
        )}

        <div className=" right-0 bg-white px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center w-full">
            <motion.div
              className="flex flex-col justify-center text-black items-center w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] rounded-2xl sm:rounded-3xl border border-gray-300 bg-white"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <div className="flex w-full px-2 sm:px-3 py-2 justify-center text-black items-center rounded-2xl sm:rounded-3xl">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="outline-none border-none w-full bg-transparent text-black text-sm sm:text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                  className="bg-gray-500 p-1.5 sm:p-2 rounded-full"
                  disabled={isGenerating}
                >
                  <IoMdSend size={16} className="sm:text-[20px]" />
                </motion.button>
              </div>
              <span className="flex flex-row p-2 sm:p-3 justify-between items-center w-full text-xs sm:text-base">
                <span className="flex flex-row gap-2 sm:gap-3 text-left items-center">
                  <input 
                    type="file" 
                    id="fileInput" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {jfile && (
                    <span className="text-xs text-green-400">
                      {jfile.name}
                    </span>
                  )}
                  <motion.label
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    htmlFor="fileInput"
                    className="cursor-pointer"
                  >
                    <IoAttachSharp size={16} />
                  </motion.label>
                  
                  {/* URL Input Section */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUrlInput(!showUrlInput)}
                  >
                    <CiGlobe size={16} className="cursor-pointer" />
                  </motion.div>
                  {showUrlInput && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#1f2733] p-4 rounded-lg shadow-lg"
                    >
                      <div className="flex flex-col gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Enter URL here..."
                          className="bg-[#262E3A] text-white p-2 rounded-md outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowUrlInput(false)}
                            className="px-3 py-1 rounded-md bg-gray-600 text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUrlUpload}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white"
                          >
                            Process URL
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <PiScreencastDuotone size={16} className="cursor-pointer" />
                  </motion.div>
                </span>
                <span className="flex flex-row gap-2 sm:gap-3 justify-center items-center">
                  OpenAi
                  <Switch
                    checked={isActive}
                    onChange={setIsActive}
                    className={`${
                      isActive ? 'bg-blue-600' : 'bg-gray-500'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span className="sr-only">Enable AI assistance</span>
                    <span
                      className={`${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IoIosMore size={16} className="cursor-pointer" />
                  </motion.div>
                </span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserChatContent;