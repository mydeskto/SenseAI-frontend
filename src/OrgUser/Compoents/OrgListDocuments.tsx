import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { FaRegFileAlt } from "react-icons/fa";
import { useUserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {toast }from "sonner";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Document {
  documentid: string;
  filename: string;
  uploadDate: string;
  filetype: string;
  userid : any;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const OrgListDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openDocId, setOpenDocId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { setInDoc } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  

  const [jfile, setjFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
      toast.success(`File "${file.name}" selected`);
      setLoading(true);
      setjFile(file);
      uploadContext(file);
    } else {
      console.log("No file selected");
      toast.error("No file selected");
    }
  };

  const uploadContext = async (fileToUpload: File | null) => {
    const fileToUse = fileToUpload || jfile;

    if (!fileToUse) {
      toast.error("Please select a file to upload.");
      return;
    }

    console.log("Uploading file:", fileToUse);

    const formData = new FormData();
    formData.append("file", fileToUse);

    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);

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

      console.log("Upload response:", response.data);
      // toast("Context file uploaded successfully.");
      toast.success("Context file uploaded successfully.");
      setLoading(false);
      fetchDocuments();
      setjFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const err = error as ApiError;
      console.error("Error uploading file:", err);
      toast.error(
        err.response?.data?.message || err.message || "Error uploading the context file."
      );
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setDeleteError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Make the request to delete the document
      const response = await fetch(
        "http://localhost:3000/api/chat/del-document",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentId }),
        }
      );

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      // Try to parse the JSON response
      const data = await response.json();

      if (data.success) {
        console.log("Document deleted successfully:", data.message);
        // Update the documents list by filtering out the deleted document
        setDocuments(documents.filter((doc) => doc.documentid !== documentId));
        setOpenDocId(null);
        return data;
      } else {
        throw new Error(data.message || "Failed to delete document");
      }
    } catch (error : any) {
      console.error("Error deleting document:", error);
      setDeleteError(error.message);
      return null;
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "http://localhost:3000/api/chat/org/list-documents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log(result);
      if (result.success) {
        setDocuments(result.documents);
        console.log("Documents fetched:", result.documents);
        setInDoc(false);
      } else {
        throw new Error(
          result.message || "API call succeeded but returned success: false"
        );
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Permission Dialog component


  return (
    <>
      
      <div className="flex flex-col lg:gap-0 max-h-[calc(100vh-50px)] text-black lg:max-h-[calc(100vh-90px)] scrollbar-thumb-transparent overflow-y-auto items-center w-full flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <div className="w-[62%]  flex justify-end items-center mt-3">
          
          <div>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              htmlFor="fileInput"
              className="cursor-pointer"
            >
              <div className="flex justify-center w-40 items-center gap-2 border border-gray-700 p-2 rounded-lg text-black">
                {!loading ? (
                  <>Upload File</>
                ) : (
                  <>
                    Upload&nbsp;
                    <ClipLoader size={20} color="black" />
                  </>
                )}
              </div>
            </motion.label>
          </div>
        </div>
        {deleteError && (
          <div className="bg-red-500 text-black p-2 w-[70%] rounded-md mb-2">
            Error: {deleteError}
          </div>
        )}

        <div className="w-[70%]">
          <div className="w-full flex flex-col justify-center items-center mt-3 gap-4">
            {documents.length === 0 ? (
              <div className="text-black text-center p-4">No documents found</div>
            ) : (
              documents.map((item) => (
                <div
                  key={item.documentid}
                  className="relative flex w-[90%] border border-gray-600 flex-row items-center shadow-2xl text-black rounded-md p-4 gap-3"
                >
                  <FaRegFileAlt />

                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-center items-start">
                      {item.filename}
                      <div className="flex flex-row place-items-center text-[12px]">
                        Date: <span>{item.uploadDate?.split("T")[0]}</span>
                        &nbsp;&nbsp;
                        <LuDot color="black"/>
                        <span>{item.filetype || "N/A"}</span>
                        <LuDot color="black"/>UserId
                        <span>{item.userid }</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        onClick={() =>
                          setOpenDocId(
                            openDocId === item.documentid ? null : item.documentid
                          )
                        }
                        className="cursor-pointer"
                      >
                        <BsThreeDots size={25} color="black" />
                      </div>
                    </div>
                  </div>

                  {/* Framer Motion Popup */}
                  <AnimatePresence>
                    {openDocId === item.documentid && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-11 bottom-5 mt-1 z-50"
                      >
                        <button
                          className="text-sm bg-white border-1 border-black  text-black px-3 py-1 rounded-md shadow-md"
                          onClick={() => deleteDocument(item.documentid)}
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrgListDocuments;
