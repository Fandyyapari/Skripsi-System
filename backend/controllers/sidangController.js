import {
    getAllSidang,
    createSidang,
    updateSidang,
    deleteSidang
} from "../models/sidangModel.js";

// GET
export const getSidang = async (req, res) => {
    try {
        const data = await getAllSidang();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// CREATE
export const addSidang = async (req, res) => {
    try {
        await createSidang(req.body);

        res.json({
            message: "Sidang berhasil ditambahkan"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// UPDATE
export const editSidang = async (req, res) => {
    try {
        await updateSidang(req.params.id, req.body);

        res.json({
            message: "Sidang berhasil diupdate"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// DELETE
export const removeSidang = async (req, res) => {
    try {
        await deleteSidang(req.params.id);

        res.json({
            message: "Sidang berhasil dihapus"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};