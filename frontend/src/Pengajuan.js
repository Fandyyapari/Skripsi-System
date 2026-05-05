import { useEffect, useState, useCallback, useMemo } from "react";

function Pengajuan({ role, onBack }) {
  const API = "http://localhost:5000";

  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    judul: "",
    deskripsi: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // ======================
  // GET DATA
  // ======================
  const getData = useCallback(async () => {
    try {
      const res = await fetch(`${API}/pengajuan`);
      const result = await res.json();

      if (role === "mahasiswa") {
        setData(
          result.filter(
            (item) => item.mahasiswa_id === user?.id
          )
        );
      } else {
        setData(result);
      }

    } catch (err) {
      console.log(err);
    }
  }, [role, user]);

  useEffect(() => {
    getData();
  }, [getData]);

  // ======================
  // INPUT
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async () => {
    if (!form.judul) {
      return alert("Judul wajib diisi");
    }

    try {
      const res = await fetch(`${API}/pengajuan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          mahasiswa_id: user.id,
          judul: form.judul,
          deskripsi: form.deskripsi
        })
      });

      const result = await res.json();

      alert(result.message);

      setForm({
        judul: "",
        deskripsi: ""
      });

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // UPDATE STATUS
  // ======================
  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/pengajuan/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ status })
      });

      const result = await res.json();

      alert(result.message);

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengajuan?")) return;

    try {
      const res = await fetch(`${API}/pengajuan/${id}`, {
        method: "DELETE"
      });

      const result = await res.json();

      alert(result.message);

      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // DASHBOARD
  // ======================
  const total = data.length;

  const diterima = useMemo(
    () => data.filter((d) => d.status === "diterima").length,
    [data]
  );

  const ditolak = useMemo(
    () => data.filter((d) => d.status === "ditolak").length,
    [data]
  );

  const pending = useMemo(
    () =>
      data.filter(
        (d) =>
          d.status !== "diterima" &&
          d.status !== "ditolak"
      ).length,
    [data]
  );

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
            Sistem Pengajuan Skripsi
          </p>

          <h1 style={{ marginTop: "10px" }}>
            Pengajuan Judul Skripsi
          </h1>
        </div>

        <button onClick={onBack} style={btnBack}>
          ← Kembali
        </button>
      </div>

      {/* CARD */}
      <div style={cardGrid}>
        <Card title="📚 Total Pengajuan" value={total} />
        <Card title="⏳ Pending" value={pending} />
        <Card title="✅ Diterima" value={diterima} />
        <Card title="❌ Ditolak" value={ditolak} />
      </div>

      {/* FORM */}
      {role === "mahasiswa" && (
        <div style={box}>
          <h3 style={{ color: "#000" }}>
            Tambah Pengajuan
          </h3>

          <div style={formStyle}>
            <input
              type="text"
              name="judul"
              placeholder="Judul Skripsi"
              value={form.judul}
              onChange={handleChange}
              style={input}
            />

            <textarea
              name="deskripsi"
              placeholder="Deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              style={{
                ...input,
                minHeight: "120px"
              }}
            />

            <button
              onClick={handleSubmit}
              style={btnSave}
            >
              Kirim Pengajuan
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div style={{ marginTop: "24px" }}>
        {data.length === 0 ? (
          <div style={empty}>
            Belum ada pengajuan 📭
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} style={card}>
              <div style={topCard}>
                <div>
                  <h3 style={{ margin: 0 }}>
                    {item.judul}
                  </h3>

                  <p style={muted}>
                    👤 {item.nama}
                  </p>
                </div>

                <span
                  style={{
                    ...badge,
                    background:
                      item.status === "diterima"
                        ? "#22c55e"
                        : item.status === "ditolak"
                          ? "#ef4444"
                          : "#f59e0b"
                  }}
                >
                  {item.status || "pending"}
                </span>
              </div>

              <p style={{ marginTop: "14px" }}>
                {item.deskripsi}
              </p>

              {(role === "admin" ||
                role === "kaprodi") && (
                  <div style={action}>
                    <button
                      onClick={() =>
                        handleStatus(
                          item.id,
                          "diterima"
                        )
                      }
                      style={btnAccept}
                    >
                      ✅ Terima
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
                      ❌ Tolak
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      style={btnDelete}
                    >
                      🗑 Hapus
                    </button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={dashboardCard}>
      <p style={{ color: "#64748b" }}>
        {title}
      </p>

      <h2>{value}</h2>
    </div>
  );
}

/* STYLE */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  flexWrap: "wrap"
};

const sub = {
  margin: 0,
  color: "rgba(255,255,255,0.6)"
};

const btnBack = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#f0a500",
  cursor: "pointer",
  fontWeight: "bold"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "28px"
};

const dashboardCard = {
  background: "#fff",
  color: "#000",
  borderRadius: "20px",
  padding: "24px"
};

const box = {
  background: "#fff",
  borderRadius: "20px",
  padding: "24px"
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
  gap: "12px"
};

const muted = {
  color: "#64748b",
  marginTop: "6px"
};

const badge = {
  padding: "6px 12px",
  borderRadius: "999px",
  color: "#fff",
  fontSize: "12px",
  textTransform: "capitalize"
};

const action = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
  flexWrap: "wrap"
};

const btnAccept = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer"
};

const btnReject = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const btnDelete = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

const empty = {
  background: "#fff",
  color: "#000",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center"
};

export default Pengajuan;