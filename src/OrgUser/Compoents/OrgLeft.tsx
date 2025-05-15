import React, { useEffect, useState } from "react";
import { ChevronLeft, Search, MessageSquarePlus, User, MessageSquare, ChevronRight } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Conversation {
  _id?: string;
  id?: string;
  conversationId: string;
  createdAt?: string;
  message?: string;
}

interface UserContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  setConversationId1: (id: string | null) => void;
}

const Left: React.FC = () => {
  const { open, setOpen, setConversationId1 } = useUserContext() as UserContextType;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("useremail");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/chat/con-history", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        setConversations(data.data || []);
        console.log("Conversations:", data.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId: any) => {
    setConversationId1(conversationId);
    navigate(`/org/chat/${conversationId}`);
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[70%] lg:w-[19%] fixed right-0 h-screen bg-white text-black shadow-lg flex flex-col"
    >      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            {showSearch ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowSearch(false);
                    }
                  }}
                  onBlur={() => {
                    if (!searchQuery) {
                      setShowSearch(false);
                    }
                  }}
                  autoFocus
                  className="w-36 py-1 px-3 pr-8 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearch(false);
                    }}
                    className="absolute right-2 p-1 hover:bg-gray-100 rounded-md"
                  >
                    <span className="text-gray-400 text-xs">×</span>
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <button 
          onClick={() => {navigate('/org/chat'); setOpen(false)}}
          className="flex items-center space-x-2 w-full p-3 hover:bg-gray-700 hover:text-white rounded-xl transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1.5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>        ) : conversations.length > 0 ? (
          conversations
            .filter((conversation) => 
              conversation.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              `Chat ${conversation.id}`.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((conversation) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              key={conversation._id || conversation.id}
              className="group relative flex items-center space-x-3 p-3.5 hover:bg-gray-700/90 bg-gray-50/50 hover:text-white rounded-2xl cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-600"
              onClick={() => {
                handleConversationClick(conversation.conversationId);
                setOpen(false);
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 group-hover:bg-gray-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium truncate">
                    {conversation.message || `Chat ${conversation.id}`}
                  </p>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300">
                    {conversation.createdAt?.slice(0, 8) }
                  </span>
                </div>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-1 truncate">
                  Click to continue conversation
                </p>
              </div>
              <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
            </motion.div>
          ))
        ) : (          <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            {searchQuery ? (
              <>
                <p className="text-sm font-medium">No matching conversations</p>
                <p className="text-xs">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs">Start a new chat to begin</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="p-2 bg-gray-200 rounded-full">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user}</span>
            <span className="text-xs text-gray-500">{userEmail}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Left;
