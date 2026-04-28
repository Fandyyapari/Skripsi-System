export const login = (req, res) => {
    const { username, password, role } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });

            if (rows.length === 0) {
                return res.status(401).json({ message: "User tidak ditemukan" });
            }

            const user = rows[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({ message: "Password salah" });
            }

            // 🔥 VALIDASI ROLE
            if (role !== user.role) {
                return res.status(403).json({ message: "Role tidak sesuai!" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                token,
                username: user.username,
                role: user.role
            });
        }
    );
};