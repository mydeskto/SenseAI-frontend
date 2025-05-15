import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import {OrgAppSidebar} from '../OrgUser/Compoents/Org-app-sidebar'
import { AnimatePresence } from "framer-motion";
import OrgLeft from '../OrgUser/Compoents/OrgLeft'
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OrgHome = () => {
    
    const {open , setIsLogin, setName ,setEmail , setLastName ,  setImg  } = useUserContext();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const navigate = useNavigate();

  const handleSignIn = () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    if (token && userName ) {
      console.log("User is signed in:", { token, userName });
      setIsLogin(true)
      
    } else {
      console.log("User is not signed in.");
      setIsLogin(false)
      navigate("/login");

    }
  }
  

 
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

        if((response.data.user.adm || response.data.user.supAdmin) || (response.data.user.userType === 'supAdmin' || response.data.user.userType === 'adm')){ 
            navigate('/')
          }else if(response.data.user.userType === 'usr' || response.data.user.usr === true){
            navigate('/user/dashboard')
          }

        console.log("User data:", response.data);
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setLastName(response.data.user.lastName);
        setImg(response.data.user.img);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };


    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("useremail");
      localStorage.removeItem("userId")
     

      setIsLogin(false);
      navigate("/login");
    };
    


  useEffect(()=>{
    handleSignIn();
    fetchUser();
  },[])


  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <OrgAppSidebar />
        <div className="flex-1 flex flex-col h-screen ">
          {/* Topbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-md">
            <SidebarTrigger className=" bg-gray-200 rounded-md hover:bg-gray-300">
              Toggle Sidebar
            </SidebarTrigger>
            <div className="flex items-center">
              <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                  </DialogHeader>
                  <p className="py-4">Are you sure you want to logout?</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLogout}>
                      Logout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
          </div>
          <AnimatePresence>{open && < OrgLeft/>}</AnimatePresence>

          {/* Routed Page Content */}
          <main className="flex-1 ">
            <div className=" bg-white text-black  w-full h-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">

              <Outlet />
              
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OrgHome;
