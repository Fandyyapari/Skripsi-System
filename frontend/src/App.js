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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "admin"
  });
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const [page, setPage] = useState("dashboard");
  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  const rolePages = {
    mahasiswa: ["dashboard", "pengajuan", "dokumen", "progress", "jadwal"],
    dosen: ["dashboard", "bimbingan", "dokumen", "progress", "jadwal"],
    admin: ["dashboard", "pengguna", "pengajuan", "dokumen", "jadwal", "progress"],
    kaprodi: ["dashboard", "laporan", "progress", "dokumen"]
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!rolePages[userRole].includes(page)) {
      setPage("dashboard");
    }
  }, [page, userRole]);

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      alert("Isi username dan password terlebih dahulu.");
      return;
    }

    setUserName(loginForm.username);
    setUserRole(loginForm.role);
    setIsLoggedIn(true);
    setLoginForm({ username: "", password: "", role: "admin" });
  };

  const handleQuickLogin = (role) => {
    setUserName(role);
    setUserRole(role);
    setLoginForm({ username: role, password: role, role });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("admin");
    setPage("dashboard");
  };

  const handleNavigate = (target) => {
    setPage(target);
  };

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/jadwal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        resetForm();
        // reload data
        fetch("http://localhost:3000/jadwal")
          .then(res => res.json())
          .then(data => setJadwal(data));
      });
  };

  // DELETE FUNCTION
  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus jadwal ini?")) {
      fetch(`http://localhost:3000/jadwal/${id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          // reload data
          fetch("http://localhost:3000/jadwal")
            .then(res => res.json())
            .then(data => setJadwal(data));
        });
    }
  };

  // reset form setelah submit
  const resetForm = () => {
    setForm({
      mahasiswa: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: ""
    });
  };

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

  if (page === "pengajuan") {
    return <Pengajuan role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

  if (page === "bimbingan") {
    return <Bimbingan role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

  if (page === "jadwal") {
    return <Jadwal role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} jadwal={jadwal} />;
  }

  if (page === "dokumen") {
    return <Dokumen role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

  if (page === "progress") {
    return <Progress role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

  if (page === "laporan") {
    return <Laporan role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

  if (page === "pengguna") {
    return <Pengguna role={userRole} username={userName} onBack={() => handleNavigate("dashboard")} />;
  }

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