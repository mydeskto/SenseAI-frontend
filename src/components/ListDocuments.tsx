import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MoreHorizontal, Upload, Trash2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Document {
  documentid: string;
  filename: string;
  uploadDate: string;
  filetype: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const ListDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { setInDoc, allowDoc } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [jfile, setjFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("usr");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dialogShownRef = useRef(false);

  useEffect(() => {
    if (!allowDoc && !dialogShownRef.current) {
      setShowPermissionDialog(true);
      dialogShownRef.current = true;
    }
  }, [allowDoc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" selected`);
      setLoading(true);
      setjFile(file);
      uploadContext(file);
    } else {
      toast.error("No file selected");
    }
  };

  const uploadContext = async (fileToUpload: File | null) => {
    const fileToUse = fileToUpload || jfile;
    if (!fileToUse) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUse);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/chat/upload-context",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Context file uploaded successfully.");
      setLoading(false);
      fetchDocuments(activeTab);
      setjFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || err.message || "Error uploading the context file."
      );
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setDeleteError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        "http://localhost:3000/api/chat/del-document",
        { documentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setDocuments(documents.filter((doc) => doc.documentid !== documentId));
        toast.success("Document deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete document");
      }
    } catch (error: any) {
      setDeleteError(error.message);
      toast.error(`Error deleting document: ${error.message}`);
    }
  };

  const fetchDocuments = async (userType = "usr") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        "http://localhost:3000/api/chat/list-documents",
        { userType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setDocuments(response.data.documents);
        setInDoc(false);
      } else {
        throw new Error(response.data.message || "Failed to fetch documents");
      }
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error(`Error fetching documents: ${error.message}`);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const PermissionDialog = () => (
    <Dialog
      open={showPermissionDialog}
      onOpenChange={(open) => {
        setShowPermissionDialog(open);
        if (!open) navigate("/user/dashboard");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Document Access Restricted</DialogTitle>
          <DialogDescription>
            You don't have permission to access documents. Please contact your administrator.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              setShowPermissionDialog(false);
              navigate("/user/dashboard");
            }}
          >
            Return to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const formatDate = (dateString: string) => {
    return dateString?.split("T")[0] || "N/A";
  };

  return (
    <>
      <PermissionDialog />      <div className="flex flex-col w-full p-2 sm:p-4 max-h-[calc(100vh-50px)] text-black lg:max-h-[calc(100vh-90px)] overflow-y-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Document Management</CardTitle>
              <CardDescription className="text-sm">View and manage your uploaded documents</CardDescription>
            </div>
              <div className="flex items-center w-full sm:w-auto">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? (
                  <>                    <ClipLoader size={16} color="black" />
                    <span className="whitespace-nowrap">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span className="whitespace-nowrap">Upload File</span>
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {deleteError && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                Error: {deleteError}
              </div>
            )}
            
            <Tabs defaultValue="usr" onValueChange={handleTabChange}>              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1 gap-1">
                <TabsTrigger 
                  value="usr" 
                  className="text-xs sm:text-sm data-[state=active]:bg-gray-800 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-400 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-md"
                >
                  <span className="relative">
                    User Doc's
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></span>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="adm" 
                  className="text-xs sm:text-sm data-[state=active]:bg-gray-800 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-400 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-md"
                >
                  <span className="relative">
                    Admin Doc's
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></span>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="MGM" 
                  className="text-xs sm:text-sm data-[state=active]:bg-gray-800 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-400 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-md"
                >
                  <span className="relative">
                    Org Doc's
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></span>
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">File Name</TableHead>
                        <TableHead className="whitespace-nowrap hidden sm:table-cell">File Type</TableHead>
                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Upload Date</TableHead>
                        <TableHead className="w-16 sm:w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex justify-center">
                              <ClipLoader size={24} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : documents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No documents found
                          </TableCell>
                        </TableRow>
                      ) : (
                        documents.map((document) => (
                          <TableRow key={document.documentid}>                            <TableCell className="flex items-center gap-2 max-w-[200px] sm:max-w-none">
                              <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                              <span className="truncate">{document.filename}</span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{document.filetype || "Unknown"}</TableCell>
                            <TableCell className="hidden sm:table-cell">{formatDate(document.uploadDate)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-red-600 cursor-pointer flex items-center gap-2"
                                    onClick={() => deleteDocument(document.documentid)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ListDocuments;