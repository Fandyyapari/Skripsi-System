import db from "../db.js";

// ======================
// GET
// ======================

export const getDokumen = (req, res) => {
    db.query(
        `SELECT d.*, u.nama
     FROM dokumen d
     JOIN users u
     ON d.mahasiswa_id = u.id
     ORDER BY d.id DESC`,
        (err, rows) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: err.message });
            }

            res.json(rows);
        }
    );
};

// ======================
// UPLOAD
// ======================

export const uploadDokumen = (req, res) => {
    const {
        mahasiswa_id,
        judul,
        catatan
    } = req.body;

    const file = req.file?.filename;

    if (!file) {
        return res
            .status(400)
            .json({
                message: "File belum dipilih"
            });
    }

    db.query(
        `INSERT INTO dokumen
    (mahasiswa_id, judul, file, catatan)
    VALUES (?, ?, ?, ?)`,
        [
            mahasiswa_id,
            judul,
            file,
            catatan
        ],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: err.message });
            }

            res.json({
                message:
                    "Dokumen berhasil upload"
            });
        }
    );
};

// ======================
// UPDATE STATUS
// ======================

export const updateDokumenStatus = (
    req,
    res
) => {
    const { id } = req.params;

    const { status_verifikasi } =
        req.body;

    db.query(
        `UPDATE dokumen
     SET status_verifikasi=?
     WHERE id=?`,
        [status_verifikasi, id],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: err.message });
            }

            res.json({
                message:
                    "Status berhasil diupdate"
            });
        }
    );
};