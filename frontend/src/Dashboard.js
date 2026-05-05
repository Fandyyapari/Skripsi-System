import { useEffect, useState } from "react";

function Dashboard({
  username,
  role,
  jadwal,
  form,
  onFormChange,
  onFormSubmit,
  onDelete,
  onLogout,
  onNavigate
}) {
  const roleLabel = {
    mahasiswa: "Mahasiswa",
    dosen: "Dosen Pembimbing",
    admin: "Admin Prodi / TU",
    kaprodi: "Kepala Program Studi"
  };

  // ================= MENU ROLE =================

  const menuRole = {
    mahasiswa: [
      "pengajuan",
      "bimbingan",
      "progress",
      "jadwal",
      "dokumen",
      "sidang"
    ],

    dosen: [
      "bimbingan",
      "progress",
      "jadwal",
      "dokumen",
      "sidang"
    ],

    admin: [
      "pengguna",
      "pengajuan",
      "progress",
      "dokumen",
      "jadwal",
      "sidang",
      "laporan"
    ],

    kaprodi: [
      "progress",
      "dokumen",
      "laporan",
      "sidang"
    ]
  };

  const menuIcon = {
    pengguna: "👤",
    pengajuan: "📄",
    bimbingan: "💬",
    progress: "📈",
    jadwal: "📅",
    dokumen: "📁",
    sidang: "🎓",
    laporan: "📊"
  };

  const menus = menuRole[role] || [];

  // ================= DASHBOARD DATA =================

  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch(() => setDashboardData({}));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff"
      }}
    >
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>

        {/* ================= HEADER ================= */}

        <div style={header}>
          <div>
            <p style={subHeader}>
              Dashboard Sistem Skripsi UNESA
            </p>

            <h1 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              Halo,{" "}
              <span style={{ color: "#f0a500" }}>
                {username || roleLabel[role]}
              </span>
            </h1>

            <p style={subHeader}>
              Anda login sebagai {roleLabel[role]}
            </p>
          </div>

          <button onClick={onLogout} style={btnLogout}>
            Logout
          </button>
        </div>

        {/* ================= MENU ================= */}

        <div style={menuGrid}>
          {menus.map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              style={menuBtn}
            >
              <div style={{ fontSize: "28px" }}>
                {menuIcon[item]}
              </div>

              <div style={{ marginTop: "10px" }}>
                {item}
              </div>
            </button>
          ))}
        </div>

        {/* ================= DASHBOARD CARD ================= */}

        <div style={cardGrid}>

          <Card
            title="📅 Total Jadwal"
            value={dashboardData.totalJadwal || 0}
          />

          <Card
            title="📈 Total Progress"
            value={dashboardData.totalProgress || 0}
          />

          <Card
            title="🎓 Total Sidang"
            value={dashboardData.totalSidang || 0}
          />

          <Card
            title="📊 Rata-rata Progress"
            value={`${Math.round(dashboardData.avgProgress || 0)}%`}
          />

        </div>

        {/* ================= STATUS PROGRESS ================= */}

        {role === "admin" && (
          <div style={cardGrid}>
            <Card title="🆕 Baru" value={dashboardData.baru || 0} />

            <Card title="📘 Awal" value={dashboardData.awal || 0} />

            <Card title="🚀 Berjalan" value={dashboardData.berjalan || 0} />

            <Card title="✅ Selesai" value={dashboardData.selesai || 0} />
          </div>
        )}

        {/* ================= ADMIN ONLY ================= */}

        {role === "admin" && (
          <>
            <div style={grid2}>

              {/* JADWAL TERBARU */}

              <div style={box}>
                <h3 style={judul}>
                  📅 Jadwal Terbaru
                </h3>

                {jadwal.length === 0 ? (
                  <p style={sub}>
                    Belum ada jadwal.
                  </p>
                ) : (
                  jadwal.slice(0, 5).map((item) => (
                    <div key={item.id} style={itemBox}>

                      <b>{item.mahasiswa}</b>

                      <p style={textMuted}>
                        {item.tanggal} | {item.jam_mulai} - {item.jam_selesai}
                      </p>

                    </div>
                  ))
                )}
              </div>

              {/* FORM TAMBAH JADWAL */}

              <div style={box}>
                <h3 style={judul}>
                  ➕ Tambah Jadwal
                </h3>

                <form onSubmit={onFormSubmit} style={formStyle}>

                  <input
                    name="mahasiswa"
                    value={form.mahasiswa}
                    onChange={onFormChange}
                    placeholder="Nama Mahasiswa"
                    style={input}
                    required
                  />

                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={onFormChange}
                    style={input}
                    required
                  />

                  <input
                    type="time"
                    name="jam_mulai"
                    value={form.jam_mulai}
                    onChange={onFormChange}
                    style={input}
                    required
                  />

                  <input
                    type="time"
                    name="jam_selesai"
                    value={form.jam_selesai}
                    onChange={onFormChange}
                    style={input}
                    required
                  />

                  <button type="submit" style={btnDark}>
                    Simpan Jadwal
                  </button>

                </form>
              </div>
            </div>

            {/* ================= SEMUA JADWAL ================= */}

            <div style={box}>
              <h3 style={judul}>
                📋 Semua Jadwal
              </h3>

              {jadwal.length === 0 ? (
                <p style={sub}>
                  Tidak ada data.
                </p>
              ) : (
                jadwal.map((item) => (
                  <div key={item.id} style={itemRow}>

                    <div>
                      <b>{item.mahasiswa}</b>

                      <p style={textMuted}>
                        {item.tanggal} | {item.jam_mulai} - {item.jam_selesai}
                      </p>
                    </div>

                    <button
                      onClick={() => onDelete(item.id)}
                      style={btnDelete}
                    >
                      Hapus
                    </button>

                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <p style={{ margin: 0, color: "#64748b" }}>
        {title}
      </p>

      <h2 style={{ margin: "12px 0 0", fontSize: "32px" }}>
        {value}
      </h2>
    </div>
  );
}

/* ================= STYLE ================= */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "28px"
};

const subHeader = {
  margin: 0,
  color: "rgba(255,255,255,0.6)",
  fontSize: "14px"
};

const btnLogout = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const menuGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "14px",
  marginBottom: "28px"
};

const menuBtn = {
  padding: "22px",
  borderRadius: "20px",
  border: "none",
  background: "#f0a500",
  color: "#000",
  fontWeight: "700",
  cursor: "pointer",
  textTransform: "capitalize",
  fontSize: "16px"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "28px"
};

const card = {
  background: "#fff",
  color: "#0f172a",
  borderRadius: "22px",
  padding: "24px"
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "24px",
  marginBottom: "28px"
};

const box = {
  background: "#fff",
  color: "#0f172a",
  borderRadius: "24px",
  padding: "24px"
};

const judul = {
  marginTop: 0
};

const sub = {
  color: "#64748b"
};

const textMuted = {
  margin: "6px 0 0",
  color: "#64748b"
};

const itemBox = {
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px",
  marginBottom: "12px"
};

const itemRow = {
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const formStyle = {
  display: "grid",
  gap: "14px",
  marginTop: "16px"
};

const btnDark = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

const btnDelete = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

export default Dashboard;