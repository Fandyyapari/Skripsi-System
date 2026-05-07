import { setPembimbing, getPembimbing } from "../models/pembimbingModel.js";
import db from "../db.js";

// TAMBAH PEMBIMBING
export const addPembimbing = async (req, res) => {
    try {
        const { pengajuan_id, pembimbing1, pembimbing2 } = req.body;

        if (!pengajuan_id || !pembimbing1) {
            return res.status(400).json({
                message: "Data tidak lengkap"
            });
        }

        // simpan pembimbing
        await setPembimbing(req.body);

        // 🔥 update status pengajuan
        db.query(
            "UPDATE pengajuan SET status='dibimbing' WHERE id=?",
            [pengajuan_id]
        );

        res.json({
            message: "Pembimbing berhasil ditentukan"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET PEMBIMBING
export const getAllPembimbing = async (req, res) => {
    try {
        const data = await getPembimbing();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};