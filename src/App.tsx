import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from "./components/component/Pages/Signup";
import Login from "./components/component/Pages/login";
import ChatContent from "./components/ChatContent";
import ListDocuments from "./components/ListDocuments";
import Dashboard from "./components/component/Pages/Dashboard";
import Settings from "./components/component/Settings";
import { Toaster } from 'sonner';
import AllUsers from "./components/component/Pages/AllUsers";
import MainSettings from "./components/component/Pages/MainSettings";
import UserHome from "./SimpleUser/UserHome";
import UserDashboard from "./SimpleUser/Compoenets/UserDashboard";
import UserChatContent from "./SimpleUser/UserChatContant";
import OrgDashboard from "./OrgUser/Compoents/OrgDashboard";
import OrgChatContant from "./OrgUser/OrgChatContant";
import OrgAllUsers from "./OrgUser/Compoents/OrgAllUsers";
import OrgListDocuments from "./OrgUser/Compoents/OrgListDocuments";
import UsrListDocument from "./SimpleUser/UsrListDocument";

import OrgHome from "./OrgUser/OrgHome";
import ForgotPassword from "./components/ForgotPassword";
import VerifyPin from "./VerifyPin";
import ResetPassword from "./ResetPassword";
import EmailVerify from "./components/component/Pages/EmailVerify";

function App() {
  return (
    <>
      <Toaster richColors  />
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-pin" element={<VerifyPin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerify />} />

        {/* Admin routes */}
        <Route element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/list-documents" element={<ListDocuments />} />
          <Route path="/chat/:conversationId" element={<ChatContent />} />
          <Route path="/chat/*" element={<ChatContent />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/settings" element={<MainSettings />} />
          <Route path="/all-users" element={<AllUsers />} />
        </Route>

        {/* User routes */}
        <Route element={<UserHome />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/chat/*" element={<UserChatContent />} />
          <Route path="/user/chat/:conversationId" element={<UserChatContent />} />
          <Route path="/user/list-documents" element={<UsrListDocument />} />
          <Route path="/user/profile/settings" element={<Settings />} />
        </Route>
        {/* Org routes */}
        <Route element={<OrgHome />}>
          <Route path="/org/dashboard" element={<OrgDashboard />} />
          <Route path="/org/chat/*" element={<OrgChatContant />} />
          <Route path="/org/chat/:conversationId" element={<OrgChatContant />} />
          <Route path="/org/list-documents" element={<OrgListDocuments />} />
          <Route path="/org/all-users" element={<OrgAllUsers />} />
          <Route path="/org/profile/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
