import { Hono } from 'hono'
import { db } from './db'
import { generateToken } from './utils/jwt'
import { googleAuthRoute } from './auth/google'
import { jwtMiddleware } from './middlewares/jwt.middleware'
import { isAdminMiddleware } from './middlewares/isAdmin.middleware';

const app = new Hono()
app.get('/', (c) => c.text('Auth Testing'))
export default app


app.use('/auth', googleAuthRoute)   

app.route("/auth", googleAuthRoute);
app.get('/profile-jwt', jwtMiddleware, (c) => {

return c.json(c.get('user'))
})

app.get('/admin', jwtMiddleware, isAdminMiddleware, (c) => {
return c.text('Welcome Admin')
})

app.post('/login-jwt', async (c) => {
const { email, password } = await c.req.json()
const [rows] = await db.execute(
'SELECT * FROM users WHERE email = ?',
[email]
)
const user = rows[0]
if (!user || user.password !== password) {

return c.json({ message: 'Login gagal' }, 401)
}
const token = generateToken({
id: user.id,
email: user.email,
role: user.role
})
return c.json({ token })
})