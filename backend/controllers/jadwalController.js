import {
  getAllJadwal,
  createJadwal,
  updateJadwal,
  deleteJadwal
} from "../models/jadwalModel.js";

export const getJadwal = async (req, res) => {
  const data = await getAllJadwal();
  res.json(data);
};

export const addJadwal = async (req, res) => {
  try {
    await createJadwal(req.body);
    res.status(201).json({ message: "✅ Jadwal berhasil!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editJadwal = async (req, res) => {
  try {
    await updateJadwal(req.params.id, req.body);
    res.json({ message: "✅ Jadwal diupdate!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeJadwal = async (req, res) => {
  await deleteJadwal(req.params.id);
  res.json({ message: "🗑️ Jadwal dihapus!" });
};