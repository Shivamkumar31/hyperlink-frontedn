"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [filter, setFilter] = useState({
    category: "",
    urgency: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    urgency: "Low",
  });

  const router = useRouter();

  // AUTH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  // FETCH POSTS
  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await fetch(
          `https://hyperlink-7vjm.onrender.com/api/posts?lat=${lat}&lng=${lng}&radius=50000&category=${filter.category}&urgency=${filter.urgency}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setPosts(data);
        setLoading(false);
      },
      async () => {
        const res = await fetch(
          `https://hyperlink-7vjm.onrender.com/api/posts?category=${filter.category}&urgency=${filter.urgency}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setPosts(data);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (view === "feed") fetchPosts();
  }, [view, filter]);

  // FETCH PROFILE
  useEffect(() => {
    if (view !== "profile") return;

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://hyperlink-7vjm.onrender.com/api/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setProfile({
        ...data,
        interests: data.interests?.join(", ") || "",
      });
    };

    fetchProfile();
  }, [view]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // CREATE POST
  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const res = await fetch(
        "https://hyperlink-7vjm.onrender.com/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            lat,
            lng,
          }),
        }
      );

      if (res.ok) {
        setForm({
          title: "",
          description: "",
          category: "Other",
          urgency: "Low",
        });

        setView("feed");
        fetchPosts();
      }
    });
  };

  // UPDATE PROFILE
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

    await fetch("https://hyperlink-7vjm.onrender.com/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...profile,
        interests: profile.interests.split(","),
      }),
    });

    setEditMode(false);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #FF6B35;
      --primary-light: #FF8C5A;
      --primary-dark: #E55A2B;
      --secondary: #00A7A7;
      --accent: #FFD60A;
      --dark: #1a1a1a;
      --light: #FAFAFA;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --border: #EFEFEF;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
    }

    body {
      font-family: 'Inter', sans-serif;
      color: var(--text-primary);
      background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
    }

    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(0, 167, 167, 0.03) 100%);
      position: relative;
      overflow-x: hidden;
    }

    .dashboard-container::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0, 167, 167, 0.08) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* HEADER */
    .header {
      position: relative;
      z-index: 10;
      background: white;
      border-bottom: 1px solid var(--border);
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(10px);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-family: 'Syne', sans-serif;
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .nav-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .nav-btn {
      font-family: 'Inter', sans-serif;
      padding: 0.65rem 1.25rem;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .nav-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .nav-btn:active::before {
      width: 300px;
      height: 300px;
    }

    .feed-btn {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      color: white;
    }

    .feed-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
    }

    .profile-btn {
      background: linear-gradient(135deg, var(--secondary) 0%, #00BFBF 100%);
      color: white;
    }

    .profile-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 167, 167, 0.3);
    }

    .create-btn {
      background: linear-gradient(135deg, var(--success) 0%, #34D399 100%);
      color: white;
    }

    .create-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }

    .logout-btn {
      background: linear-gradient(135deg, var(--danger) 0%, #F87171 100%);
      color: white;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
    }

    /* MAIN CONTENT */
    .main-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }

    .view-title {
      font-family: 'Syne', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
      text-align: center;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeInDown 0.6s ease-out;
    }

    /* FILTERS */
    .filter-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
      justify-content: center;
      flex-wrap: wrap;
      animation: fadeInUp 0.6s ease-out 0.1s both;
    }

    .filter-select {
      padding: 0.85rem 1.25rem;
      border: 2px solid var(--border);
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      background: white;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 160px;
    }

    .filter-select:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.1);
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    /* FEED */
    .posts-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .post-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      border: 1px solid var(--border);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .post-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 107, 53, 0.05) 100%);
      transition: left 0.4s ease;
    }

    .post-card:hover::before {
      left: 100%;
    }

    .post-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }

    .post-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
      letter-spacing: -0.3px;
    }

    .post-description {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .category-badge {
      background: linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%);
      color: var(--text-primary);
      padding: 0.6rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .urgency-badge {
      padding: 0.6rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .urgency-low {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
      color: #059669;
    }

    .urgency-medium {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
      color: #1D4ED8;
    }

    .urgency-high {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
      color: #991B1B;
    }

    .urgency-emergency {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
      color: #7F1D1D;
      font-weight: 700;
    }

    .post-distance {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    /* PROFILE */
    .profile-card {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      border: 1px solid var(--border);
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .profile-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .profile-section {
      margin-bottom: 1.5rem;
    }

    .profile-label {
      font-weight: 600;
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .profile-value {
      color: var(--text-secondary);
      word-break: break-word;
    }

    .profile-input {
      width: 100%;
      padding: 0.9rem 1.25rem;
      border: 2px solid var(--border);
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      margin-bottom: 1rem;
    }

    .profile-input:hover {
      border-color: var(--primary);
    }

    .profile-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    /* FORMS */
    .form-container {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      border: 1px solid var(--border);
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .form-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid var(--border);
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--text-secondary);
    }

    .form-input:hover,
    .form-textarea:hover,
    .form-select:hover {
      border-color: var(--primary);
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    /* BUTTONS */
    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:active::before {
      width: 300px;
      height: 300px;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
    }

    .btn-success {
      background: linear-gradient(135deg, var(--success) 0%, #34D399 100%);
      color: white;
    }

    .btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    /* LOADING */
    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 107, 53, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .logo {
        font-size: 1.5rem;
      }

      .nav-buttons {
        width: 100%;
        justify-content: center;
      }

      .nav-btn {
        font-size: 0.85rem;
        padding: 0.55rem 1rem;
      }

      .main-content {
        padding: 2rem 1rem;
      }

      .view-title {
        font-size: 2rem;
      }

      .filter-container {
        gap: 0.75rem;
      }

      .filter-select {
        min-width: 140px;
        padding: 0.7rem 1rem;
      }

      .profile-card,
      .form-container {
        padding: 1.5rem;
      }

      .post-meta {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        {/* HEADER */}
        <div className="header">
          <div className="header-content">
            <h1 className="logo">Broadcast 📡</h1>

            <div className="nav-buttons">
              <button
                onClick={() => setView("feed")}
                className="nav-btn feed-btn"
              >
                🌍 Feed
              </button>
              <button
                onClick={() => setView("profile")}
                className="nav-btn profile-btn"
              >
                👤 Profile
              </button>
              <button
                onClick={() => setView("create")}
                className="nav-btn create-btn"
              >
                ➕ Create
              </button>
              <button
                onClick={handleLogout}
                className="nav-btn logout-btn"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* ================= FEED ================= */}
          {view === "feed" && (
            <>
              <h2 className="view-title">📍 Nearby Feed</h2>

              <div className="filter-container">
                <select
                  onChange={(e) =>
                    setFilter({ ...filter, category: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  <option>Housing</option>
                  <option>Jobs</option>
                  <option>Networking</option>
                  <option>Social</option>
                  <option>Business</option>
                  <option>Help</option>
                  <option>Services</option>
                </select>

                <select
                  onChange={(e) =>
                    setFilter({ ...filter, urgency: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Urgency</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Emergency</option>
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <div className="loading-spinner"></div>
                  <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
                    Loading posts...
                  </p>
                </div>
              ) : posts.length > 0 ? (
                <div className="posts-container">
                  {posts.map((post) => (
                    <div key={post._id} className="post-card">
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-description">{post.description}</p>

                      <div className="post-meta">
                        <span className="category-badge">📂 {post.category}</span>

                        <span
                          className={`urgency-badge urgency-${post.urgency.toLowerCase()}`}
                        >
                          ⚡ {post.urgency}
                        </span>
                      </div>

                      {post.distance !== undefined && (
                        <p className="post-distance">
                          📍 {(post.distance / 1000).toFixed(2)} km away
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
                    No posts found. Be the first to broadcast! 🎙️
                  </p>
                </div>
              )}
            </>
          )}

          {/* ================= PROFILE ================= */}
          {view === "profile" && profile && (
            <div className="profile-card">
              <h2 className="profile-title">👤 Your Profile</h2>

              {!editMode ? (
                <>
                  <div className="profile-section">
                    <span className="profile-label">Name</span>
                    <span className="profile-value">{profile.name}</span>
                  </div>
                  <div className="profile-section">
                    <span className="profile-label">Bio</span>
                    <span className="profile-value">{profile.bio}</span>
                  </div>
                  <div className="profile-section">
                    <span className="profile-label">Location</span>
                    <span className="profile-value">{profile.location}</span>
                  </div>
                  <div className="profile-section">
                    <span className="profile-label">Interests</span>
                    <span className="profile-value">{profile.interests}</span>
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-primary"
                    style={{ marginTop: "1.5rem" }}
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="profile-input"
                    placeholder="Name"
                  />
                  <input
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="profile-input"
                    placeholder="Bio"
                  />
                  <input
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="profile-input"
                    placeholder="Location"
                  />
                  <input
                    value={profile.interests}
                    onChange={(e) =>
                      setProfile({ ...profile, interests: e.target.value })
                    }
                    className="profile-input"
                    placeholder="Interests (comma separated)"
                  />

                  <button
                    onClick={handleUpdateProfile}
                    className="btn btn-success"
                  >
                    💾 Save Changes
                  </button>
                </>
              )}
            </div>
          )}

          {/* ================= CREATE ================= */}
          {view === "create" && (
            <div className="form-container">
              <h2 className="form-title">➕ Create Post</h2>

              <input
                value={form.title}
                placeholder="What's your post about?"
                className="form-input"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                value={form.description}
                placeholder="Tell us more details..."
                className="form-textarea"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <select
                className="form-select"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                value={form.category}
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

              <select
                className="form-select"
                onChange={(e) =>
                  setForm({ ...form, urgency: e.target.value })
                }
                value={form.urgency}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>

              <button onClick={handleCreatePost} className="btn btn-success">
                🚀 Post to Broadcast
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}