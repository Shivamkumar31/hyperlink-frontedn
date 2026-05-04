"use client";
import { useState } from "react";
import { loginUser } from "../utils/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async () => {
    const data = await loginUser(form);

    if (data.token) {
      localStorage.setItem("token", data.token);

      if (!data.profileCompleted) {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition shadow-sm"
        >
          Login
        </button>

        {/* FOOTER */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}