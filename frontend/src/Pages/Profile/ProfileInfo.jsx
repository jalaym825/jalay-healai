import React, { useState, useRef, useEffect } from 'react';
import { Label } from '../../UIs/shadcn-ui/label';
import { Input } from '../../UIs/shadcn-ui/input';
import { Button } from '../../UIs/shadcn-ui/button';
import { MdVerifiedUser } from 'react-icons/md';
import { toast } from 'sonner';
import Global from '../../Utils/Global';
import { FaUserCircle } from 'react-icons/fa';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const ProfileInfo = () => {
  const [editable, setEditable] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); // New state for selected image

  const [formData, setFormData] = useState({
    name: `${Global.user.firstName} ${Global.user.lastName}`,
    email: Global.user.email,
    avatar: Global.user.avatar || '', // Adding avatar state
  });

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const sendVerificationLink = async () => {
    setIsSendingVerification(true);
    try {
      await Global.httpPost('/auth/send-verification-mail');
      toast.success('Verification link sent successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          avatar: reader.result, // Temporarily show the image
        }));
      };
      reader.readAsDataURL(file);
      setMenuOpen(false);
    }
  };

  const handleSave = async () => {
    if (editable) {
      if (!validate()) {
        return;
      }

      try {
        setSaving(true);
        const updateData = {
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ')[1],
          email: formData.email,
        };

        // Upload avatar to Cloudinary if a new image is selected
        if (selectedImage) {
          const formdata = new FormData();
          formdata.append("file", selectedImage);
          formdata.append("upload_preset", "s3zv7zdt");

          const res = await axios.post("https://api.cloudinary.com/v1_1/dgz8lnzir/image/upload", formdata);
          if (res.status === 200) {
            const imgurl = res.data.secure_url;
            updateData.avatar = imgurl; // Add avatar URL for backend
            setFormData((prevData) => ({
              ...prevData,
              avatar: imgurl, // Update form data with Cloudinary URL
            }));
          }
        }

        await Global.httpPut('/users/update', updateData);
        toast.success('Profile updated successfully');

        // Update Global.user after successful update
        Global.user.firstName = updateData.firstName;
        Global.user.lastName = updateData.lastName;
        if (formData.email !== Global.user.email) {
          Global.user.isVerified = false;
        }
        Global.user.email = formData.email;
        Global.user.avatar = updateData.avatar; // Update avatar if changed
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSaving(false);
        setSelectedImage(null); // Reset selected image
      }
    }
    setEditable(!editable);
  };

  const handleAvatarDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: null,
    }));
    Global.user.avatar = ''; // Update Global user avatar
    setMenuOpen(false);
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
    setMenuOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (menuOpen && !e.target.closest('.avatar-container')) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative avatar-container">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}
          <input
            type="file"
            id="avatar"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*" // Accepts all image types
          />
          {
            editable && (
              <button
              onClick={handleMenuClick}
              className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              aria-label="Edit avatar"
            >
              <FaPencilAlt className="h-5 w-5" />
            </button>  
            )
          }
          {menuOpen && (
            <div className="absolute flex space-x-2 right-0 top-1/2 transform -translate-y-1/2 translate-x-full bg-gray-50 rounded-lg p-1 shadow-lg">
              <button
                onClick={handleEditClick}
                className="text-gray-700 bg-gray-200 rounded px-2 py-1 flex items-center space-x-1 hover:bg-gray-300"
              >
                <FaPencilAlt className="h-3 w-3" />
                <span className="text-sm">Change</span>
              </button>
              <button
                onClick={handleAvatarDelete}
                className="text-gray-700 bg-gray-200 rounded px-2 py-1 flex items-center space-x-1 hover:bg-gray-300"
              >
                <FaTrashAlt className="h-3 w-3" />
                <span className="text-sm">Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-2 mt-4">
        <Label htmlFor="name" className="text-sm font-semibold">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Enter your name"
          disabled={!editable}
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <span className="ml-2 text-sm flex items-center">
            {Global.user.isVerified ? (
              <>
                (Verified <MdVerifiedUser className="ml-1 text-green-500 " />)
              </>
            ) : (
              <>
                (
                <span className="text-[#d29922] font-semibold mr-1">
                  Unverified
                </span>{" "}
                -
                <button
                  className="pl-1.5 text-blue-500 disabled:text-gray-400 hover:underline focus:outline-none"
                  onClick={sendVerificationLink}
                  disabled={isSendingVerification}
                >
                  {isSendingVerification
                    ? "Sending link..."
                    : "Click here to verify"}
                </button>
                )
              </>
            )}
          </span>
        </div>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          disabled={!editable}
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>
      <div className="grid md:grid-cols-5 gap-2">
        <Button onClick={handleSave} className="w-full" disabled={saving}>
          {editable ? (saving ? "Saving..." : "Save") : "Edit"}
        </Button>
      </div>
    </>
  );
};

export default ProfileInfo;
