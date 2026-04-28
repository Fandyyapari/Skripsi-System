import { useEffect, useMemo, useState } from "react";

function Pengguna({ role, username, onBack }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/pengguna")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((user) =>
      (user.nama || "").toLowerCase().includes(q) ||
      (user.nim || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q)
    );
  }, [search, users]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Pengguna — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Kelola <span style={{ color: "#f0a500" }}>Pengguna</span></h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              Tambah, edit, dan pantau akun pengguna sistem skripsi.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            <button onClick={() => setShowModal(true)} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
              ＋ Tambah Pengguna
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>Daftar Pengguna</div>
            <input
              placeholder="🔍 Cari pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: "220px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Nama</th>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>NIM / ID</th>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Email</th>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Role</th>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Status</th>
                <th style={{ textAlign: "left", padding: "16px", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.nim} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>
                      {user.nama[0]}
                    </div>
                    <div style={{ fontWeight: 600 }}>{user.nama}</div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "12px", color: "#cbd5e1" }}>{user.nim}</td>
                  <td style={{ padding: "16px", fontSize: "12px", color: "#cbd5e1" }}>{user.email}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "999px", background: "rgba(96,165,250,0.16)", color: "#0ea5e9", fontWeight: 700, fontSize: "12px" }}>{user.role}</span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "999px", background: "rgba(52,211,153,0.16)", color: "#22c55e", fontWeight: 700, fontSize: "12px" }}>Aktif</span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => showToast("✏️ Edit pengguna dibuka")} style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "#fff", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => showToast("🗑 Pengguna dihapus")} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "rgba(15,23,42,0.92)", color: "#fff", padding: "16px 20px", borderRadius: "18px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", zIndex: 20 }}>
          {toast}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,0.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ width: "100%", maxWidth: "600px", background: "#fff", color: "#0f172a", borderRadius: "24px", padding: "28px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>👤 Tambah Pengguna</div>
              <div style={{ marginTop: "8px", color: "#475569" }}>Buat akun pengguna baru pada sistem.</div>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Nama Lengkap
                <input placeholder="Nama lengkap..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  NIM / NIP / NIDN
                  <input placeholder="ID pengguna..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
                </label>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  Role
                  <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                    <option>Mahasiswa</option>
                    <option>Dosen</option>
                    <option>Admin TU</option>
                    <option>Kaprodi</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Email
                <input type="email" placeholder="email@unesa.ac.id" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Password Awal
                <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Batal</button>
              <button onClick={() => { setShowModal(false); showToast("✅ Pengguna berhasil ditambahkan!"); }} style={{ padding: "12px 18px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Buat Akun</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pengguna;
