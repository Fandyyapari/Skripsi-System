import {
    getAllProgress,
    createProgress,
    updateProgressModel,
    deleteProgressModel,
    verifyProgressModel
} from "../models/progressModel.js";


// GET
export const getProgress = async (req, res) => {
    try {
        const data = await getAllProgress();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ADD
export const addProgress = async (req, res) => {
    try {
        const {
            mahasiswa_id,
            judul,
            dospem,
            progress,
            status,
            tanggal
        } = req.body;

        if (!mahasiswa_id || !judul || !tanggal) {
            return res.status(400).json({
                message: "Data belum lengkap"
            });
        }

        await createProgress(req.body);

        res.json({
            message: "Progress berhasil ditambahkan"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE (opsional)
export const updateProgress = async (req, res) => {
    try {
        const { progress, status } = req.body;

        await updateProgressModel(
            req.params.id,
            progress,
            status
        );

        res.json({
            message: "Progress berhasil diupdate"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔥 VERIFIKASI (INI YANG PENTING)
export const verifikasiProgress = async (req, res) => {
    try {
        const { status_verifikasi, catatan } = req.body;

        await verifyProgressModel(
            req.params.id,
            status_verifikasi,
            catatan
        );

        res.json({
            message: "Progress berhasil diverifikasi"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteProgress = async (req, res) => {
    try {
        await deleteProgressModel(req.params.id);

        res.json({
            message: "Progress dihapus"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};