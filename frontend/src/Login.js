function Login({ loginForm, onInputChange, onLoginSubmit, onQuickLogin }) {

  
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff"
    },
    background: {
      position: "absolute",
      inset: 0,
      zIndex: 0
    },
    card: {
      position: "relative",
      zIndex: 1,
      width: "420px",
      maxWidth: "90vw",
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "32px"
    },
    emblem: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #f0a500, #d97706)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      fontWeight: 800,
      color: "#0a1628",
      fontFamily: "'Syne', sans-serif",
      boxShadow: "0 4px 16px rgba(240,165,0,0.4)"
    },
    brandName: {
      display: "block",
      fontSize: "18px",
      fontWeight: 700,
      letterSpacing: "0.05em"
    },
    brandSub: {
      display: "block",
      fontSize: "11px",
      color: "rgba(255,255,255,0.5)",
      fontWeight: 300,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    },
    title: {
      margin: 0,
      fontFamily: "'Syne', sans-serif",
      fontSize: "26px",
      fontWeight: 700,
      marginBottom: "6px"
    },
    subtitle: {
      margin: 0,
      color: "rgba(255,255,255,0.4)",
      fontSize: "13px",
      marginBottom: "32px"
    },
    formGroup: {
      marginBottom: "18px"
    },
    label: {
      display: "block",
      color: "rgba(255,255,255,0.6)",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: "8px"
    },
    input: {
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "12px 16px",
      color: "#fff",
      fontSize: "14px",
      outline: "none"
    },
    select: {
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "12px 16px",
      color: "#fff",
      fontSize: "14px",
      outline: "none"
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #f0a500, #d97706)",
      border: "none",
      borderRadius: "10px",
      fontFamily: "'Syne', sans-serif",
      fontSize: "15px",
      fontWeight: 700,
      color: "#0a1628",
      cursor: "pointer",
      letterSpacing: "0.05em",
      marginTop: "8px"
    },
    demoWrapper: {
      marginTop: "24px",
      paddingTop: "20px",
      borderTop: "1px solid rgba(255,255,255,0.08)"
    },
    demoText: {
      color: "rgba(255,255,255,0.4)",
      fontSize: "11px",
      textAlign: "center",
      marginBottom: "12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase"
    },
    demoBtns: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    },
    demoBtn: {
      flex: 1,
      minWidth: "80px",
      padding: "8px 10px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "rgba(255,255,255,0.7)",
      fontSize: "11px",
      fontWeight: 500,
      cursor: "pointer",
      textAlign: "center"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.background}></div>

      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.emblem}>S</div>
          <div>
            <span style={styles.brandName}>SKRIPSI</span>
            <span style={styles.brandSub}>UNESA — Teknik Informatika</span>
          </div>
        </div>

        <div style={styles.title}>Selamat Datang</div>
        <div style={styles.subtitle}>Sistem Administrasi Tugas Akhir / Skripsi</div>

        {/* 🔥 FORM START */}
        <form onSubmit={onLoginSubmit}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Username / NIM</label>
            <input
              type="text"
              name="username"
              value={loginForm.username}
              onChange={onInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={onInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Login sebagai</label>
            <select
              name="role"
              value={loginForm.role}
              onChange={onInputChange}
              style={styles.select}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
              <option value="kaprodi">Kaprodi</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Masuk ke Sistem →
          </button>

        </form>
        {/* 🔥 FORM END */}

        <div style={styles.demoWrapper}>
          <p style={styles.demoText}>Demo cepat</p>
          <div style={styles.demoBtns}>
            <div style={styles.demoBtn} onClick={() => onQuickLogin("mahasiswa")}>Mahasiswa</div>
            <div style={styles.demoBtn} onClick={() => onQuickLogin("dosen")}>Dosen</div>
            <div style={styles.demoBtn} onClick={() => onQuickLogin("admin")}>Admin</div>
            <div style={styles.demoBtn} onClick={() => onQuickLogin("kaprodi")}>Kaprodi</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;