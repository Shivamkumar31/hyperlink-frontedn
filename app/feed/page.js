"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("https://hyperlink-7vjm.onrender.com/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">

      {/* 🔷 HEADER */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          📍 Nearby Feed
        </h1>
        <p className="text-gray-500 mt-2">
          Discover posts around you
        </p>
      </div>

      {/* 🔄 LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading posts...</p>
      )}

      {/* ❌ EMPTY */}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500">
          No nearby posts found 😕
        </p>
      )}

      {/* 🧾 POSTS */}
      <div className="grid gap-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* 🔹 Title */}
            <h2 className="text-lg font-semibold text-gray-800">
              {post.title}
            </h2>

            {/* 🔹 Description */}
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {post.description}
            </p>

            {/* 🔹 Meta Info */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded-md">
                📂 {post.category}
              </span>

              <span
                className={`px-2 py-1 rounded-md font-medium ${
                  post.urgency === "High" || post.urgency === "Emergency"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                ⚡ {post.urgency}
              </span>
            </div>

            {/* 🔹 Distance */}
            {post.distance !== undefined && (
              <p className="text-xs text-gray-400 mt-3">
                📍 {(post.distance / 1000).toFixed(2)} km away
              </p>
            )}

            {/* 🔹 Actions */}
            <div className="flex gap-3 mt-5">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                💬 Message
              </button>

              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                🤝 Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}