"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Broadcast</h1>

        <div className="space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-black"
              >
                Profile
              </Link>

              
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Connect with People Nearby Instantly
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Post requests, find opportunities, and build real connections in your
          local area — all in real time.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="border border-gray-300 px-6 py-3 rounded-xl text-lg hover:bg-gray-100"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              href="/profile"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700"
            >
              Go to Profile
            </Link>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16 max-w-6xl mx-auto">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">📍 Local Discovery</h3>
          <p className="text-gray-600">
            Discover people and opportunities around your exact location.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">⚡ Instant Broadcast</h3>
          <p className="text-gray-600">
            Share your needs and reach nearby users instantly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">💬 Real-time Chat</h3>
          <p className="text-gray-600">
            Connect quickly with direct messaging and responses.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to connect?
        </h2>

        {!isLoggedIn ? (
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-100"
          >
            Create Account
          </Link>
        ) : (
          <Link
            href="/profile"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl text-lg font-semibold"
          >
            Go to Dashboard
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2026 Broadcast App. All rights reserved.
      </footer>

    </main>
  );
}