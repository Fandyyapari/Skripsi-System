import { useEffect, useState } from "react";

function App() {
  const [jadwal, setJadwal] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/jadwal")
      .then(res => res.json())
      .then(data => setJadwal(data));
  }, []);

  return (
    <div>
      <h1>Jadwal Sidang</h1>
      {jadwal.map(j => (
        <p key={j.id}>
          {j.mahasiswa} - {j.tanggal}
        </p>
      ))}
    </div>
  );
}

export default App;