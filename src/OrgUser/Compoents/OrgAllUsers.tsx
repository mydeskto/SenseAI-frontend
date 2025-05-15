import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BsThreeDots, BsSearch } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  lastName: string | null;
  email: string;
  img: string | null;
  userType: string;
  createdAt: string;
  updatedAt: string;
  isAllowChat: boolean; // Fix capitalization
  isAllowDoc: boolean;
  deletedAt: string | null;
}

const OrgAllUsers = () => {
  const [openUserId, setOpenUserId] = useState<number | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    userType: "usr", // Default to regular user
  });

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/org/all-user?page=${page}&limit=${usersPerPage}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / usersPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openUserId &&
        dropdownRefs.current.get(openUserId.toString()) &&
        !dropdownRefs.current.get(openUserId.toString())!.contains(event.target as Node)
      ) {
        setOpenUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openUserId]);

  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      setOpenUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:3000/api/create-user",
        { ...formData, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User created successfully:", response.data);
      // Refresh users list
      fetchUsers();
      setIsOpen(false);
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
        userType: "usr", // Reset to default user type
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  // Simple direct toggle function for permissions
  const handleTogglePermission = async (userId: number, permissionType: 'chat' | 'doc', newValue: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const stringValue = String(newValue);
      
      // Fix the property name in the update data
      const updateData = permissionType === 'chat' 
        ? { isAllowChat: stringValue }  // Fixed property name
        : { isAllowDoc: stringValue };

    //   console.log("Update data:", updateData);
      await axios.put(
        `http://localhost:3000/api/update-permissions/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the local state with correct property name
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            ...(permissionType === 'chat' 
              ? { isAllowChat: newValue }  // Fixed property name
              : { isAllowDoc: newValue })
          };
        }
        return user;
      }));

      toast.success(`Permission updated successfully!`);
      
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update permissions. Please try again.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchQuery);
  };

  const filteredUsers = users.filter(
    (user) => user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
  }, [filteredUsers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="border-1 border-gray-600 bg-white text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200 font-medium">
                Create New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center font-bold">CREATE NEW USER</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <HiUserGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Select
                    value={formData.userType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, userType: value })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usr">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateUser}
                  className="w-full border-2 border-gray-800 bg-white text-gray-800 hover:bg-gray-600 hover:text-white transition-all duration-200"
                >
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-64"
              type="email"
            />
            <Button
              onClick={handleSearch}
              className="border-1 border-gray-600 bg-white text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200 font-medium"
            >
              <BsSearch className="mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold w-16">
                    #
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold w-16">
                    UserId
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold">
                    Allow Chat
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold">
                    Allow Doc
                  </TableHead>
                  <TableHead className="py-4 px-6 text-gray-700 font-semibold w-16">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>              <TableBody>
                {currentUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="py-4 px-6 text-gray-500">
                      {index + 1 + (currentPage - 1) * usersPerPage}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-500">
                      {user.id}
                    </TableCell>
                    <TableCell className="py-4 px-6">{user.name || ''}</TableCell>
                    <TableCell className="py-4 px-6 text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isAllowChat}  // Fixed property name
                          onCheckedChange={(checked) => handleTogglePermission(user.id, 'chat', checked)}
                          className={`${
                            user.isAllowChat ? 'bg-blue-500' : 'bg-gray-200'  // Fixed property name
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isAllowDoc}
                          onCheckedChange={(checked) => handleTogglePermission(user.id, 'doc', checked)}
                          className={`${
                            user.isAllowDoc ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 relative">
                      <div className="relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenUserId(openUserId === user.id ? null : user.id);
                          }}
                          className="cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex"
                        >
                          <BsThreeDots size={20} color="black" />
                        </div>

                        {openUserId === user.id && (
                          <AnimatePresence>
                            <motion.div
                              ref={(el) => {
                                if (el) dropdownRefs.current.set(user.id.toString(), el);
                              }}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-12  top-0  mt-1 z-50"
                            >
                              <button
                                className="text-sm bg-white border border-black text-black px-3 py-1 rounded-md shadow-md hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(user.id);
                                }}
                              >
                                Delete
                              </button>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-1 border-gray-600 bg-white text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200 font-medium"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 ${
                  currentPage === page
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                } border border-gray-300 rounded-md`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-1 border-gray-600 bg-white text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200 font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrgAllUsers;