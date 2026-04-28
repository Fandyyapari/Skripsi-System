import { useEffect, useState } from "react";

const statusLabel = (status) => {
  if (status === "pending") return "Menunggu";
  if (status === "active") return "Aktif";
  if (status === "review") return "Revisi";
  if (status === "done") return "Selesai";
  return "-";
};

function Bimbingan({ role, username, onBack }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/bimbingan")
      .then((res) => res.json())
      .then((data) => {
        setActivityLogs(Array.isArray(data) ? data : Array.isArray(data.logs) ? data.logs : []);
      })
      .catch(() => {
        setActivityLogs([]);
      });
  }, []);

  const isMhs = role === "mahasiswa";

  const filteredLogs = activityLogs.filter((item) => {
    const matchesSearch = item[1]?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item[4] === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const handleSaveSession = () => {
    setShowModal(false);
    showToast("Jadwal bimbingan berhasil dibuat!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Bimbingan — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Sesi Bimbingan</h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              {isMhs
                ? "Pantau sesi bimbingan Anda dan lihat log aktivitas terbaru."
                : "Kelola jadwal bimbingan dan tinjau aktivitas bimbingan mahasiswa."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            {!isMhs && (
              <button onClick={() => setShowModal(true)} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
                ＋ Jadwal Bimbingan
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>📊 Statistik Bimbingan</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
              {[
                [activityLogs.length, "Total Sesi", "#0f172a"],
                [activityLogs.filter((item) => item[4] === "done").length, "Selesai", "#16a34a"],
                [activityLogs.filter((item) => item[4] === "review").length, "Revisi", "#f59e0b"],
                [activityLogs.filter((item) => item[4] === "pending").length, "Menunggu", "#0ea5e9"]
              ].map(([value, label, color]) => (
                <div key={label} style={{ background: "#f8fafc", borderRadius: "16px", padding: "18px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>Log <span style={{ color: "#f0a500" }}>Aktivitas Bimbingan</span></div>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Riwayat Bimbingan</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ minWidth: "180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#0f172a" }}>
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="active">Aktif</option>
                <option value="review">Revisi</option>
                <option value="done">Selesai</option>
              </select>
              <input
                placeholder="🔍 Cari mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: "220px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#0f172a" }}
              />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "980px" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "14px 12px" }}>Tanggal</th>
                  <th style={{ padding: "14px 12px" }}>Mahasiswa</th>
                  <th style={{ padding: "14px 12px" }}>Topik</th>
                  <th style={{ padding: "14px 12px" }}>Catatan Dosen</th>
                  <th style={{ padding: "14px 12px" }}>Status</th>
                  <th style={{ padding: "14px 12px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(([date, name, topic, note, status]) => (
                  <tr key={`${date}-${name}`} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "16px 12px", fontSize: "13px", color: "#475569" }}>{date}</td>
                    <td style={{ padding: "16px 12px", fontWeight: 600 }}>{name}</td>
                    <td style={{ padding: "16px 12px" }}>{topic}</td>
                    <td style={{ padding: "16px 12px", fontSize: "13px", color: "#64748b", maxWidth: "260px" }}>{note}</td>
                    <td style={{ padding: "16px 12px" }}><span style={{ padding: "6px 12px", borderRadius: "999px", background: status === "done" ? "rgba(22,163,74,0.15)" : status === "active" ? "rgba(240,165,0,0.15)" : status === "review" ? "rgba(59,130,246,0.15)" : "rgba(243,244,246,1)", color: status === "done" ? "#16a34a" : status === "active" ? "#f59e0b" : status === "review" ? "#2563eb" : "#0f172a" }}>{statusLabel(status)}</span></td>
                    <td style={{ padding: "16px 12px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {status !== "done" && (
                          <button onClick={() => showToast("Status berhasil diperbarui") } style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#16a34a", color: "#fff", cursor: "pointer" }}>✓ Setuju</button>
                        )}
                        <button onClick={() => showToast("Catatan berhasil dikirim")} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#94a3b8", color: "#fff", cursor: "pointer" }}>💬</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "rgba(15,23,42,0.92)", color: "#fff", padding: "16px 20px", borderRadius: "18px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", zIndex: 20 }}>
          {toast}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,0.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ width: "100%", maxWidth: "620px", background: "#fff", color: "#0f172a", borderRadius: "24px", padding: "28px", position: "relative" }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "26px" }}>💬 Jadwalkan Bimbingan</h2>
              <p style={{ margin: "10px 0 0", color: "#475569" }}>Buat sesi bimbingan baru dengan mahasiswa.</p>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Mahasiswa
                <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                  {activityLogs.map(([_, name]) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Topik Bimbingan
                <input type="text" placeholder="Topik yang akan dibahas..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  Tanggal
                  <input type="date" value="2026-05-01" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
                </label>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  Waktu
                  <input type="time" value="10:00" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
                </label>
              </div>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Catatan
                <textarea placeholder="Catatan tambahan..." rows="4" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Batal</button>
              <button onClick={handleSaveSession} style={{ padding: "12px 18px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bimbingan;
