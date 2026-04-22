import { Hono } from 'hono'
import jwt from 'jsonwebtoken'

const app = new Hono()
const SECRET = 'secret123'

// 1. Fungsi Utility (Export jika ingin dipakai di file lain)
export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

// 2. Definisi Route
app.post('/login-jwt', async (c) => {
  // Pastikan variabel 'db' juga sudah di-import/didefinisikan di sini
  const { email, password } = await c.req.json()
  
  // ... logika database kamu ...
  
  const token = generateToken({ id: 1, email: email }) // contoh
  return c.json({ token })
})

export default app