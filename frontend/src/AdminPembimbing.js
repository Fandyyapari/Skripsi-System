import { useEffect, useState } from "react";

function AdminPembimbing({ onBack }) {
    const [dataPengajuan, setDataPengajuan] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        loadPengajuan();
    }, []);

    const loadPengajuan = async () => {
        try {
            const res = await fetch("http://localhost:5000/pengajuan");
            const data = await res.json();
            setDataPengajuan(Array.isArray(data) ? data : []);
        } catch {
            setDataPengajuan([]);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2000);
    };

    const handleSetPembimbing = async () => {
        if (!p1) return alert("Isi pembimbing 1");

        try {
            const res = await fetch("http://localhost:5000/pembimbing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pengajuan_id: selectedId,
                    pembimbing1: p1,
                    pembimbing2: p2
                })
            });

            const data = await res.json();

            showToast(data.message);
            setSelectedId(null);
            setP1("");
            setP2("");
            loadPengajuan();

        } catch {
            alert("Gagal set pembimbing");
        }
    };

    return (
        <div style={page}>
            <div style={container}>

                {/* HEADER */}
                <div style={header}>
                    <h2 style={{ margin: 0 }}>🎓 Set Pembimbing</h2>
                    <button onClick={onBack} style={btn}>← Kembali</button>
                </div>

                {/* CARD TABLE */}
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
                                {dataPengajuan.map((item) => (
                                    <tr key={item.id}>
                                        <td style={td}>{item.nama}</td>
                                        <td style={td}>{item.judul}</td>
                                        <td style={td}>{item.status}</td>
                                        <td style={td}>
                                            <button
                                                style={btnPrimary}
                                                onClick={() => setSelectedId(item.id)}
                                            >
                                                Set
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {selectedId && (
                <div style={modalBg}>
                    <div style={modalBox}>
                        <h3>Set Pembimbing</h3>

                        <input
                            placeholder="Pembimbing 1"
                            value={p1}
                            onChange={(e) => setP1(e.target.value)}
                            style={input}
                        />

                        <input
                            placeholder="Pembimbing 2"
                            value={p2}
                            onChange={(e) => setP2(e.target.value)}
                            style={input}
                        />

                        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                            <button onClick={() => setSelectedId(null)} style={btn}>
                                Batal
                            </button>
                            <button onClick={handleSetPembimbing} style={btnPrimary}>
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
    cursor: "pointer"
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
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const modalBox = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "320px"
};

const toastStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#000",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px"
};

export default AdminPembimbing;