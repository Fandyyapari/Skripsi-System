import { useEffect, useState } from "react";

const statusLabel = (status) => {
  if (status === "review") return "Dalam Review";
  if (status === "done") return "Selesai";
  if (status === "active") return "Aktif";
  if (status === "pending") return "Menunggu";
  return "-";
};

function Dokumen({ role, username, onBack }) {
  const [dokumenData, setDokumenData] = useState([]);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/dokumen")
      .then((res) => res.json())
      .then((data) => setDokumenData(Array.isArray(data) ? data : []))
      .catch(() => setDokumenData([]));
  }, []);

  const filteredDocs = dokumenData.filter(([icon, judul, nama, file, size, tgl, status]) => {
    const lowerSearch = search.toLowerCase();
    return (
      judul?.toLowerCase().includes(lowerSearch) ||
      nama?.toLowerCase().includes(lowerSearch) ||
      file?.toLowerCase().includes(lowerSearch)
    ) && (!filterStatus || status === filterStatus);
  });

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleUploadClick = () => {
    setShowModal(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Dokumen — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Manajemen <span style={{ color: "#f0a500" }}>Dokumen</span></h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              Kelola upload dokumen skripsi, tinjau status revisi, dan unduh berkas penting.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            <button onClick={handleUploadClick} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
              ⬆ Upload Dokumen
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>📁 Total Dokumen</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{dokumenData.length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>✅ Dalam Review</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{dokumenData.filter(([, , , , , , status]) => status === "review").length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>📬 Menunggu</div>
            <div style={{ fontSize: "36px", fontWeight: 800 }}>{dokumenData.filter(([, , , , , , status]) => status === "pending").length}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>Daftar Dokumen</div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
            <input
              placeholder="🔍 Cari dokumen, mahasiswa, atau file..."
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
              <option value="review">Dalam Review</option>
              <option value="done">Selesai</option>
              <option value="active">Aktif</option>
              <option value="pending">Menunggu</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {filteredDocs.map(([icon, judul, nama, file, size, tgl, status]) => (
            <div key={`${judul}-${file}`} style={{ background: "#fff", borderRadius: "20px", padding: "20px", display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{icon} {judul}</div>
                    <div style={{ marginTop: "8px", color: "#475569", fontSize: "14px" }}>{nama}</div>
                  </div>
                  <span style={{ padding: "8px 14px", borderRadius: "999px", background: status === "done" ? "rgba(22,163,74,0.12)" : status === "review" ? "rgba(251,191,36,0.12)" : status === "active" ? "rgba(59,130,246,0.12)" : "rgba(239,68,68,0.12)", color: status === "done" ? "#16a34a" : status === "review" ? "#f59e0b" : status === "active" ? "#2563eb" : "#ef4444", fontWeight: 700, fontSize: "12px" }}>{statusLabel(status)}</span>
                </div>
                <div style={{ background: "#f8f5eb", borderRadius: "12px", padding: "12px", marginTop: "14px", fontSize: "13px", color: "#334155" }}>
                  <div style={{ fontWeight: 600 }}>📎 {file}</div>
                  <div style={{ marginTop: "6px", color: "#64748b" }}>Ukuran: {size} • {tgl}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: "8px" }}>
                <button onClick={() => showToast("⬇ Dokumen sedang diunduh...")} style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid rgba(15,23,42,0.08)", background: "transparent", color: "#0f172a", cursor: "pointer" }}>⬇ Unduh</button>
                {role !== "mahasiswa" && (
                  <button onClick={() => showToast("👁 Membuka dokumen...")} style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>👁 Lihat</button>
                )}
                {role === "mahasiswa" && (
                  <button onClick={() => showToast("⬆ Upload versi baru")} style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid #0f172a", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Perbarui</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "24px", padding: "20px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(15,23,42,0.06)", color: "#0f172a" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Upload Dokumen Baru</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>Format yang diterima: PDF, DOCX, XLSX (Maks. 10 MB)</div>
          <div onClick={handleUploadClick} style={{ cursor: "pointer", borderRadius: "20px", padding: "28px", textAlign: "center", background: "rgba(240,165,0,0.08)", border: "1px dashed rgba(240,165,0,0.3)" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📂</div>
            <p style={{ margin: 0, fontWeight: 700 }}>Tarik & lepas file di sini, atau <strong>klik untuk browse</strong></p>
            <p style={{ marginTop: "8px", fontSize: "11px", color: "#64748b" }}>PDF, DOCX, XLSX • Maks 10 MB</p>
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
          <div style={{ width: "100%", maxWidth: "600px", background: "#fff", color: "#0f172a", borderRadius: "24px", padding: "28px", position: "relative" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>📂 Upload Dokumen</div>
              <div style={{ marginTop: "8px", color: "#64748b" }}>Upload dokumen skripsi ke sistem.</div>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Jenis Dokumen
                <select style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                  <option>Proposal</option>
                  <option>Bab 1</option>
                  <option>Bab 2</option>
                  <option>Bab 3</option>
                  <option>Bab 4</option>
                  <option>Bab 5</option>
                  <option>Draft Lengkap</option>
                  <option>Lembar Persetujuan</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                Deskripsi
                <input placeholder="Keterangan versi / isi dokumen..." style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }} />
              </label>
              <div onClick={() => showToast("📁 Pilih file...")} style={{ cursor: "pointer", borderRadius: "20px", padding: "24px", textAlign: "center", background: "rgba(240,165,0,0.08)", border: "1px dashed rgba(240,165,0,0.3)" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>📤</div>
                <p style={{ margin: 0, fontWeight: 700 }}>Klik atau drag dokumen ke sini</p>
                <p style={{ marginTop: "8px", fontSize: "11px", color: "#64748b" }}>PDF, DOCX, XLSX • Maks 10MB</p>
              </div>
            </div>
            <div style={{ background: "rgba(240,165,0,0.08)", border: "1px solid rgba(240,165,0,0.2)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#475569", margin: "18px 0" }}>
              ✓ Sistem akan otomatis mendeteksi bentrok dokumen dan versi.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Batal</button>
              <button onClick={() => { setShowModal(false); showToast("⬆ Dokumen berhasil diunggah!"); }} style={{ padding: "12px 18px", borderRadius: "12px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dokumen;
