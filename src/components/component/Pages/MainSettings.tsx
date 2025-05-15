import { useState, useEffect } from 'react';
import { FiUser, FiKey, FiMessageSquare } from 'react-icons/fi';
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import axios from 'axios';

const MainSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    chatModel: ''
  });

  const token = localStorage.getItem('token');

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/save-key", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.data) {
        // Set the current configuration to the form data
        setFormData({
          name: response.data.data.name || '',
          value: response.data.data.value || '',
          chatModel: response.data.data.chatModel || ''
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch settings');
      }
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/save-key", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success('Settings saved successfully');
      // No need to refetch as we're already keeping track of the current values
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to save settings');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Settings Configuration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your application settings and API configuration
          </p>
        </div>

        {/* Current Configuration Card */}
        {formData.name && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiUser className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-gray-700">API Name</span>
                </div>
                <p className="text-gray-900">{formData.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiKey className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-gray-700">API Key</span>
                </div>
                <p className="text-gray-900">••••••••••••••••</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiMessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-gray-700">Chat Model</span>
                </div>
                <p className="text-gray-900">{formData.chatModel}</p>
              </div>
            </div>
          </div>
        )}

        {/* Update Configuration Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Configuration</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value='OPENAI_API_KEY'
                  // onChange={handleChange}  
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  placeholder="Enter API Name"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  placeholder="Enter API key"
                />
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="chatModel"
                  value={formData.chatModel}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                >
                  <option value="">Select Chat Model</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="gpt-4.1-turbo">gpt-4.1-turbo</option>
                  <option value="0.4-mini">0.4-mini</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Update Configuration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainSettings;