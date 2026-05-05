import db from "../db.js";

// GET
export const getProgress = (req, res) => {
    const sql = `
    SELECT 
      p.*,
      u.nama,
      u.identitas AS nim
    FROM progress p
    JOIN users u ON p.mahasiswa_id = u.id
    ORDER BY p.tanggal DESC
  `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

// ADD
export const addProgress = (req, res) => {
    const {
        mahasiswa_id,
        judul,
        dospem,
        progress,
        status,
        tanggal
    } = req.body;

    if (!mahasiswa_id || !judul || !tanggal) {
        return res.status(400).json({ message: "Data belum lengkap" });
    }

    db.query(
        `INSERT INTO progress 
    (mahasiswa_id, judul, dospem, progress, status, tanggal)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [mahasiswa_id, judul, dospem, progress, status, tanggal],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });

            res.json({ message: "Progress berhasil ditambahkan" });
        }
    );
};

// UPDATE STATUS / PROGRESS
export const updateProgress = (req, res) => {
    const { id } = req.params;
    const { progress, status } = req.body;

    db.query(
        "UPDATE progress SET progress=?, status=? WHERE id=?",
        [progress, status, id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });

            res.json({ message: "Progress berhasil diupdate" });
        }
    );
};

// DELETE
export const deleteProgress = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM progress WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({ message: "Progress dihapus" });
    });
};

export const verifikasiProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status_verifikasi,
            catatan
        } = req.body;

        await db.query(
            `UPDATE progress
       SET status_verifikasi=?,
           catatan=?
       WHERE id=?`,
            [status_verifikasi, catatan, id]
        );

        res.json({
            message: "Progress berhasil diverifikasi"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Gagal verifikasi"
        });
    }
};