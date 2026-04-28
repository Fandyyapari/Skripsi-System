import { useEffect, useState } from "react";
import Login from "./Login";
<<<<<<< HEAD
import Dashboard from "./Dashboard";
import Pengajuan from "./Pengajuan";
import Bimbingan from "./Bimbingan";
import Jadwal from "./Jadwal";
import Dokumen from "./Dokumen";
import Progress from "./Progress";
import Laporan from "./Laporan";
import Pengguna from "./Pengguna";
=======
>>>>>>> 4e82f74caf3bcbd62c3eb2860e7db76391d2b5d4

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
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

<<<<<<< HEAD
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
=======
  const fetchData = () => {
    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
>>>>>>> 4e82f74caf3bcbd62c3eb2860e7db76391d2b5d4
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 VALIDASI
    if (form.jam_mulai >= form.jam_selesai) {
      alert("Jam selesai harus lebih besar dari jam mulai!");
      return;
    }

    const url = editId
      ? `http://localhost:3000/jadwal/${editId}`
      : "http://localhost:3000/jadwal";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchData();
        resetForm();
      });
  };

  const handleEdit = (j) => {
    setForm(j);
    setEditId(j.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus jadwal ini?")) {
      fetch(`http://localhost:3000/jadwal/${id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          fetchData();
        });
    }
  };

  if (!user) { return <Login setUser={setUser} />; }

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
<<<<<<< HEAD
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
=======
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "30px"
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>📅 Jadwal Sidang</h1>
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
            }}
            style={{
              background: "#333",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              name="mahasiswa"
              placeholder="Nama Mahasiswa"
              value={form.mahasiswa}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="time"
              name="jam_mulai"
              value={form.jam_mulai}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="time"
              name="jam_selesai"
              value={form.jam_selesai}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <button style={btnPrimary}>
              {editId ? "Update" : "Tambah"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={btnSecondary}
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <hr />

        {/* LIST */}
        {jadwal.length === 0 ? (
          <p style={{ textAlign: "center" }}>Belum ada jadwal</p>
        ) : (
          jadwal.map(j => (
            <div key={j.id} style={cardStyle}>
              <div>
                <strong>{j.mahasiswa}</strong>
                <p style={{ margin: 0 }}>
                  {j.tanggal} | {j.jam_mulai} - {j.jam_selesai}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleEdit(j)}
                  style={btnEdit}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(j.id)}
                  style={btnDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
>>>>>>> 4e82f74caf3bcbd62c3eb2860e7db76391d2b5d4
  );
}

// 🎨 STYLE
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: "1"
};

const btnPrimary = {
  padding: "10px 15px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "10px 15px",
  background: "#aaa",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnEdit = {
  marginRight: "10px",
  background: "#2196F3",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnDelete = {
  background: "#f44336",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginTop: "10px",
  border: "1px solid #eee",
  borderRadius: "8px",
  background: "#fafafa"
};

export default App;