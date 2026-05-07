import { useEffect, useState } from "react";

const statusLabel = (status) => {
  if (status === "pending") return "Menunggu";
  if (status === "review") return "Revisi";
  if (status === "done") return "Selesai";
  return "-";
};

function Bimbingan({ role, username, onBack }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [pengajuanId] = useState(1); // 🔥 sementara (nanti ambil dari pengajuan)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/bimbingan");
    const data = await res.json();
    setActivityLogs(Array.isArray(data) ? data : []);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ TAMBAH
  const handleSaveSession = async () => {
    const topik = document.getElementById("topik").value;
    const tanggal = document.getElementById("tanggal").value;
    const catatan = document.getElementById("catatan").value;

    if (!topik || !tanggal) return alert("Isi dulu");

    const res = await fetch("http://localhost:5000/bimbingan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mahasiswa_id: 1,
        mahasiswa: username,
        pengajuan_id: pengajuanId, // 🔥 INI KUNCI
        topik,
        catatan,
        tanggal
      })
    });

    const data = await res.json();
    showToast(data.message);
    setShowModal(false);
    loadData();
  };

  // ✅ UPDATE
  const updateStatus = async (id, status, feedback) => {
    await fetch(`http://localhost:5000/bimbingan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback })
    });

    showToast("Update berhasil");
    loadData();
  };

  // 🔥 FILTER ROLE
  const filtered = activityLogs.filter((item) =>
    role === "mahasiswa"
      ? item.mahasiswa === username
      : true
  );

  return (
    <div style={{ padding: 24, background: "#0a1628", minHeight: "100vh", color: "#fff" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Bimbingan</h2>
        <div>
          <button onClick={onBack}>← Kembali</button>
          {role === "mahasiswa" && (
            <button onClick={() => setShowModal(true)}>+ Ajukan</button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: "#fff", color: "#000", marginTop: 20, padding: 20 }}>
        <table width="100%">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Mahasiswa</th>
              <th>Topik</th>
              <th>Catatan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.tanggal}</td>
                <td>{item.mahasiswa}</td>
                <td>{item.topik}</td>
                <td>{item.feedback || item.catatan}</td>
                <td>{statusLabel(item.status)}</td>
                <td>{item.pembimbing1 || "-"}</td>
                <td>
                  {role === "dosen" && (
                    <>
                      {item.status !== "done" && (
                        <button onClick={() => updateStatus(item.id, "done", "Disetujui")}>
                          ✓
                        </button>
                      )}
                      <button onClick={() => updateStatus(item.id, "review", "Revisi")}>
                        ✎
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
            <h3>Ajukan Bimbingan</h3>

            <input id="topik" placeholder="Topik" /><br />
            <input id="tanggal" type="date" /><br />
            <textarea id="catatan" placeholder="Catatan" /><br />

            <button onClick={() => setShowModal(false)}>Batal</button>
            <button onClick={handleSaveSession}>Simpan</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default Bimbingan;