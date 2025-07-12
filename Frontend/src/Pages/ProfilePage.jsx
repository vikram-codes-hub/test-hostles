import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/auth';

const ProfilePage = () => {
  const { UpdateProfile, authuser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: authuser.fullName || "",
    email: authuser.email || "",
    bio: authuser.bio || "",
    profilePic: authuser.profilePic || "",
    profilePicFile: null, // raw file for upload
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        await UpdateProfile({
          fullName: profile.name,
          bio: profile.bio,
        });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(profile.profilePicFile);
        reader.onload = async () => {
          const base64img = reader.result;
          await UpdateProfile({
            fullName: profile.name,
            bio: profile.bio,
            profilePic: base64img,
          });
        };
      }
      setEditMode(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
          {editMode ? (
            <input type="file" accept="image/*" onChange={handleImageChange} />
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
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled // email is not editable
              />
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-700">{profile.bio}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
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
