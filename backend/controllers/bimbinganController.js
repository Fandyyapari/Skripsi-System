import db from "../db.js";
import {
    createBimbingan,
    getAllBimbingan,
    updateBimbingan,
    deleteBimbingan
} from "../models/bimbinganModel.js";

// ✅ TAMBAH Bimbingan (SUDAH NYAMBUNG KE PEMBIMBING)
export const addBimbingan = async (req, res) => {
    try {
        const {
            mahasiswa_id,
            mahasiswa,
            topik,
            catatan,
            tanggal,
            pengajuan_id
        } = req.body;

        if (!mahasiswa_id || !topik || !tanggal || !pengajuan_id) {
            return res.status(400).json({
                message: "Data tidak lengkap"
            });
        }

        // 🔥 ambil pembimbing dari tabel pembimbing
        db.query(
            "SELECT pembimbing1 FROM pembimbing WHERE pengajuan_id=?",
            [pengajuan_id],
            async (err, result) => {
                if (err) return res.status(500).json({ message: err.message });

                if (result.length === 0) {
                    return res.json({
                        message: "Pembimbing belum ditentukan"
                    });
                }

                const dosen = result[0].pembimbing1;

                await createBimbingan({
                    mahasiswa_id,
                    mahasiswa,
                    dosen,
                    topik,
                    catatan,
                    tanggal
                });

                res.json({
                    message: "Bimbingan berhasil dikirim"
                });
            }
        );

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ✅ GET
export const getBimbingan = async (req, res) => {
    try {
        const data = await getAllBimbingan();
        res.json(data);
    } catch (err) {
        console.log("ERROR Bimbingan:", err);
        res.status(500).json({
            message: err.message
        });
    }
};

// ✅ UPDATE (approve / revisi)
export const editBimbingan = async (req, res) => {
    try {
        const { feedback, status } = req.body;

        await updateBimbingan(
            req.params.id,
            feedback,
            status
        );

        res.json({
            message: "Bimbingan berhasil diupdate"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ✅ DELETE
export const removeBimbingan = async (req, res) => {
    try {
        await deleteBimbingan(req.params.id);

        res.json({
            message: "Bimbingan dihapus"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};