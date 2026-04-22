import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
import { db } from "../db";
import { generateToken } from "../utils/jwt";
export const googleAuthRoute = new Hono();
googleAuthRoute.use(
"/google",
googleAuth({
client_id: process.env.GOOGLE_CLIENT_ID,
client_secret: process.env.GOOGLE_CLIENT_SECRET,
scope: ["openid", "email", "profile"],
redirect_uri: "http://localhost:3000/auth/google/callback",
}),
);
googleAuthRoute.get("/google/callback", async (c) => {
const code = c.req.query("code");
if (!code) {
return c.json({ message: "Code tidak ada" }, 400);
}
const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
code,
client_id: process.env.GOOGLE_CLIENT_ID,
client_secret: process.env.GOOGLE_CLIENT_SECRET,
redirect_uri: "http://localhost:3000/auth/google/callback",
grant_type: "authorization_code",
}),
});
const tokenData = await tokenRes.json();
const access_token = tokenData.access_token;
if (!access_token) {
console.log(tokenData);

return c.json({ message: "Gagal ambil access token" }, 400);
}
const userRes = await
fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
headers: {
Authorization: `Bearer ${access_token}`,
},
});
const user = await userRes.json();
console.log("USER GOOGLE:", user);
const email = user.email;
if (!email) {
return c.json({ message: "Email tidak ditemukan" }, 400);
}
const [rows] = await db.execute("SELECT * FROM users WHERE email= ?", [
email,
]);
let dbUser = rows[0];
if (!dbUser) {
const [result] = await db.execute(
"INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
[email, "", "user"],
);
dbUser = {
id: result.insertId,
email,
role: "user",
};
}
const token = generateToken({
id: dbUser.id,
email: dbUser.email,
role: dbUser.role,
});
return c.json({ token });
});