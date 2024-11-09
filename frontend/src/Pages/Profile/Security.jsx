import React, { useState } from 'react';
import { Label } from '../../UIs/shadcn-ui/label';
import { Input } from '../../UIs/shadcn-ui/input';
import { Button } from '../../UIs/shadcn-ui/button';
import { toast } from 'sonner';
import Global from '../../Utils/Global';

const Security = () => {
  const [saving, setSaving] = useState(false);
  const [sendingResetLink, setSendingResetLink] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validatePasswords = () => {
    const errors = {};
    if (Global.user.isPasswordSet && !formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validatePasswords();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await Global.httpPost('/auth/change-password', {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      Global.user.isPasswordSet = true;
      // empty the fields
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleForgotPassword = async () => {
    setSendingResetLink(true);
    try {
      await Global.httpPost('/auth/send-reset-password-link', {
        email: Global.user.email // Assuming the user's email is stored in Global.user.email
      });
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setSendingResetLink(false);
    }
  };

  return (
    <>
      {Global.user.isPasswordSet && (
        <div className="grid gap-2">
          <Label htmlFor="currentPassword" className="text-sm">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Enter your current password"
            value={formData.currentPassword}
            onChange={handleInputChange}
          />
          {errors.currentPassword && <span className="text-red-500 text-sm">{errors.currentPassword}</span>}
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="newPassword" className="text-sm">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
        {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword}</span>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handleSave} className="w-full md:w-auto" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button 
          onClick={handleForgotPassword} 
          variant="link" 
          className="text-blue-500 text-sm"
          disabled={sendingResetLink}
        >
          {sendingResetLink ? "Sending link..." : "Forgot Password?"}
        </Button>
      </div>
    </>
  );
};

export default Security;