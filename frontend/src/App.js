import { useEffect, useState } from "react";

function App() {
  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState({
    mahasiswa: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: ""
  });

  // ambil data
  useEffect(() => {
    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/jadwal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        resetForm();
        // reload data
        fetch("http://localhost:3000/jadwal")
          .then(res => res.json())
          .then(data => setJadwal(data));
      });
  };

  // DELETE FUNCTION
  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus jadwal ini?")) {
      fetch(`http://localhost:3000/jadwal/${id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          // reload data
          fetch("http://localhost:3000/jadwal")
            .then(res => res.json())
            .then(data => setJadwal(data));
        });
    }
  };

  // reset form setelah submit
  const resetForm = () => {
    setForm({
      mahasiswa: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: ""
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Jadwal Sidang</h1>

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
          Tambah
        </button>
      </form>

      <hr />

      <div>
        {jadwal.length === 0 ? (
          <p>Tidak ada jadwal</p>
        ) : (
          jadwal.map(j => (
            <div 
              key={j.id} 
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #ddd",
                marginBottom: "5px",
                borderRadius: "4px"
              }}
            >
              <span>
                <strong>{j.mahasiswa}</strong> | 
                {j.tanggal} | 
                {j.jam_mulai}-{j.jam_selesai}
              </span>
              <button
                onClick={() => handleDelete(j.id)}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;