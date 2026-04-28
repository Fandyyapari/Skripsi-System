function Dashboard({ username, role, jadwal, form, onFormChange, onFormSubmit, onDelete, onLogout, onNavigate }) {
  const roleLabel = {
    mahasiswa: "Mahasiswa",
    dosen: "Dosen Pembimbing",
    admin: "Admin Prodi / TU",
    kaprodi: "Kepala Program Studi"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2ff", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Dashboard Skripsi UNESA</p>
            <h1 style={{ margin: "8px 0", fontSize: "32px", color: "#0f172a" }}>
              Halo, {username || roleLabel[role]} 👋
            </h1>
            <p style={{ margin: 0, color: "#475569", maxWidth: "640px" }}>
              Anda masuk sebagai <strong>{roleLabel[role]}</strong>. Kelola jadwal sidang dan pantau ringkasan aktivitas di sini.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {(
              role === "mahasiswa" ? ["pengajuan", "dokumen", "progress", "jadwal"] :
              role === "dosen" ? ["bimbingan", "dokumen", "progress", "jadwal"] :
              role === "admin" ? ["pengguna", "pengajuan", "dokumen", "jadwal", "progress"] :
              role === "kaprodi" ? ["laporan", "progress", "dokumen"] :
              ["dokumen", "progress"]
            ).map((target) => (
              <button
                key={target}
                onClick={() => onNavigate(target)}
                style={{ padding: "12px 20px", borderRadius: "10px", border: "1px solid rgba(15,23,42,0.16)", background: "transparent", color: "#0f172a", cursor: "pointer" }}
              >
                {target.charAt(0).toUpperCase() + target.slice(1)}
              </button>
            ))}
            <button
              onClick={onLogout}
              style={{ padding: "12px 20px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "32px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Total Jadwal
            </p>
            <h2 style={{ margin: "12px 0 0", color: "#0f172a", fontSize: "36px" }}>{jadwal.length}</h2>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Status Login
            </p>
            <h2 style={{ margin: "12px 0 0", color: "#0f172a", fontSize: "26px" }}>{roleLabel[role]}</h2>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Pengguna Aktif
            </p>
            <h2 style={{ margin: "12px 0 0", color: "#0f172a", fontSize: "26px" }}>{username || roleLabel[role]}</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "32px" }}>
          <section style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>Jadwal Terbaru</h3>
                <p style={{ margin: "8px 0 0", color: "#64748b" }}>Lihat jadwal sidang yang sudah terdaftar.</p>
              </div>
            </div>

            {jadwal.length === 0 ? (
              <p style={{ color: "#64748b" }}>Belum ada jadwal.</p>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {jadwal.slice(0, 5).map((item) => (
                  <div key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px" }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#0f172a" }}>{item.mahasiswa}</p>
                    <p style={{ margin: 0, color: "#475569" }}>{item.tanggal} • {item.jam_mulai} - {item.jam_selesai}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Tambah Jadwal</h3>
            <form onSubmit={onFormSubmit} style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
              <input name="mahasiswa" placeholder="Nama Mahasiswa" value={form.mahasiswa} onChange={onFormChange} required style={{ padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", outline: "none" }} />
              <input type="date" name="tanggal" value={form.tanggal} onChange={onFormChange} required style={{ padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", outline: "none" }} />
              <input type="time" name="jam_mulai" value={form.jam_mulai} onChange={onFormChange} required style={{ padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", outline: "none" }} />
              <input type="time" name="jam_selesai" value={form.jam_selesai} onChange={onFormChange} required style={{ padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", outline: "none" }} />
              <button type="submit" style={{ padding: "14px", borderRadius: "14px", border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" }}>Simpan Jadwal</button>
            </form>
          </aside>
        </div>

        <section style={{ marginTop: "32px", background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Semua Jadwal</h3>
          <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
            {jadwal.length === 0 ? (
              <p style={{ color: "#64748b" }}>Tidak ada jadwal saat ini.</p>
            ) : (
              jadwal.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid #e2e8f0", borderRadius: "16px" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{item.mahasiswa}</p>
                    <p style={{ margin: "4px 0 0", color: "#475569" }}>{item.tanggal} • {item.jam_mulai} - {item.jam_selesai}</p>
                  </div>
                  <button onClick={() => onDelete(item.id)} style={{ padding: "10px 16px", border: "none", borderRadius: "12px", background: "#ef4444", color: "#fff", cursor: "pointer" }}>Hapus</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
