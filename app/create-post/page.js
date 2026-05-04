"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    urgency: "Low",
    radius: 5,
    duration: "24h",
  });

  const [loading, setLoading] = useState(false);

  const getUserLocation = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://hyperlink-7vjm.onrender.com/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    if (!data.lat || !data.lng) {
      throw new Error("Profile location not set");
    }

    return {
      lat: data.lat,
      lng: data.lng,
    };
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Title and description required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const loc = await getUserLocation();

      const res = await fetch("https://hyperlink-7vjm.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          lat: loc.lat,
          lng: loc.lng,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/feed");
      } else {
        alert(data.message || "Error creating post");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create a Post
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Share what you need with people nearby
          </p>
        </div>

        {/* TITLE */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            placeholder="Enter post title"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Describe your request..."
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="w-full mt-1 p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>Housing</option>
            <option>Jobs</option>
            <option>Networking</option>
            <option>Social</option>
            <option>Business</option>
            <option>Help</option>
            <option>Services</option>
            <option>Other</option>
          </select>
        </div>

        {/* URGENCY */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Urgency
          </label>
          <select
            className="w-full mt-1 p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, urgency: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Emergency</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "🚀 Post"}
        </button>
      </div>
    </div>
  );
}