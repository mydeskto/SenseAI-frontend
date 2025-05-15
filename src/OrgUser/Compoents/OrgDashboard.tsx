import  { useEffect, useState } from "react";
import { HiOutlineDocument } from "react-icons/hi";
import { BiConversation } from "react-icons/bi";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import Loader from "@/components/ui/loader";
import { Users } from 'lucide-react';

const OrgDashboard: React.FC = () => {
    const { setName ,setEmail , setLastName ,  setImg  } = useUserContext();

  const [documentCount, setDocumentCount] = useState<number>(0);
  const [conversationCount, setConversationCount] = useState<number>(0);
  const [UserCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // const [userData, setUserData] = useState(null);
  // const [simpleUserCount, setSimpleUserCount] = useState<number>(0);
  // const [adminUserCount, setAdminUserCount] = useState<number>(0);
  // const [managementUserCount, setManagementUserCount] = useState<number>(0);

  // Fetch documents and count them
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch("http://localhost:3000/api/chat/list-documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.success) {
        setDocumentCount(result.documents.length || 0);
        console.log("Documents fetched:", result.documents);
      } else {
        throw new Error(result.message || "API call succeeded but returned success: false");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };



    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            "http://localhost:3000/api/user",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        // setUserData(response.data);
        console.log("User data:", response.data);
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setLastName(response.data.user.lastName);
        setImg(response.data.user.img);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // const fetchSimpleUser = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.get(
    //         "http://localhost:3000/api/user/usr",
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         }
    //     );
    //     setUserData(response.data);
    //     console.log("User data:", response.data);
    //     setName(response.data.user.name);
    //     setEmail(response.data.user.email);
    //     setLastName(response.data.user.lastName);
    //     setImg(response.data.user.img);

    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };
    // const fetchUser = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.get(
    //         "http://localhost:3000/api/user",
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         }
    //     );
    //     setUserData(response.data);
    //     console.log("User data:", response.data);
    //     setName(response.data.user.name);
    //     setEmail(response.data.user.email);
    //     setLastName(response.data.user.lastName);
    //     setImg(response.data.user.img);

    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };
    // const fetchUser = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.get(
    //         "http://localhost:3000/api/user",
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         }
    //     );
    //     setUserData(response.data);
    //     console.log("User data:", response.data);
    //     setName(response.data.user.name);
    //     setEmail(response.data.user.email);
    //     setLastName(response.data.user.lastName);
    //     setImg(response.data.user.img);

    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    type User = {
      userType: 'usr' | 'adm' | 'mgm';

      // Add more fields if needed
    };


  // Fetch conversations and count them
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

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
      setConversationCount(data.data?.length || 0);
      console.log("Conversations:", data.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get("http://localhost:3000/api/org/all-user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const users = response.data.users;
      setUserCount(users.length || 0);
      
      // Count different user types

        // setSimpleUserCount(users.filter((user: User) => user.userType === 'usr').length || 0);
        // setAdminUserCount(users.filter((user: User) => user.userType === 'adm').length || 0);
        // setManagementUserCount(users.filter((user: User) => user.userType === 'mgm').length || 0);
      
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchConversations();
    fetchUsers();
    fetchUser();
    
  }, []);

  if (loading) return <Loader />;

  return (
    <>
    <div className="flex flex-col gap-6 w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

        
      </div>

      <div className="p-6 flex flex-col gap-6 w-full overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-1 border-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
          <div className="p-6 flex items-start justify-between border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-900">{UserCount}</h2>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">All users</span>
              <span className="text-purple-500 font-medium">{UserCount} users</span>
            </div>
          </div>
        </div>
          <div className="bg-white border-1 border-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden"
            onClick={() => window.location.href = "/list-documents"}
            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = "/list-documents")}
          >
            <div className="p-6 flex items-start justify-between border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Documents</p>
                <h2 className="text-3xl font-bold text-gray-900">{documentCount}</h2>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <HiOutlineDocument className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Uploaded files</span>
                <span className="text-blue-500 font-medium">{documentCount} files</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-1 border-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
            <div className="p-6 flex items-start justify-between border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Conversations</p>
                <h2 className="text-3xl font-bold text-gray-900">{conversationCount}</h2>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BiConversation className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Active chats</span>
                <span className="text-green-500 font-medium">{conversationCount} chats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrgDashboard;
