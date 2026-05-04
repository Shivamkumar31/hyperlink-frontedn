"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      const res = await fetch("https://hyperlink-7vjm.onrender.com/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center px-8 py-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          🚀 Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/create-post")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Create Post
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 MAIN */}
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 border">

          {/* 👤 PROFILE HEADER */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold shadow">
              {profile.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500">
                📍 {profile.location || "Location not set"}
              </p>
            </div>
          </div>

          {/* 📄 DETAILS */}
          <div className="space-y-4 text-sm text-gray-700">

            <div>
              <p className="font-semibold text-gray-900 mb-1">Bio</p>
              <p className="bg-gray-50 p-3 rounded-lg border text-gray-700">
                {profile.bio || "No bio added"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">Interests</p>
              <p className="bg-gray-50 p-3 rounded-lg border text-gray-700">
                {profile.interests?.length
                  ? profile.interests.join(", ")
                  : "Not set"}
              </p>
            </div>

          </div>

          {/* 🔘 ACTION */}
          <div className="mt-6">
            <button
              onClick={() => router.push("/profile")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition shadow-sm"
            >
              ✏️ Edit Profile
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}