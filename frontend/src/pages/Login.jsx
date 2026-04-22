import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { users } from "../services/dummy"

export default function Login() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  function handleLogin() {
    const user = users.find(u => u.username === username)

    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/dashboard")
    } else {
      alert("User tidak ditemukan")
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input 
        placeholder="Masukkan username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}