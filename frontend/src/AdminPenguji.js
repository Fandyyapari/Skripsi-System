import { useEffect, useState } from "react";
const statusStyle = (status) => {
    if (status === "pending") return { bg: "#e5e7eb", color: "#111" };
    if (status === "dibimbing") return { bg: "#60a5fa", color: "#fff" };
    if (status === "siap sidang") return { bg: "#22c55e", color: "#fff" };
    return { bg: "#ccc", color: "#000" };
};
function AdminPenguji({ onBack }) {
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await fetch("http://localhost:5000/pengajuan");
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch {
            setData([]);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2000);
    };

    const handleSave = async () => {
        if (!p1) return alert("Penguji 1 wajib");

        try {
            const res = await fetch("http://localhost:5000/penguji", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pengajuan_id: selectedId,
                    penguji1: p1,
                    penguji2: p2
                })
            });

            const data = await res.json();

            showToast(data.message);
            setSelectedId(null);
            setP1("");
            setP2("");
            loadData();
        } catch {
            alert("Gagal set penguji");
        }
    };

    return (
        <div style={page}>
            <div style={container}>

                {/* HEADER */}
                <div style={header}>
                    <h2 style={{ margin: 0 }}>⚖️ Penetapan Penguji</h2>
                    <button onClick={onBack} style={btn}>← Kembali</button>
                </div>

                {/* CARD */}
                <div style={card}>
                    <h3 style={{ marginBottom: 16 }}>Daftar Pengajuan</h3>

                    <div style={{ overflowX: "auto" }}>
                        <table style={table}>
                            <thead>
                                <tr>
                                    <th style={th}>Mahasiswa</th>
                                    <th style={th}>Judul</th>
                                    <th style={th}>Status</th>
                                    <th style={th}>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((item) => {
                                    const s = statusStyle(item.status);

                                    return (
                                        <tr key={item.id}>
                                            <td style={td}>{item.nama || "-"}</td>

                                            <td style={td}>
                                                <div style={{ fontWeight: "600" }}>{item.judul}</div>
                                                <div style={{ fontSize: "12px", color: "#666" }}>
                                                    {item.deskripsi}
                                                </div>
                                            </td>

                                            <td style={td}>
                                                <span style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    background: s.bg,
                                                    color: s.color
                                                }}>
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td style={td}>
                                                <button
                                                    style={{
                                                        ...btnPrimary,
                                                        opacity: item.status === "siap sidang" ? 0.5 : 1,
                                                        cursor: item.status === "siap sidang" ? "not-allowed" : "pointer"
                                                    }}
                                                    disabled={item.status === "siap sidang"}
                                                    onClick={() => setSelectedId(item.id)}
                                                >
                                                    {item.status === "siap sidang" ? "✔ Sudah" : "Set"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {selectedId && (
                <div style={modalBg}>
                    <div style={modalBox}>
                        <h3 style={{ marginTop: 0 }}>Set Penguji</h3>

                        <input
                            placeholder="Penguji 1"
                            value={p1}
                            onChange={(e) => setP1(e.target.value)}
                            style={input}
                        />

                        <input
                            placeholder="Penguji 2"
                            value={p2}
                            onChange={(e) => setP2(e.target.value)}
                            style={input}
                        />

                        <div style={modalBtn}>
                            <button onClick={() => setSelectedId(null)} style={btn}>
                                Batal
                            </button>
                            <button onClick={handleSave} style={btnPrimary}>
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && <div style={toastStyle}>{toast}</div>}
        </div>
    );
}

/* ================= STYLE ================= */

const page = {
    minHeight: "100vh",
    background: "#0a1628",
    padding: "24px",
    color: "#fff"
};

const container = {
    maxWidth: "1100px",
    margin: "0 auto"
};

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
};

const card = {
    background: "#fff",
    color: "#000",
    borderRadius: "16px",
    padding: "20px"
};

const table = {
    width: "100%",
    borderCollapse: "collapse"
};

const th = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #ddd"
};

const td = {
    padding: "12px",
    borderBottom: "1px solid #eee"
};

const input = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
};

const btn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    background: "#fff"
};

const btnPrimary = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#f0a500",
    cursor: "pointer"
};

const modalBg = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};

const modalBox = {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    transform: "translateY(0)",
    margin: "0 auto"
};
const modalBtn = {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
};

const toastStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#0f172a",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

export default AdminPenguji;