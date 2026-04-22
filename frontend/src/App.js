import { useEffect, useState } from "react";

function App() {
  const [jadwal, setJadwal] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  // ambil data
  const fetchData = () => {
    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // reset form
  const resetForm = () => {
    setForm({
      mahasiswa: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: ""
    });
    setEditId(null);
  };

  // submit (CREATE + UPDATE)
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3000/jadwal/${editId}`
      : "http://localhost:3000/jadwal";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchData();      // reload data tanpa refresh page
        resetForm();      // reset form
      });
  };

  // EDIT
  const handleEdit = (j) => {
    setForm({
      mahasiswa: j.mahasiswa,
      tanggal: j.tanggal,
      jam_mulai: j.jam_mulai,
      jam_selesai: j.jam_selesai
    });

    setEditId(j.id);
  };

  // DELETE
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

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>Jadwal Sidang</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="mahasiswa"
          placeholder="Nama Mahasiswa"
          value={form.mahasiswa}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          type="time"
          name="jam_mulai"
          value={form.jam_mulai}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          type="time"
          name="jam_selesai"
          value={form.jam_selesai}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <button type="submit" style={{ padding: "8px 16px" }}>
          {editId ? "Update" : "Tambah"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Batal
          </button>
        )}
      </form>

      <hr />

      {/* LIST DATA */}
      {jadwal.length === 0 ? (
        <p>Tidak ada jadwal</p>
      ) : (
        jadwal.map(j => (
          <div
            key={j.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            <p>
              <strong>{j.mahasiswa}</strong><br />
              {j.tanggal} | {j.jam_mulai} - {j.jam_selesai}
            </p>

            <button
              onClick={() => handleEdit(j)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(j.id)}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Hapus
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;