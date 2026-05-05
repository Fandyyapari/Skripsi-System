import {
    getAllBimbingan,
    createBimbingan,
    updateBimbingan,
    deleteBimbingan
} from "../models/bimbinganModel.js";

export const getBimbingan = async (req, res) => {
    const data = await getAllBimbingan();
    res.json(data);
};

export const addBimbingan = async (req, res) => {
    try {
        await createBimbingan(req.body);

        res.json({
            message: "Bimbingan berhasil dikirim"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const editBimbingan = async (req, res) => {
    try {
        const { feedback, status } = req.body;

        await updateBimbingan(
            req.params.id,
            feedback,
            status
        );

        res.json({
            message: "Feedback berhasil dikirim"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const removeBimbingan = async (req, res) => {
    await deleteBimbingan(req.params.id);

    res.json({
        message: "Bimbingan dihapus"
    });
};