import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the type for the context value


// Create the context with a default value
const UserContext = createContext<any>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inDoc, setInDoc] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [conversationId1, setConversationId1] = useState<any>(null)
  const [name, setName] = useState<any>(null)
  const [email, setEmail] = useState<any>(null)
  const [lastname, setLastName] = useState<any>(null)
  const [img, setImg] = useState<any>(null)
  const [admin, setAdmin] = useState<boolean>(false)
  const [allowChat, setAllowChat] = useState<boolean>(true)
  const [allowDoc, setAllowDoc] = useState<boolean>(true)

  return (
    <UserContext.Provider value={{isLogin , setIsLogin , open, setOpen, isOpen, setIsOpen, inDoc, setInDoc , conversationId1 , setConversationId1
, name , setName , email , setEmail , lastname , setLastName , img , setImg  , admin, setAdmin , allowChat, setAllowChat , allowDoc, setAllowDoc   }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
};

export default UserContext;
