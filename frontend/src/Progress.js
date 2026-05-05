import { useEffect, useMemo, useState } from "react";

function Progress({ role, onBack }) {
  const API = "http://localhost:5000";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    judul: "",
    dospem: "",
    progress: 0,
    status: "baru",
    tanggal: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // GET DATA
  const getData = async () => {
    try {
      const res = await fetch(`${API}/progress`);
      const result = await res.json();

      setData(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // FILTER
  const filtered = useMemo(() => {
    return data.filter((m) =>
      m.judul?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // TAMBAH
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mahasiswa_id: user.id,
          ...form
        })
      });

      const result = await res.json();

      alert(result.message);

      setForm({
        judul: "",
        dospem: "",
        progress: 0,
        status: "baru",
        tanggal: ""
      });

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus progress?")) return;

    await fetch(`${API}/progress/${id}`, {
      method: "DELETE"
    });

    getData();
  };

  // VERIFIKASI
  const handleVerifikasi = async (id, status) => {
    const catatan = prompt("Masukkan catatan:");

    try {
      await fetch(
        `${API}/progress/${id}/verifikasi`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status_verifikasi: status,
            catatan
          })
        }
      );

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // HITUNG DASHBOARD
  const totalProgress = data.length;

  const rataProgress =
    data.length > 0
      ? Math.round(
        data.reduce((a, b) => a + Number(b.progress), 0) /
        data.length
      )
      : 0;

  const selesai = data.filter((m) => m.status === "selesai").length;

  const berjalan = data.filter((m) => m.status === "berjalan").length;

  return (
    <div
      style={{
        padding: "24px",
        background: "#0a1628",
        minHeight: "100vh",
        color: "#fff"
      }}
    >
      {/* HEADER */}
      <div style={header}>
        <div>
          <p style={subHeader}>Monitoring Skripsi</p>

          <h1 style={{ marginTop: "10px" }}>
            Progress Skripsi
          </h1>
        </div>

        <button onClick={onBack} style={btnBack}>
          ← Kembali
        </button>
      </div>

      {/* CARD */}
      <div style={cardGrid}>
        <div style={cardDashboard}>
          <p style={cardTitle}>📚 Total Progress</p>
          <h2>{totalProgress}</h2>
        </div>

        <div style={cardDashboard}>
          <p style={cardTitle}>📈 Rata-rata</p>
          <h2>{rataProgress}%</h2>
        </div>

        <div style={cardDashboard}>
          <p style={cardTitle}>🚀 Berjalan</p>
          <h2>{berjalan}</h2>
        </div>

        <div style={cardDashboard}>
          <p style={cardTitle}>✅ Selesai</p>
          <h2>{selesai}</h2>
        </div>
      </div>

      {/* FORM */}
      {role === "mahasiswa" && (
        <div style={formBox}>
          <h3 style={{ color: "#000" }}>
            Tambah Progress
          </h3>

          <form onSubmit={handleSubmit} style={formStyle}>

            <input
              type="text"
              name="judul"
              placeholder="Judul Skripsi"
              value={form.judul}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              type="text"
              name="dospem"
              placeholder="Dosen Pembimbing"
              value={form.dospem}
              onChange={handleChange}
              style={input}
              required
            />

            <input
              type="number"
              name="progress"
              placeholder="Progress %"
              value={form.progress}
              onChange={handleChange}
              style={input}
              required
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={input}
            >
              <option value="baru">Baru</option>
              <option value="awal">Awal</option>
              <option value="berjalan">Berjalan</option>
              <option value="selesai">Selesai</option>
            </select>

            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              style={input}
              required
            />

            <button type="submit" style={btnSave}>
              Tambah Progress
            </button>

          </form>
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Cari judul skripsi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          ...input,
          marginTop: "24px",
          marginBottom: "24px",
          width: "100%"
        }}
      />

      {/* LIST */}
      {filtered.length === 0 ? (
        <div style={emptyBox}>
          Belum ada data progress 📭
        </div>
      ) : (
        filtered.map((m) => (
          <div key={m.id} style={card}>

            <div style={topCard}>
              <div>
                <h3 style={{ margin: 0 }}>
                  {m.judul}
                </h3>

                <p style={textMuted}>
                  👨‍🏫 {m.dospem}
                </p>
              </div>

              <span
                style={{
                  ...badge,
                  background:
                    m.status === "selesai"
                      ? "#22c55e"
                      : m.status === "berjalan"
                        ? "#f59e0b"
                        : m.status === "awal"
                          ? "#3b82f6"
                          : "#64748b"
                }}
              >
                {m.status}
              </span>
            </div>

            <p style={{ marginTop: "14px" }}>
              📅 {m.tanggal}
            </p>

            {/* VERIFIKASI */}
            <p>
              <b>Status Verifikasi:</b>{" "}
              {m.status_verifikasi || "pending"}
            </p>

            {m.catatan && (
              <p>
                <b>Catatan:</b> {m.catatan}
              </p>
            )}

            {/* BAR */}
            <div style={progressBg}>
              <div
                style={{
                  ...progressFill,
                  width: `${m.progress}%`
                }}
              />
            </div>

            <div style={progressInfo}>
              <span>{m.progress}% selesai</span>
            </div>

            {/* DOSEN / ADMIN */}
            {role !== "mahasiswa" && (
              <div style={{ marginTop: "16px" }}>
                <button
                  onClick={() =>
                    handleVerifikasi(
                      m.id,
                      "disetujui"
                    )
                  }
                  style={btnAcc}
                >
                  ACC
                </button>

                <button
                  onClick={() =>
                    handleVerifikasi(
                      m.id,
                      "revisi"
                    )
                  }
                  style={btnRevisi}
                >
                  Revisi
                </button>
              </div>
            )}

            {/* DELETE */}
            {role === "admin" && (
              <div style={{ marginTop: "16px" }}>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={btnDelete}
                >
                  Hapus
                </button>
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}

/* STYLE */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  flexWrap: "wrap",
  gap: "12px"
};

const subHeader = {
  margin: 0,
  color: "rgba(255,255,255,0.6)"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "28px"
};

const cardDashboard = {
  background: "#fff",
  color: "#0f172a",
  borderRadius: "20px",
  padding: "24px"
};

const cardTitle = {
  margin: 0,
  color: "#64748b"
};

const formBox = {
  background: "#fff",
  padding: "24px",
  borderRadius: "20px"
};

const formStyle = {
  display: "grid",
  gap: "14px",
  marginTop: "16px"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const btnSave = {
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

const btnBack = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#f0a500",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold"
};

const card = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "16px"
};

const topCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap"
};

const textMuted = {
  color: "#64748b",
  marginTop: "6px"
};

const progressBg = {
  width: "100%",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "14px"
};

const progressFill = {
  height: "100%",
  background: "#22c55e"
};

const progressInfo = {
  marginTop: "10px",
  fontWeight: "bold"
};

const badge = {
  padding: "6px 12px",
  borderRadius: "999px",
  color: "#fff",
  fontSize: "12px",
  textTransform: "capitalize"
};

const btnDelete = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const btnAcc = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer",
  marginRight: "10px"
};

const btnRevisi = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#f59e0b",
  color: "#fff",
  cursor: "pointer"
};

const emptyBox = {
  background: "#fff",
  color: "#000",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center"
};

export default Progress;