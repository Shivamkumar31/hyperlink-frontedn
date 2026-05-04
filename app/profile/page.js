"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    lat: null,
    lng: null,
    interests: "",
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("https://hyperlink-7vjm.onrender.com/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data) {
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          location: data.location || "",
          lat: data.lat || null,
          lng: data.lng || null,
          interests: data.interests?.join(", ") || "",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSearch = async (value) => {
    setForm({ ...form, location: value });

    if (value.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
    );

    const data = await res.json();
    setSuggestions(data);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!form.lat || !form.lng) {
      alert("Please select location from suggestions");
      return;
    }

    await fetch("https://hyperlink-7vjm.onrender.com/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        interests: form.interests.split(","),
      }),
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Profile Setup
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tell us about yourself
          </p>
        </div>

        <div className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={form.name}
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Bio
            </label>
            <input
              value={form.bio}
              placeholder="Short bio"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
            />
          </div>

          {/* LOCATION */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              value={form.location}
              placeholder="Search location"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              onChange={(e) => handleSearch(e.target.value)}
            />

            {suggestions.length > 0 && (
              <ul className="absolute z-20 bg-white border mt-1 w-full rounded-lg shadow-md max-h-44 overflow-y-auto text-sm">
                {suggestions.map((item) => (
                  <li
                    key={item.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setForm({
                        ...form,
                        location: item.display_name,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon),
                      });
                      setSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* INTERESTS */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Interests
            </label>
            <input
              value={form.interests}
              placeholder="e.g. Tech, Networking, Jobs"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              onChange={(e) =>
                setForm({ ...form, interests: e.target.value })
              }
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition shadow-sm"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}