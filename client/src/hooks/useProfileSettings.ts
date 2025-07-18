import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  getUserByUsername,
  deleteUser,
  resetPassword,
  updateBiography,
} from '../services/userService';
import { User } from '../types';
import useUserContext from './useUserContext';

/**
 * A custom hook to encapsulate all logic/state for the ProfileSettings component.
 */
const useProfileSettings = () => {
  // Gets the username of the user being viewed from the URL
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  // This is the user currently logged in
  const { user: currentUser } = useUserContext();

  // Local state
  const [userData, setUserData] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editBioMode, setEditBioMode] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For delete-user confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const canEditProfile = currentUser?.username === username;

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setUserData(data);
      } catch (error) {
        setErrorMessage('Error fetching user profile');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswords = () => {
    if (!newPassword || !confirmNewPassword) {
      setErrorMessage('Both password fields are required');
      return false;
    }
    
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async () => {
    if (!username) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!validatePasswords()) {
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(username, newPassword);
      setSuccessMessage('Password reset successfully');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setErrorMessage('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBiography = async () => {
    if (!username) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      setLoading(true);
      const updatedUser = await updateBiography(username, newBio);
      setUserData(updatedUser);
      setEditBioMode(false);
      setSuccessMessage('Biography updated successfully');
    } catch (error) {
      setErrorMessage('Error updating biography');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = () => {
    if (!username) return;

    setShowConfirmation(true);
    setPendingAction(() => async () => {
      try {
        setLoading(true);
        await deleteUser(username);
        setSuccessMessage('User deleted successfully');
        navigate('/');
      } catch (error) {
        setErrorMessage('Error deleting user');
      } finally {
        setLoading(false);
        setShowConfirmation(false);
      }
    });
  };

  return {
    userData,
    newPassword,
    confirmNewPassword,
    setNewPassword,
    setConfirmNewPassword,
    loading,
    editBioMode,
    setEditBioMode,
    newBio,
    setNewBio,
    successMessage,
    errorMessage,
    showConfirmation,
    setShowConfirmation,
    pendingAction,
    setPendingAction,
    canEditProfile,
    showPassword,
    togglePasswordVisibility,
    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
  };
};

export default useProfileSettings;