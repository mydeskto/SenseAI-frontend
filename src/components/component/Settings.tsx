import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Settings = () => {
    const { name, setName, email, lastname, setLastName, img, setImg } = useUserContext();
    const [formData, setFormData] = useState({
        firstName: name,
        lastName: lastname,
        image: img,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'file' && e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdateProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios.put(
                "http://localhost:3000/api/update-profile",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setName(response.data.user.name);
            setLastName(response.data.user.lastname);
            setImg(response.data.user.img);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile:', error);
        }
    };

    const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                "http://localhost:3000/api/change-password",
                {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            toast.success('Password changed successfully');
            setIsPasswordDialogOpen(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <div className="p-6">
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-w-md mx-auto">
                        <div className="flex justify-center">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={`http://localhost:3000/${img}`} />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="space-y-4">
                            <Input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                            />
                            <Input
                                placeholder="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Email"
                                name="email"
                                value={email}
                                disabled
                            />
                            <Button
                                className="w-full"
                                onClick={handleUpdateProfile}
                            >
                                Update Profile
                            </Button>
                            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        className="w-full bg-gray-600 hover:bg-gray-800 hover:text-white text-white"
                                    >
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-center mb-4">Change Password</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                placeholder="Current Password"
                                                name="oldPassword"
                                                value={passwordForm.oldPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                placeholder="New Password"
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleChangePassword}
                                            className="w-full bg-gray-600 text-white hover:bg-gray-800 transform transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            Update Password
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
