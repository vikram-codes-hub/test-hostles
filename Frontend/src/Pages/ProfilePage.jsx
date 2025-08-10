import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/auth';

const ProfilePage = () => {
  const { UpdateProfile, authuser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: authuser?.fullName || "",
    email: authuser?.email || "",
    bio: authuser?.bio || "",
    profilePic: authuser?.profilePic || "",
    profilePicFile: null, // raw file for upload
  });

  // Update profile state when authuser changes (after successful update)
  useEffect(() => {
    if (authuser) {
      setProfile({
        name: authuser.fullName || "",
        email: authuser.email || "",
        bio: authuser.bio || "",
        profilePic: authuser.profilePic || "",
        profilePicFile: null,
      });
    }
  }, [authuser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfile({
        ...profile,
        profilePic: URL.createObjectURL(file), // for preview
        profilePicFile: file, // actual file
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!profile.profilePicFile) {
        // Update without changing profile picture
        await UpdateProfile({
          fullName: profile.name,
          bio: profile.bio,
        });
        setEditMode(false);
      } else {
        // Update with new profile picture
        const reader = new FileReader();
        reader.readAsDataURL(profile.profilePicFile);
        
        reader.onload = async () => {
          try {
            const base64img = reader.result;
            await UpdateProfile({
              fullName: profile.name,
              bio: profile.bio,
              profilePic: base64img,
            });
            setEditMode(false);
          } catch (error) {
            console.error("Profile update failed:", error);
            alert('Failed to update profile. Please try again.');
          }
        };
        
        reader.onerror = () => {
          console.error('Error reading file');
          alert('Error processing image file');
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert('Failed to update profile. Please try again.');
    } finally {
      // Only set loading to false if not using FileReader
      if (!profile.profilePicFile) {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset to original values from authuser
    setProfile({
      name: authuser?.fullName || "",
      email: authuser?.email || "",
      bio: authuser?.bio || "",
      profilePic: authuser?.profilePic || "",
      profilePicFile: null,
    });
    setEditMode(false);
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profile.profilePic && profile.profilePic.startsWith('blob:')) {
        URL.revokeObjectURL(profile.profilePic);
      }
    };
  }, [profile.profilePic]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center relative">
          {editMode ? (
            <div className="w-full h-full relative">
              <img
                src={profile.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          ) : (
            <img
              src={profile.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 w-full">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled // email is not editable
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">{profile.bio?.length || 0}/500</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-800">{profile.name || 'No name provided'}</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                {profile.email}
              </p>
              {profile.bio ? (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;