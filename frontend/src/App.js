import { useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Pengajuan from "./Pengajuan";
import Bimbingan from "./Bimbingan";
import Jadwal from "./Jadwal";
import Dokumen from "./Dokumen";
import Progress from "./Progress";
import Laporan from "./Laporan";
import Pengguna from "./Pengguna";

function App() {
  const API = "http://localhost:5000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "mahasiswa"
  });

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("mahasiswa");
  const [page, setPage] = useState("dashboard");

  const [jadwal, setJadwal] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  // =========================
  // AUTO LOGIN
  // =========================
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setUserName(savedUser.username);
      setUserRole(savedUser.role);
      setIsLoggedIn(true);
    }
  }, []);

  // =========================
  // FETCH DATA JADWAL
  // =========================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/jadwal`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setJadwal(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // =========================
  // LOGIN
  // =========================
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUserName(data.user.username);
      setUserRole(data.user.role);
      setIsLoggedIn(true);

      if (data.user.role === "admin") setPage("pengguna");
      else if (data.user.role === "dosen") setPage("bimbingan");
      else if (data.user.role === "mahasiswa") setPage("pengajuan");
      else if (data.user.role === "kaprodi") setPage("laporan");

    } catch (err) {
      alert("Server error");
      console.log(err);
    }
  };

  // =========================
  // QUICK LOGIN DEMO
  // =========================
  const handleQuickLogin = (role) => {
    const user = { username: role, role };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "demo-token");

    setUserName(role);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUserName("");
    setUserRole("mahasiswa");
  };

  const handleNavigate = (target) => {
    setPage(target);
  };

  // =========================
  // FORM JADWAL
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      mahasiswa: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: ""
    });

    setEditId(null);
  };

  // =========================
  // TAMBAH / EDIT JADWAL
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.jam_mulai >= form.jam_selesai) {
      alert("Jam selesai harus lebih besar!");
      return;
    }

    const url = editId
      ? `${API}/jadwal/${editId}`
      : `${API}/jadwal`;

    const method = editId ? "PUT" : "POST";

    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    alert(data.message);

    fetchData();
    resetForm();
  };

  // =========================
  // HAPUS JADWAL
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/jadwal/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    alert(data.message);
    fetchData();
  };

  // =========================
  // ROUTING
  // =========================
  if (!isLoggedIn) {
    return (
      <Login
        loginForm={loginForm}
        onInputChange={handleLoginChange}
        onLoginSubmit={handleLoginSubmit}
        onQuickLogin={handleQuickLogin}
      />
    );
  }

  if (page === "pengajuan")
    return (
      <Pengajuan
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "bimbingan")
    return (
      <Bimbingan
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "jadwal")
    return (
      <Jadwal
        role={userRole}
        username={userName}
        jadwal={jadwal}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "dokumen")
    return (
      <Dokumen
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "progress")
    return (
      <Progress
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "laporan")
    return (
      <Laporan
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  if (page === "pengguna")
    return (
      <Pengguna
        role={userRole}
        username={userName}
        onBack={() => handleNavigate("dashboard")}
      />
    );

  return (
    <Dashboard
      username={userName}
      role={userRole}
      jadwal={jadwal}
      form={form}
      onFormChange={handleChange}
      onFormSubmit={handleSubmit}
      onDelete={handleDelete}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}

export default App;