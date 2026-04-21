const express = require("express");
const router = express.Router();
const { getJadwal, tambahJadwal, updateJadwal, deleteJadwal } = require("../controllers/jadwalController");

router.get("/", getJadwal);
router.post("/", tambahJadwal);
router.put("/:id", updateJadwal);
router.delete("/:id", deleteJadwal);

module.exports = router;