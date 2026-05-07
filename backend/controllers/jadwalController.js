import {
  getAllJadwal,
  createJadwal,
  updateJadwal,
  deleteJadwal
} from "../models/jadwalModel.js";

// ✅ GET + FILTER kegiatan
export const getJadwal = async (req, res) => {
  try {
    const { kegiatan } = req.query;

    let data = await getAllJadwal();

    if (kegiatan) {
      data = data.filter(j => j.kegiatan === kegiatan);
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD
export const addJadwal = async (req, res) => {
  try {
    const {
      mahasiswa,
      tanggal,
      jam_mulai,
      jam_selesai,
      kegiatan,
      ruangan
    } = req.body;

    if (!mahasiswa || !tanggal || !jam_mulai || !jam_selesai || !kegiatan) {
      return res.status(400).json({
        message: "Data belum lengkap"
      });
    }

    await createJadwal({
      mahasiswa,
      tanggal,
      jam_mulai,
      jam_selesai,
      kegiatan,
      ruangan
    });

    res.status(201).json({
      message: "✅ Jadwal berhasil ditambahkan"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ✅ UPDATE
export const editJadwal = async (req, res) => {
  try {
    await updateJadwal(req.params.id, req.body);

    res.json({
      message: "✅ Jadwal berhasil diupdate"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ✅ DELETE
export const removeJadwal = async (req, res) => {
  try {
    await deleteJadwal(req.params.id);

    res.json({
      message: "🗑️ Jadwal dihapus"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};