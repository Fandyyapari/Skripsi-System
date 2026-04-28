import { useEffect, useState } from "react";

const statusLabel = (status) => {
  if (status === "pending") return "Menunggu";
  if (status === "active") return "Disetujui";
  if (status === "review") return "Revisi";
  if (status === "done") return "Selesai";
  return "-";
};

function Pengajuan({ role, username, onBack }) {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/pengajuan")
      .then((res) => res.json())
      .then((data) => setPengajuanData(Array.isArray(data) ? data : []))
      .catch(() => setPengajuanData([]));
  }, []);

  const isMhs = role === "mahasiswa";

  const filteredData = pengajuanData.filter((item) => {
    const matchesSearch = item.nama?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleSubmitProposal = () => {
    setShowModal(false);
    openToast("Pengajuan judul berhasil dikirim!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Pengajuan Judul — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Pengajuan Judul Skripsi</h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              {isMhs
                ? "Ajukan judul skripsi dan pantau status pengajuan Anda di sini."
                : "Kelola semua pengajuan judul mahasiswa dan pantau progres setiap proposal."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            {isMhs && (
              <button onClick={() => setShowModal(true)} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
                ＋ Ajukan Judul Baru
              </button>
            )}
          </div>
        </div>

        {isMhs && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>Pengajuan Aktif</div>
                  <div style={{ fontSize: "18px", fontWeight: 700 }}>Deteksi Plagiarisme Berbasis NLP pada Dokumen Akademik</div>
                </div>
                <span style={{ padding: "6px 12px", borderRadius: "999px", background: "rgba(240,165,0,0.16)", color: "#f0a500", fontWeight: 700 }}>Revisi</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>Diajukan: 20 April 2026 • Pembimbing: Belum ditetapkan</div>
              <div style={{ marginTop: "18px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden", height: "12px" }}>
                <div style={{ width: "30%", height: "100%", background: "#f0a500" }} />
              </div>
              <div style={{ marginTop: "8px", color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>30% — Menunggu penetapan pembimbing</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Langkah Pengajuan</div>
              {[
                ["1", "Ajukan judul & upload proposal", "done"],
                ["2", "Verifikasi Admin Prodi", "done"],
                ["3", "Penetapan Dosen Pembimbing", "active"],
                ["4", "Persetujuan Dosen", "pending"],
                ["5", "Sidang Proposal", "pending"]
              ].map(([n, t, s]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: s === "done" ? "#16a34a" : s === "active" ? "#f0a500" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: s === "pending" ? "rgba(255,255,255,0.6)" : "#fff" }}>
                    {s === "done" ? "✓" : n}
                  </div>
                  <span style={{ fontSize: "14px", color: s === "pending" ? "rgba(255,255,255,0.55)" : "#fff" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>
              {isMhs ? "Data Pengajuan Anda" : "Semua Pengajuan"}
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
              {!isMhs && (
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: "0 0 180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                  <option value="">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="active">Disetujui</option>
                  <option value="review">Revisi</option>
                  <option value="done">Selesai</option>
                </select>
              )}
              <input
                placeholder="🔍 Cari mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: "1", minWidth: "180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.08)", color: "#fff" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.08em" }}>
                  <th style={{ textAlign: "left", padding: "14px 12px" }}>NIM</th>
                  <th style={{ textAlign: "left", padding: "14px 12px" }}>Nama</th>
                  <th style={{ textAlign: "left", padding: "14px 12px" }}>Judul Skripsi</th>
                  <th style={{ textAlign: "left", padding: "14px 12px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "14px 12px" }}>Progress</th>
                  {!isMhs && <th style={{ textAlign: "left", padding: "14px 12px" }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.nim} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <td style={{ padding: "16px 12px", fontWeight: 600, color: "#f0a500" }}>{item.nim}</td>
                    <td style={{ padding: "16px 12px" }}>{item.nama}</td>
                    <td style={{ padding: "16px 12px" }}>{item.judul}</td>
                    <td style={{ padding: "16px 12px" }}><span style={{ padding: "6px 12px", borderRadius: "999px", background: item.status === "done" ? "rgba(22,163,74,0.15)" : item.status === "active" ? "rgba(240,165,0,0.15)" : item.status === "review" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.08)", color: item.status === "pending" ? "rgba(255,255,255,0.75)" : item.status === "done" ? "#16a34a" : item.status === "review" ? "#3b82f6" : "#f0a500" }}>{statusLabel(item.status)}</span></td>
                    <td style={{ padding: "16px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "120px", height: "8px", background: "rgba(255,255,255,0.12)", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ width: `${item.progress}%`, height: "100%", background: "#f0a500" }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>{item.progress}%</span>
                      </div>
                    </td>
                    {!isMhs && (
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button onClick={() => openToast(`Pengajuan diterima: ${item.nim}`)} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#16a34a", color: "#fff", cursor: "pointer" }}>✓ Terima</button>
                          <button onClick={() => openToast(`Pengajuan ditolak: ${item.nim}`)} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" }}>✗ Tolak</button>
                          <button onClick={() => openToast(`Lihat detail: ${item.nim}`)} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer" }}>👁 Detail</button>
                        </div>
                      </td>
                    )}
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
              <h2 style={{ margin: 0, fontSize: "26px" }}>📝 Ajukan Judul Skripsi</h2>
              <p style={{ margin: "10px 0 0", color: "#475569" }}>Isi formulir berikut untuk mengajukan judul baru.</p>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Judul Skripsi
                <input type="text" placeholder="Masukkan judul skripsi..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Bidang Penelitian
                <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                  <option>Kecerdasan Buatan</option>
                  <option>Rekayasa Perangkat Lunak</option>
                  <option>Jaringan Komputer</option>
                  <option>Keamanan Siber</option>
                  <option>Human-Computer Interaction</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Latar Belakang Singkat
                <textarea placeholder="Jelaskan latar belakang penelitian..." rows="4" style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Batal</button>
              <button onClick={handleSubmitProposal} style={{ padding: "12px 18px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Kirim Pengajuan →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pengajuan;
