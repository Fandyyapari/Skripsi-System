import { useEffect, useMemo, useState } from "react";

function Jadwal({ role, onBack }) {
  const API = "http://localhost:5000";

  const [jadwal, setJadwal] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  const token = localStorage.getItem("token");

  // GET DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/jadwal`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setJadwal(data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, [API, token]);


  // FILTER
  const filtered = useMemo(() => {
    return jadwal.filter((j) =>
      j.mahasiswa?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jadwal, search]);

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
      const res = await fetch(`${API}/jadwal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      alert(result.message);

      if (res.ok) {
        setShowModal(false);

        setForm({
          mahasiswa: "",
          tanggal: "",
          jam_mulai: "",
          jam_selesai: ""
        });

        window.location.reload();
      }

    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal?")) return;

    try {
      const res = await fetch(`${API}/jadwal/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();

      alert(result.message);

      window.location.reload();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        padding: "24px",
        color: "#fff"
      }}
    >
      {/* HEADER */}
      <div style={header}>
        <div>
          <p style={sub}>
            Sistem Skripsi UNESA
          </p>

          <h1>
            Jadwal Bimbingan & Sidang
          </h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onBack} style={btnBack}>
            ← Kembali
          </button>

          {role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              style={btnAdd}
            >
              + Tambah Jadwal
            </button>
          )}
        </div>
      </div>

      {/* CARD */}
      <div style={cardGrid}>
        <div style={card}>
          <p>Total Jadwal</p>
          <h2>{jadwal.length}</h2>
        </div>

        <div style={card}>
          <p>Jadwal Hari Ini</p>
          <h2>
            {
              jadwal.filter(
                (j) =>
                  j.tanggal ===
                  new Date().toISOString().split("T")[0]
              ).length
            }
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Cari mahasiswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* LIST */}
      <div style={{ marginTop: "24px" }}>
        {filtered.length === 0 ? (
          <div style={emptyBox}>
            Belum ada jadwal 📭
          </div>
        ) : (
          filtered.map((j) => (
            <div key={j.id} style={itemCard}>

              <div>
                <h3 style={{ margin: 0 }}>
                  {j.mahasiswa}
                </h3>

                <p style={text}>
                  📅 {j.tanggal}
                </p>

                <p style={text}>
                  🕒 {j.jam_mulai} - {j.jam_selesai}
                </p>
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

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>

            <h2>Tambah Jadwal</h2>

            <form
              onSubmit={handleSubmit}
              style={formStyle}
            >

              <input
                type="text"
                name="mahasiswa"
                placeholder="Nama Mahasiswa"
                value={form.mahasiswa}
                onChange={handleChange}
                style={modalInput}
                required
              />

              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                style={modalInput}
                required
              />

              <input
                type="time"
                name="jam_mulai"
                value={form.jam_mulai}
                onChange={handleChange}
                style={modalInput}
                required
              />

              <input
                type="time"
                name="jam_selesai"
                value={form.jam_selesai}
                onChange={handleChange}
                style={modalInput}
                required
              />

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={btnCancel}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  style={btnSave}
                >
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

/* STYLE */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  flexWrap: "wrap",
  gap: "12px"
};

const sub = {
  color: "rgba(255,255,255,0.6)"
};

const btnBack = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer"
};

const btnAdd = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#f0a500",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "24px"
};

const card = {
  background: "#fff",
  color: "#000",
  padding: "24px",
  borderRadius: "20px"
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const itemCard = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const text = {
  color: "#64748b"
};

const btnDelete = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
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
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  color: "#000",
  padding: "28px",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "500px"
};

const formStyle = {
  display: "grid",
  gap: "14px",
  marginTop: "20px"
};

const modalInput = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const btnCancel = {
  padding: "12px 18px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  background: "transparent",
  cursor: "pointer"
};

const btnSave = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

export default Jadwal;