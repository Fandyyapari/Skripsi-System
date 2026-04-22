import { useEffect, useState } from "react";
import Login from "./Login";

function App() {
  const [jadwal, setJadwal] = useState([]);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  const fetchData = () => {
    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      mahasiswa: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: ""
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 VALIDASI
    if (form.jam_mulai >= form.jam_selesai) {
      alert("Jam selesai harus lebih besar dari jam mulai!");
      return;
    }

    const url = editId
      ? `http://localhost:3000/jadwal/${editId}`
      : "http://localhost:3000/jadwal";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchData();
        resetForm();
      });
  };

  const handleEdit = (j) => {
    setForm(j);
    setEditId(j.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus jadwal ini?")) {
      fetch(`http://localhost:3000/jadwal/${id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          fetchData();
        });
    }
  };

  if (!user) { return <Login setUser={setUser} />; }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "30px"
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>📅 Jadwal Sidang</h1>
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
            }}
            style={{
              background: "#333",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              name="mahasiswa"
              placeholder="Nama Mahasiswa"
              value={form.mahasiswa}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="time"
              name="jam_mulai"
              value={form.jam_mulai}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="time"
              name="jam_selesai"
              value={form.jam_selesai}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <button style={btnPrimary}>
              {editId ? "Update" : "Tambah"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={btnSecondary}
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <hr />

        {/* LIST */}
        {jadwal.length === 0 ? (
          <p style={{ textAlign: "center" }}>Belum ada jadwal</p>
        ) : (
          jadwal.map(j => (
            <div key={j.id} style={cardStyle}>
              <div>
                <strong>{j.mahasiswa}</strong>
                <p style={{ margin: 0 }}>
                  {j.tanggal} | {j.jam_mulai} - {j.jam_selesai}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleEdit(j)}
                  style={btnEdit}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(j.id)}
                  style={btnDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 🎨 STYLE
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: "1"
};

const btnPrimary = {
  padding: "10px 15px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "10px 15px",
  background: "#aaa",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnEdit = {
  marginRight: "10px",
  background: "#2196F3",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnDelete = {
  background: "#f44336",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginTop: "10px",
  border: "1px solid #eee",
  borderRadius: "8px",
  background: "#fafafa"
};

export default App;