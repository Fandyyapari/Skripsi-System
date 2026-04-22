import { useState } from "react";

function Login({ setUser }) {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setMessage("Login berhasil!");
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          setMessage(data.message);
        }
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        /><br /><br />

        <button>Login</button>
      </form>

      {/* 🔥 PESAN */}
      {message && (
        <p style={{ marginTop: "15px", color: "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;