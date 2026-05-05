import { useEffect, useMemo, useState } from "react";

function Pengguna({ onBack }) {
  const API = "http://localhost:5000";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    role: "mahasiswa",
    identitas: ""
  });

  // ======================
  // GET USERS
  // ======================
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

  // ======================
  // SEARCH
  // ======================
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter((user) =>
      (user.nama || "").toLowerCase().includes(q) ||
      (user.username || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q) ||
      (user.identitas || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  // ======================
  // TOAST
  // ======================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ======================
  // EDIT USER
  // ======================
  const handleEdit = (user) => {
    setForm({
      nama: user.nama,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      identitas: user.identitas
    });

    setEditId(user.id);
    setShowModal(true);
  };

  // ======================
  // DELETE USER
  // ======================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin hapus user ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/auth/users/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      showToast(data.message);
      getUsers();
    } catch (error) {
      showToast("Gagal hapus user");
    }
  };

  // ======================
  // SUBMIT ADD / EDIT
  // ======================
  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.username ||
      !form.email ||
      !form.role ||
      !form.identitas
    ) {
      showToast("Lengkapi semua data");
      return;
    }

    if (!editId && !form.password) {
      showToast("Password wajib diisi");
      return;
    }

    try {
      const url = editId
        ? `${API}/auth/users/${editId}`
        : `${API}/auth/register`;

      const method = editId ? "PUT" : "POST";

      const body = editId
        ? {
            nama: form.nama,
            email: form.email,
            role: form.role,
            identitas: form.identitas
          }
        : form;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
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

        setEditId(null);
        setShowModal(false);
        getUsers();
      }
    } catch (error) {
      showToast("Gagal simpan data");
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

            <h1 style={{ margin: "10px 0 0", fontSize: "36px" }}>
              Kelola <span style={{ color: "#f0a500" }}>Pengguna</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onBack} style={btnOutline}>
              ← Kembali
            </button>

            <button
              onClick={() => {
                setEditId(null);
                setForm({
                  nama: "",
                  username: "",
                  email: "",
                  password: "",
                  role: "mahasiswa",
                  identitas: ""
                });
                setShowModal(true);
              }}
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
            style={input}
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
                <th style={th}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <td style={td}>{user.nama}</td>
                  <td style={td}>{user.username}</td>
                  <td style={td}>{user.email}</td>
                  <td style={td}>{user.role}</td>
                  <td style={td}>{user.identitas}</td>

                  <td style={td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={btnGoldSmall}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        style={btnRed}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
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
            <h2>{editId ? "Edit Pengguna" : "Tambah Pengguna"}</h2>

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
                disabled={editId}
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                style={input}
              />

              {!editId && (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={input}
                />
              )}

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
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
                style={btnOutlineDark}
              >
                Batal
              </button>

              <button onClick={handleSubmit} style={btnDark}>
                {editId ? "Update" : "Simpan"}
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

const btnGoldSmall = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#f0a500",
  color: "#000",
  cursor: "pointer"
};

const btnRed = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
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