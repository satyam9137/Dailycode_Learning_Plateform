import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const Validate = {
    name: (v) => {
      if (!v.trim()) return "Name is required";
      if (v.length < 5) return "Name must be at least 5 characters";
      return "";
    },
    email: (v) => {
      if (!v.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "Invalid email format";
      return "";
    },
    password: (v) => {
      if (!v.trim()) return "Password is required";
      if (v.length < 6) return "Password must be at least 6 characters";
      return "";
    },
    cpassword: (p, cp) => {
      if (p !== cp) return "Passwords do not match";
      return "";
    },
  };

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error =
      Validate.name(form.name) ||
      Validate.email(form.email) ||
      Validate.password(form.password) ||
      Validate.cpassword(form.password, form.cpassword);

    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await axios.post("https://dailycode-learning-plateform-2.onrender.com/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account ✨</h2>
        <p style={styles.subtitle}>Join DailyCode and start coding smarter</p>

        {message && <p style={styles.error}>{message}</p>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleForm}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleForm}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleForm}
            style={styles.input}
          />

          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={form.cpassword}
            onChange={handleForm}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  error: { color: "#f87171", marginBottom: "1rem" },
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#111827", padding: "2rem", borderRadius: "12px", width: "400px", color: "white" },
  title: { color: "#38bdf8" },
  subtitle: { color: "#9ca3af" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.8rem", borderRadius: "6px", border: "none" },
  button: { padding: "0.8rem", background: "#2563eb", color: "white", border: "none", borderRadius: "6px" },
  footer: { marginTop: "1rem" },
  link: { color: "#38bdf8" },
};
