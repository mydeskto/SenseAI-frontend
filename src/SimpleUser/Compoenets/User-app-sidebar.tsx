import { LayoutDashboard, MessageSquareText, User } from "lucide-react";
// import { File } from "lucide-react";
import { ClipboardList } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

export function UserAppSidebar() {
  const navigate = useNavigate();

  const { name, email, img} = useUserContext();

  const isadmin = localStorage.getItem("admin");
  console.log(isadmin);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("useremail");
    if (token && userName && userEmail) {
      console.log("User is signed in:", { token, userName, userEmail });
    } else {
      console.log("User is not signed in.");
    }
  }, []);

  const items = [
    {
      title: "Dashboard",
      url: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chats",
      url: "/user/chat",
      icon: MessageSquareText,
    },
    {
      title: "List Documents",
      url: "/user/list-documents",
      icon: ClipboardList,
    },
  ];

  const navigateToSettings = () => {
    navigate("/user/profile/settings");
  };

  return (
    <Sidebar className="flex flex-col justify-between h-full shadow-md">
      <SidebarContent>
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="flex justify-left items-left text-xl text-black font-bold px-4 py-6 ">
            <img src={logo} alt="" className="rounded-xl" />
            Sense AI
          </SidebarGroupLabel>
          <div className="border-b border-gray-600 mx-4 mb-4" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-600 hover:text-white rounded-4xl"
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-6 hover:bg-gray-700 rounded-4xl transition"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <div className="p-4 border-t border-gray-200">
        <div
          className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50  
                hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-0.5 
                transition-all duration-300 cursor-pointer border border-gray-600
                shadow-sm max-w-full"
          onClick={navigateToSettings}
        >
          <div className="flex-shrink-0">
            {img ? (
              <img
                src={`http://localhost:3000/${img}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 
                      hover:ring-gray-300 transition-all duration-300 shadow-md"
              />
            ) : (
              <div
                className="p-2 bg-gray-200 rounded-full shadow-inner hover:bg-gray-300 
                    transition-colors duration-300"
              >
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-gray-800 hover:text-gray-900 truncate">
              {name || "User"}
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-600 truncate max-w-[160px]">
              {email || "user@example.com"}
            </span>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
