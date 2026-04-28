import { useEffect, useMemo, useState } from "react";

function Pengguna({ onBack }) {
  const API = "http://localhost:5000";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    role: "mahasiswa",
    identitas: ""
  });

  // =========================
  // GET USERS
  // =========================
  const getUsers = async () => {
    try {
      const res = await fetch(`${API}/auth/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter((user) =>
      (user.nama || "").toLowerCase().includes(q) ||
      (user.username || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q) ||
      (user.identitas || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  // =========================
  // TOAST
  // =========================
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2400);
  };

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // TAMBAH USER
  // =========================
  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.identitas
    ) {
      showToast("Lengkapi semua data");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      showToast(data.message);

      if (res.ok) {
        setForm({
          nama: "",
          username: "",
          email: "",
          password: "",
          role: "mahasiswa",
          identitas: ""
        });

        setShowModal(false);
        getUsers();
      }
    } catch (error) {
      showToast("Gagal tambah user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        color: "#fff",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "28px"
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px"
              }}
            >
              Pengguna — SKRIPSI UNESA
            </p>

            <h1
              style={{
                margin: "10px 0 0",
                fontSize: "36px"
              }}
            >
              Kelola <span style={{ color: "#f0a500" }}>Pengguna</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onBack}
              style={btnOutline}
            >
              ← Kembali
            </button>

            <button
              onClick={() => setShowModal(true)}
              style={btnGold}
            >
              ＋ Tambah Pengguna
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "24px",
            color: "#000",
            marginBottom: "24px"
          }}
        >
          <input
            placeholder="🔍 Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd"
            }}
          />
        </div>

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.08)" }}>
                <th style={th}>Nama</th>
                <th style={th}>Username</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>ID</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <td style={td}>{user.nama}</td>
                  <td style={td}>{user.username}</td>
                  <td style={td}>{user.email}</td>
                  <td style={td}>{user.role}</td>
                  <td style={td}>{user.identitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#111827",
            padding: "14px 18px",
            borderRadius: "12px"
          }}
        >
          {toast}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "#fff",
              color: "#000",
              borderRadius: "24px",
              padding: "28px"
            }}
          >
            <h2>Tambah Pengguna</h2>

            <div style={{ display: "grid", gap: "14px" }}>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama lengkap"
                style={input}
              />

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                style={input}
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                style={input}
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                style={input}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={input}
              >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="admin">Admin</option>
                <option value="kaprodi">Kaprodi</option>
              </select>

              <input
                name="identitas"
                value={form.identitas}
                onChange={handleChange}
                placeholder="NIM / NIP / ID"
                style={input}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px"
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={btnOutlineDark}
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                style={btnDark}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "16px",
  color: "#cbd5e1",
  fontSize: "13px"
};

const td = {
  padding: "16px"
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd"
};

const btnGold = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#f0a500",
  color: "#000",
  cursor: "pointer"
};

const btnOutline = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "#fff",
  cursor: "pointer"
};

const btnOutlineDark = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "transparent",
  cursor: "pointer"
};

const btnDark = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#0a1628",
  color: "#fff",
  cursor: "pointer"
};

export default Pengguna;