import {useMemo, useState } from "react";
function Jadwal({ role, onBack }) {
  const API = "http://localhost:5000";

  const [jadwal, setJadwal] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    kegiatan: "bimbingan",
    ruangan: ""
  });

  // GET DATA
  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/jadwal`);
      const data = await res.json();

      console.log("DATA JADWAL:", data); // 🔥 DEBUG

      // ✅ pastikan selalu array
      if (Array.isArray(data)) {
        setJadwal(data);
      } else if (Array.isArray(data.data)) {
        setJadwal(data.data);
      } else {
        setJadwal([]); // fallback biar ga error
      }

    } catch (err) {
      console.log(err);
      setJadwal([]); // fallback
    }
  };

  // FILTER
  const filtered = useMemo(() => {
    if (!Array.isArray(jadwal)) return [];

    return jadwal.filter((j) =>
      j.mahasiswa?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jadwal, search]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // TAMBAH
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/jadwal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const result = await res.json();
    alert(result.message);

    if (res.ok) {
      setShowModal(false);
      fetchData();
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal?")) return;

    await fetch(`${API}/jadwal/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div style={page}>
      <div style={container}>

        {/* HEADER */}
        <div style={header}>
          <div>
            <p style={sub}>Sistem Skripsi</p>
            <h1>📅 Jadwal Bimbingan & Sidang</h1>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onBack} style={btnBack}>
              ← Kembali
            </button>

            {role === "admin" && (
              <button onClick={() => setShowModal(true)} style={btnAdd}>
                + Tambah
              </button>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <input
          placeholder="🔍 Cari mahasiswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        {/* LIST */}
        <div style={{ marginTop: "20px" }}>
          {filtered.length === 0 ? (
            <div style={emptyBox}>Belum ada jadwal 📭</div>
          ) : (
            filtered.map((j) => (
              <div key={j.id} style={itemCard}>

                <div>
                  <h3>{j.mahasiswa}</h3>

                  <p style={text}>📅 {j.tanggal}</p>
                  <p style={text}>🕒 {j.jam_mulai} - {j.jam_selesai}</p>
                  <p style={text}>📍 {j.ruangan || "-"}</p>

                  <span style={{
                    ...badge,
                    background:
                      j.kegiatan === "sidang" ? "#ef4444" : "#22c55e"
                  }}>
                    {j.kegiatan}
                  </span>
                </div>

                {role === "admin" && (
                  <button
                    onClick={() => handleDelete(j.id)}
                    style={btnDelete}
                  >
                    Hapus
                  </button>
                )}

              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>

            <h2>Tambah Jadwal</h2>

            <form onSubmit={handleSubmit} style={formStyle}>

              <input name="mahasiswa" placeholder="Nama"
                value={form.mahasiswa}
                onChange={handleChange}
                style={modalInput} required />

              <select name="kegiatan"
                value={form.kegiatan}
                onChange={handleChange}
                style={modalInput}>
                <option value="bimbingan">Bimbingan</option>
                <option value="sidang">Sidang</option>
              </select>

              <input name="ruangan" placeholder="Ruangan"
                value={form.ruangan}
                onChange={handleChange}
                style={modalInput} />

              <input type="date" name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                style={modalInput} required />

              <input type="time" name="jam_mulai"
                value={form.jam_mulai}
                onChange={handleChange}
                style={modalInput} required />

              <input type="time" name="jam_selesai"
                value={form.jam_selesai}
                onChange={handleChange}
                style={modalInput} required />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancel}>
                  Batal
                </button>
                <button type="submit" style={btnSave}>
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLE */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0a1628,#0f1e3a)",
  padding: "24px",
  color: "#fff"
};

const container = {
  maxWidth: "1000px",
  margin: "0 auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const sub = {
  color: "rgba(255,255,255,0.6)"
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  outline: "none"
};

const itemCard = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "18px",
  marginBottom: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "0.2s",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const text = {
  color: "#64748b"
};

const badge = {
  padding: "6px 12px",
  borderRadius: "999px",
  color: "#fff",
  fontSize: "12px",
  marginTop: "6px",
  display: "inline-block"
};

const btnBack = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#1e293b",
  color: "#fff",
  cursor: "pointer"
};

const btnAdd = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#f0a500",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold"
};

const btnDelete = {
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
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

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  color: "#000",
  padding: "28px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "420px"
};

const formStyle = {
  display: "grid",
  gap: "12px",
  marginTop: "16px"
};

const modalInput = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const btnCancel = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  cursor: "pointer"
};

const btnSave = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

export default Jadwal;