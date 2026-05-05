import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Title from "./Title";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneno: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setUserData(response.data.user);
        setFormData({
          name: response.data.user.name,
          phoneno: response.data.user.phoneno || "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (token) getProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(
        backendUrl + "/api/user/update-profile",
        {
          name: formData.name,
          phoneno: formData.phoneno,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      phoneno: userData.phoneno || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"EDIT"} text2={"PROFILE"} />
      </div>

      {userData ? (
        <div className="flex flex-col gap-4 mt-8 text-gray-700">
          <div className="flex flex-col md:flex-row gap-4 border-t border-b py-5 text-sm">
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-600">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{userData.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-600">Email</p>
                <p className="text-gray-800 font-medium">{userData.email}</p>
                <p className="text-xs text-gray-500">(Cannot be changed)</p>
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-600">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneno"
                    value={formData.phoneno}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {userData.phoneno || "Not added yet"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-8 py-2 text-sm transition-colors"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-8 py-2 text-sm transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black hover:bg-gray-800 text-white px-8 py-2 text-sm transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-8 text-gray-500 text-sm">Loading...</p>
      )}
    </div>
  );
};

export default EditProfile;
