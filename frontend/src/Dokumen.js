import { useEffect, useState, useCallback } from "react";

const statusLabel = (status) => {
  if (status === "diterima") return "Diterima";
  if (status === "ditolak") return "Ditolak";
  return "Pending";
};

function Dokumen({ role, onBack }) {
  const API = "http://localhost:5000";

  const user = JSON.parse(localStorage.getItem("user"));

  const [dokumenData, setDokumenData] = useState([]);
  const [toast, setToast] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [judul, setJudul] = useState("");

  const [catatan, setCatatan] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // GET DATA
  // =========================

  const getData = useCallback(async () => {
    try {
      const res = await fetch(`${API}/dokumen`);

      const result = await res.json();

      if (role === "mahasiswa") {
        const filtered = result.filter(
          (item) => item.mahasiswa_id === user?.id
        );

        setDokumenData(filtered);

      } else {
        setDokumenData(result);
      }

    } catch (err) {
      console.log(err);
    }
  }, [role, user]);

  useEffect(() => {
    getData();
  }, [getData]);

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // =========================
  // UPLOAD
  // =========================

  const handleUpload = async () => {
    if (!judul || !selectedFile) {
      alert("Judul & file wajib diisi");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("mahasiswa_id", user.id);
      formData.append("judul", judul);
      formData.append("catatan", catatan);
      formData.append("file", selectedFile);

      const res = await fetch(`${API}/dokumen`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      alert(result.message);

      setShowModal(false);

      setJudul("");
      setCatatan("");
      setSelectedFile(null);

      getData();

    } catch (err) {
      console.log(err);
      alert("Upload gagal");
    }
  };

  // =========================
  // VERIFIKASI
  // =========================

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/dokumen/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status_verifikasi: status
        })
      });

      const result = await res.json();

      showToast(result.message);

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredDocs = dokumenData.filter((item) =>
    item.judul
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        color: "#fff",
        padding: "24px"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div>
            <h1>Dokumen Skripsi</h1>

            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              Upload dan kelola dokumen skripsi
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>

            <button
              onClick={onBack}
              style={btnBack}
            >
              ← Kembali
            </button>

            {role === "mahasiswa" && (
              <button
                onClick={() => setShowModal(true)}
                style={btnUpload}
              >
                ⬆ Upload
              </button>
            )}

          </div>
        </div>

        {/* DASHBOARD */}

        <div style={dashboardGrid}>

          <DashboardCard
            title="Total Dokumen"
            value={dokumenData.length}
          />

          <DashboardCard
            title="Diterima"
            value={
              dokumenData.filter(
                (d) =>
                  d.status_verifikasi === "diterima"
              ).length
            }
          />

          <DashboardCard
            title="Pending"
            value={
              dokumenData.filter(
                (d) =>
                  d.status_verifikasi === "pending"
              ).length
            }
          />

        </div>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="🔍 Cari dokumen..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchStyle}
        />

        {/* LIST */}

        {filteredDocs.length === 0 ? (
          <div style={emptyBox}>
            Belum ada dokumen
          </div>
        ) : (
          filteredDocs.map((item) => (
            <div
              key={item.id}
              style={card}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h3>{item.judul}</h3>

                  <p>
                    👤 {item.nama}
                  </p>

                  <p>
                    📅 {item.tanggal}
                  </p>

                  <p>
                    📝 {item.catatan || "-"}
                  </p>

                  <a
                    href={`${API}/uploads/${item.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 Lihat File
                  </a>
                </div>

                <div>
                  <span
                    style={{
                      ...badge,
                      background:
                        item.status_verifikasi ===
                          "diterima"
                          ? "#22c55e"
                          : item.status_verifikasi ===
                            "ditolak"
                            ? "#ef4444"
                            : "#f59e0b"
                    }}
                  >
                    {statusLabel(
                      item.status_verifikasi
                    )}
                  </span>

                  {(role === "admin" ||
                    role === "dosen") && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "16px"
                        }}
                      >
                        <button
                          onClick={() =>
                            handleStatus(
                              item.id,
                              "diterima"
                            )
                          }
                          style={btnAccept}
                        >
                          ✅
                        </button>

                        <button
                          onClick={() =>
                            handleStatus(
                              item.id,
                              "ditolak"
                            )
                          }
                          style={btnReject}
                        >
                          ❌
                        </button>
                      </div>
                    )}

                </div>
              </div>
            </div>
          ))
        )}

      </div>

      {/* TOAST */}

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <div style={modalBg}>
          <div style={modalBox}>

            <h2>Upload Dokumen</h2>

            <input
              type="text"
              placeholder="Judul Dokumen"
              value={judul}
              onChange={(e) =>
                setJudul(e.target.value)
              }
              style={input}
            />

            <textarea
              placeholder="Catatan"
              value={catatan}
              onChange={(e) =>
                setCatatan(e.target.value)
              }
              style={textarea}
            />

            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(
                  e.target.files[0]
                )
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px"
              }}
            >
              <button
                onClick={() =>
                  setShowModal(false)
                }
                style={btnCancel}
              >
                Batal
              </button>

              <button
                onClick={handleUpload}
                style={btnUpload}
              >
                Upload
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div style={dashboardCard}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* STYLE */

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "24px"
};

const dashboardCard = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "20px"
};

const card = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "16px"
};

const badge = {
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "999px"
};

const btnUpload = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#f0a500",
  cursor: "pointer"
};

const btnBack = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#334155",
  color: "#fff",
  cursor: "pointer"
};

const btnAccept = {
  padding: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer"
};

const btnReject = {
  padding: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const searchStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  marginBottom: "24px"
};

const emptyBox = {
  background: "#fff",
  color: "#000",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center"
};

const toastStyle = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  background: "#0f172a",
  color: "#fff",
  padding: "16px 20px",
  borderRadius: "16px"
};

const modalBg = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "#fff",
  padding: "24px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "500px",
  color: "#000"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const textarea = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1"
};

const btnCancel = {
  padding: "12px 18px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  background: "#fff",
  cursor: "pointer"
};

export default Dokumen;