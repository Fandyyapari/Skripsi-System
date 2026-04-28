import { useEffect, useMemo, useState } from "react";

const statusLabel = (status) => {
  if (status === "selesai") return "Selesai";
  if (status === "berjalan") return "Berjalan";
  if (status === "awal") return "Awal";
  if (status === "baru") return "Baru";
  return "-";
};

const statusColor = (status) => {
  if (status === "selesai") return "#22c55e";
  if (status === "berjalan") return "#f59e0b";
  if (status === "awal") return "#38bdf8";
  if (status === "baru") return "#ef4444";
  return "#64748b";
};

function Laporan({ role, username, onBack }) {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/laporan")
      .then((res) => res.json())
      .then((data) => setMahasiswaData(Array.isArray(data) ? data : []))
      .catch(() => setMahasiswaData([]));
  }, []);

  const avg = useMemo(() => {
    if (!mahasiswaData.length) return 0;
    return Math.round(mahasiswaData.reduce((sum, m) => sum + (m.progress || 0), 0) / mahasiswaData.length);
  }, [mahasiswaData]);

  const filteredMahasiswa = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return mahasiswaData.filter((m) => {
      const matchesSearch = (m.nama || "").toLowerCase().includes(lowerSearch) || (m.nim || "").includes(lowerSearch) || (m.judul || "").toLowerCase().includes(lowerSearch);
      const matchesStatus = !filterStatus || m.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, mahasiswaData]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const buckets = [
    { label: "Selesai (100%)", key: "selesai", color: "#22c55e" },
    { label: "Berjalan (>50%)", key: "berjalan", color: "#f59e0b" },
    { label: "Awal (<50%)", key: "awal", color: "#38bdf8" },
    { label: "Baru (<20%)", key: "baru", color: "#ef4444" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Laporan — SKRIPSI UNESA</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "36px", lineHeight: 1.1 }}>Monitor <span style={{ color: "#f0a500" }}>Progress</span></h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.6)", maxWidth: "720px" }}>
              Buat laporan kemajuan skripsi dengan daftar progress mahasiswa dan status terkini.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#fff", cursor: "pointer" }}>
              ← Kembali
            </button>
            <button onClick={() => showToast("📊 Laporan progress diekspor")} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#f0a500", color: "#0a1628", cursor: "pointer" }}>
              ⬇ Export Laporan
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Distribusi Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {buckets.map((bucket) => {
                const count = mahasiswaData.filter((m) => m.status === bucket.key).length;
                const total = mahasiswaData.length || 1;
                return (
                  <div key={bucket.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500 }}>{bucket.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: bucket.color }}>{count} mhs</span>
                    </div>
                    <div style={{ background: "#e2e8f0", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${(count / total) * 100}%`, background: bucket.color, height: "100%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", color: "#0f172a" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>📈 Rata-rata Progress</div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "56px", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{avg}%</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Rata-rata progress seluruh mahasiswa</div>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: "999px", height: "12px", overflow: "hidden" }}>
              <div style={{ width: `${avg}%`, background: "#f59e0b", height: "100%" }} />
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Detail Progress Per Mahasiswa</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%", maxWidth: "520px" }}>
              <input
                placeholder="🔍 Cari mahasiswa atau judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: "180px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a" }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ minWidth: "160px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a" }}
              >
                <option value="">Semua Status</option>
                <option value="selesai">Selesai</option>
                <option value="berjalan">Berjalan</option>
                <option value="awal">Awal</option>
                <option value="baru">Baru</option>
              </select>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Mahasiswa</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Judul</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Pembimbing</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Progress</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Status</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMahasiswa.map((m) => (
                  <tr key={m.nim} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.nama}</div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{m.nim}</div>
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top", fontSize: "12px", color: "#475569", maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.judul}</td>
                    <td style={{ padding: "16px", verticalAlign: "top", fontSize: "12px", color: "#475569" }}>{m.dospem}</td>
                    <td style={{ padding: "16px", verticalAlign: "top", minWidth: "180px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                          <div style={{ width: `${m.progress}%`, background: m.progress === 100 ? "#22c55e" : m.progress > 60 ? "#f59e0b" : "#38bdf8", height: "100%" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, minWidth: "36px", color: "#0f172a" }}>{m.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "999px", background: statusColor(m.status), color: "#0f172a", fontWeight: 700, fontSize: "12px" }}>{statusLabel(m.status)}</span>
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <button onClick={() => showToast("👁 Membuka detail progress")} style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "transparent", color: "#0f172a", cursor: "pointer" }}>Detail</button>
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
    </div>
  );
}

export default Laporan;
