import { useEffect, useState, useCallback } from "react";

function Sidang({ role, onBack }) {
    const API = "http://localhost:5000";

    const [data, setData] = useState([]);

    const [form, setForm] = useState({
        mahasiswa: "",
        judul: "",
        tanggal: "",
        penguji: "",
        nilai: "",
        status: "revisi",
        revisi: ""
    });

    const [search, setSearch] = useState("");

    // ======================
    // GET DATA
    // ======================

    const getData = useCallback(async () => {
        try {
            const res = await fetch(`${API}/sidang`);
            const result = await res.json();

            setData(result);

        } catch (err) {
            console.log(err);
        }
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/sidang`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const result = await res.json();

            alert(result.message);

            setForm({
                mahasiswa: "",
                judul: "",
                tanggal: "",
                penguji: "",
                nilai: "",
                status: "revisi",
                revisi: ""
            });

            getData();

        } catch (err) {
            console.log(err);
        }
    };

    // ======================
    // DELETE
    // ======================

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data sidang?")) return;

        await fetch(`${API}/sidang/${id}`, {
            method: "DELETE"
        });

        getData();
    };

    // ======================
    // FILTER
    // ======================

    const filtered = data.filter((item) =>
        item.mahasiswa
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    // ======================
    // DASHBOARD
    // ======================

    const totalSidang = data.length;

    const lulus = data.filter(
        (d) => d.status === "lulus"
    ).length;

    const revisi = data.filter(
        (d) => d.status === "revisi"
    ).length;

    const rataNilai =
        data.length > 0
            ? Math.round(
                data.reduce(
                    (a, b) => a + Number(b.nilai || 0),
                    0
                ) / data.length
            )
            : 0;

    return (
        <div
            style={{
                padding: "24px",
                background: "#0a1628",
                minHeight: "100vh",
                color: "#fff"
            }}
        >
            {/* HEADER */}

            <div style={header}>
                <div>
                    <p style={subHeader}>
                        Monitoring Sidang Skripsi
                    </p>

                    <h1>Data Sidang</h1>
                </div>

                <button onClick={onBack} style={btnBack}>
                    ← Kembali
                </button>
            </div>

            {/* DASHBOARD */}

            <div style={gridDashboard}>

                <div style={cardDashboard}>
                    <p>Total Sidang</p>
                    <h2>{totalSidang}</h2>
                </div>

                <div style={cardDashboard}>
                    <p>Lulus</p>
                    <h2>{lulus}</h2>
                </div>

                <div style={cardDashboard}>
                    <p>Revisi</p>
                    <h2>{revisi}</h2>
                </div>

                <div style={cardDashboard}>
                    <p>Rata-rata Nilai</p>
                    <h2>{rataNilai}</h2>
                </div>

            </div>

            {/* FORM */}

            {(role === "admin" || role === "dosen") && (
                <div style={formBox}>

                    <h3 style={{ color: "#000" }}>
                        Tambah Sidang
                    </h3>

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
                            style={input}
                            required
                        />

                        <input
                            type="text"
                            name="judul"
                            placeholder="Judul Skripsi"
                            value={form.judul}
                            onChange={handleChange}
                            style={input}
                            required
                        />

                        <input
                            type="date"
                            name="tanggal"
                            value={form.tanggal}
                            onChange={handleChange}
                            style={input}
                            required
                        />

                        <input
                            type="text"
                            name="penguji"
                            placeholder="Dosen Penguji"
                            value={form.penguji}
                            onChange={handleChange}
                            style={input}
                            required
                        />

                        <input
                            type="number"
                            name="nilai"
                            placeholder="Nilai"
                            value={form.nilai}
                            onChange={handleChange}
                            style={input}
                            required
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={input}
                        >
                            <option value="lulus">
                                Lulus
                            </option>

                            <option value="revisi">
                                Revisi
                            </option>
                        </select>

                        <textarea
                            name="revisi"
                            placeholder="Catatan revisi"
                            value={form.revisi}
                            onChange={handleChange}
                            style={textarea}
                        />

                        <button type="submit" style={btnSave}>
                            Simpan Sidang
                        </button>

                    </form>
                </div>
            )}

            {/* SEARCH */}

            <input
                type="text"
                placeholder="🔍 Cari mahasiswa..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                style={{
                    ...input,
                    marginTop: "24px",
                    marginBottom: "24px",
                    width: "100%"
                }}
            />

            {/* LIST */}

            {filtered.length === 0 ? (
                <div style={emptyBox}>
                    Belum ada data sidang 🎓
                </div>
            ) : (
                filtered.map((item) => (
                    <div key={item.id} style={card}>

                        <div style={topCard}>

                            <div>
                                <h3>{item.mahasiswa}</h3>

                                <p style={muted}>
                                    {item.judul}
                                </p>
                            </div>

                            <span
                                style={{
                                    ...badge,
                                    background:
                                        item.status === "lulus"
                                            ? "#22c55e"
                                            : "#f59e0b"
                                }}
                            >
                                {item.status}
                            </span>

                        </div>

                        <p>
                            📅 {item.tanggal}
                        </p>

                        <p>
                            👨‍🏫 Penguji: {item.penguji}
                        </p>

                        <p>
                            📝 Nilai: {item.nilai}
                        </p>

                        <p>
                            📌 Revisi:{" "}
                            {item.revisi || "-"}
                        </p>

                        {(role === "admin" ||
                            role === "dosen") && (
                                <button
                                    onClick={() =>
                                        handleDelete(item.id)
                                    }
                                    style={btnDelete}
                                >
                                    Hapus
                                </button>
                            )}

                    </div>
                ))
            )}
        </div>
    );
}

/* STYLE */

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap"
};

const subHeader = {
    color: "rgba(255,255,255,0.6)"
};

const gridDashboard = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "24px"
};

const cardDashboard = {
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "20px"
};

const formBox = {
    background: "#fff",
    padding: "24px",
    borderRadius: "20px"
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

const textarea = {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    minHeight: "100px"
};

const btnSave = {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer"
};

const btnBack = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#f0a500",
    cursor: "pointer",
    fontWeight: "bold"
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
    flexWrap: "wrap"
};

const muted = {
    color: "#64748b"
};

const badge = {
    padding: "6px 12px",
    borderRadius: "999px",
    color: "#fff",
    textTransform: "capitalize"
};

const btnDelete = {
    marginTop: "16px",
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

export default Sidang;