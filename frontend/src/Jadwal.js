import { useMemo, useState } from "react";

const statusLabel = (status) => {
  if (status === "active") return "Terkonfirmasi";
  if (status === "pending") return "Menunggu";
  return "-";
};

function Jadwal({ role, username, onBack, jadwal = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const isAdmin = role === "admin";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const formatDay = (value) => {
    const parts = value?.split("-") || [];
    return parts[2] || "--";
  };

  const formatMonth = (value) => {
    const parts = value?.split("-") || [];
    const monthIndex = Number(parts[1]) - 1;
    return monthNames[monthIndex] || "--";
  };

  const filteredSchedule = useMemo(() => {
    return jadwal.filter((item) => {
      const studentName = (item.mahasiswa || item.nama || "").toLowerCase();
      const matchSearch = studentName.includes(search.toLowerCase());
      const matchStatus = !filterStatus || (item.status || "pending") === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus, jadwal]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleSaveSchedule = () => {
    setShowModal(false);
    showToast("Jadwal sidang berhasil dibuat! Notifikasi terkirim.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Jadwal Sidang — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Jadwal Sidang</h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              {isAdmin
                ? "Kelola jadwal sidang mahasiswa dan tinjau status setiap sesi." 
                : "Lihat jadwal sidang dan status konfirmasi untuk sidang Anda."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            {isAdmin && (
              <button onClick={() => setShowModal(true)} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
                ＋ Buat Jadwal Sidang
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>📅 Total Jadwal Bulan Ini</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{jadwal.length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>✅ Terkonfirmasi</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{jadwal.filter((j) => (j.status || "pending") === "active").length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>⚠️ Menunggu Konfirmasi</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{jadwal.filter((j) => (j.status || "pending") === "pending").length}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>Jadwal <span style={{ color: "#f0a500" }}>April — Mei 2026</span></div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
            <input
              placeholder="🔍 Cari mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: "180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.08)", color: "#fff" }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: "180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.08)", color: "#fff" }}
            >
              <option value="">Semua Status</option>
              <option value="active">Terkonfirmasi</option>
              <option value="pending">Menunggu</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {filteredSchedule.map((j) => (
            <div key={`${j.mahasiswa || j.nama}-${j.tanggal}-${j.waktu || j.jam_mulai}`} style={{ background: "#fff", borderRadius: "20px", padding: "20px", display: "grid", gridTemplateColumns: "120px 1px 1fr 180px", gap: "16px", alignItems: "center" }}>
              <div style={{ background: "rgba(240,165,0,0.08)", borderRadius: "18px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{formatDay(j.tanggal)}</div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{formatMonth(j.tanggal)}</div>
              </div>
              <div style={{ width: "1px", height: "100%", background: "#e2e8f0" }} />
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{j.mahasiswa || j.nama}</div>
                <div style={{ marginTop: "8px", color: "#475569", fontSize: "14px" }}>🕒 {j.waktu || j.jam_mulai} • 📍 {j.ruang || "TBD"} • 👨‍⚖️ {j.penguji || "Belum ditentukan"}</div>
                <div style={{ marginTop: "8px" }}><span style={{ fontSize: "12px", background: "rgba(240,165,0,0.1)", color: "#f0a500", padding: "4px 10px", borderRadius: "999px", fontWeight: 700 }}>{j.jenis || "Sidang Proposal"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <span style={{ padding: "8px 12px", borderRadius: "999px", background: (j.status || "pending") === "active" ? "rgba(22,163,74,0.15)" : "rgba(248,113,113,0.12)", color: (j.status || "pending") === "active" ? "#16a34a" : "#ef4444", fontWeight: 700, fontSize: "12px" }}>{statusLabel(j.status || "pending")}</span>
                {isAdmin && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => showToast(`✏️ Edit jadwal: ${j.mahasiswa || j.nama}`)} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#e2e8f0", color: "#0f172a", cursor: "pointer" }}>✏️</button>
                    <button onClick={() => showToast(`🗑 Jadwal dihapus: ${j.mahasiswa || j.nama}`)} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" }}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "24px", padding: "16px 20px", background: "rgba(240,165,0,0.06)", border: "1px solid rgba(240,165,0,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>ℹ️</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Sistem secara otomatis mendeteksi konflik jadwal dosen. Notifikasi dikirim maksimal 1 menit setelah perubahan status.</span>
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
              <h2 style={{ margin: 0, fontSize: "26px" }}>📅 Buat Jadwal Sidang</h2>
              <p style={{ margin: "10px 0 0", color: "#475569" }}>Isi detail jadwal sidang mahasiswa.</p>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Mahasiswa
                <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                  {jadwal.map((item) => (
                    <option key={item.mahasiswa || item.nama}>{item.mahasiswa || item.nama}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Jenis Sidang
                <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                  <option>Sidang Proposal</option>
                  <option>Sidang Akhir</option>
                </select>
              </label>
              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  Tanggal
                  <input type="date" defaultValue="2026-05-10" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
                </label>
                <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                  Waktu
                  <input type="time" defaultValue="09:00" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
                </label>
              </div>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Ruang
                <input placeholder="Contoh: Lab A-301" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Dosen Penguji
                <input placeholder="Nama dosen penguji..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
            </div>
            <div style={{ background: "rgba(240,165,0,0.08)", border: "1px solid rgba(240,165,0,0.2)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#475569", marginBottom: "16px" }}>
              ✓ Sistem akan otomatis mendeteksi bentrok jadwal sebelum menyimpan
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Batal</button>
              <button onClick={handleSaveSchedule} style={{ padding: "12px 18px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Simpan & Kirim Notifikasi →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jadwal;
