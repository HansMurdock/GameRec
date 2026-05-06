import { Hono } from "hono";
import { googleAuthRoute } from "./auth/google";
import { jwtMiddleware } from "./middlewares/jwt.middleware";
import { isAdminMiddleware } from "./middlewares/isAdmin.middleware";
import { db } from "./db";
import { generateToken } from "./utils/jwt";

const app = new Hono();

app.get("/", (c) => c.text("Auth Testing - GameRec"));

app.route("/auth", googleAuthRoute);

app.post("/login-jwt", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.text("Email dan password wajib diisi!", 400);
  }
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = rows[0];
  if (!user || user.password !== password) {
    return c.text("Login gagal: email atau password salah", 401);
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  return c.json({ token });
});

app.get("/profile-jwt", jwtMiddleware, (c) => {
  return c.json(c.get("user"));
});

app.get("/admin", jwtMiddleware, isAdminMiddleware, (c) => {
  return c.text("Welcome Admin!");
});

export default {
  fetch: app.fetch,
  idleTimeout: 60,
};
