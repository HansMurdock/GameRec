import { createMiddleware } from 'hono/factory'
import { verifyToken } from "../utils/jwt";
export const jwtMiddleware = createMiddleware(async (c, next) => {
const authHeader = c.req.header('Authorization')
if (!authHeader) {
return c.json({ message: 'Unauthorized' }, 401)
}
const token = authHeader.split(' ')[1]
const user = verifyToken(token)
if (!user) {
return c.json({ message: 'Token tidak valid' }, 401)
}
c.set('user', user)
await next()
})