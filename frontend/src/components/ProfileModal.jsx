import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, ArrowRight, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/Toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl transform transition-all scale-100 overflow-hidden ring-1 ring-black/5">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Update Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                {...register('name')}
                className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center text-xs text-red-600 font-medium">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                {...register('email')}
                className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 flex items-center text-xs text-red-600 font-medium">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
