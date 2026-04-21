const express = require("express");
const router = express.Router();
const { getJadwal, tambahJadwal } = require("../controllers/jadwalController");

router.get("/", getJadwal);
router.post("/", tambahJadwal);

module.exports = router;