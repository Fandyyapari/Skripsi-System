import { createPenguji } from "../models/pengujiModel.js";
import db from "../db.js";

export const addPenguji = async (req, res) => {
    try {
        const { pengajuan_id, penguji1, penguji2 } = req.body;

        if (!pengajuan_id || !penguji1) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        await createPenguji(req.body);

        // 🔥 UPDATE STATUS (INI PENTING)
        await db.query(
            "UPDATE pengajuan SET status='siap sidang' WHERE id=?",
            [pengajuan_id]
        );

        res.json({ message: "Penguji berhasil ditetapkan" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};