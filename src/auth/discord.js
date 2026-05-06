import { Hono } from "hono";
import { db } from "../db";
import { generateToken } from "../utils/jwt";

export const discordAuthRoute = new Hono();

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/discord/callback";

// Step 1: Redirect user ke Discord OAuth
discordAuthRoute.get("/discord", (c) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });
  return c.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// Step 2: Handle callback dari Discord
discordAuthRoute.get("/discord/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.json({ message: "Code tidak ada" }, 400);
  }

  // Tukar code dengan access_token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error("Discord token error:", tokenData);
    return c.redirect(
      `http://localhost:5500/GameRec/html/login.html?error=discord_token_failed`,
    );
  }

  // Ambil data user dari Discord
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const discordUser = await userRes.json();
  console.log("USER DISCORD:", discordUser);

  const email = discordUser.email;
  if (!email) {
    return c.redirect(
      `http://localhost:5500/GameRec/html/login.html?error=no_email`,
    );
  }

  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : "";

  // Cari atau buat user di database
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  let dbUser = rows[0];

  if (!dbUser) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, image, password, role, provider, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        discordUser.username || discordUser.global_name || "",
        email,
        avatarUrl,
        "",
        "user",
        "discord",
      ],
    );
    dbUser = {
      id: result.insertId,
      email,
      name: discordUser.username || discordUser.global_name || "",
      image: avatarUrl,
      role: "user",
    };
  } else {
    // Update name dan image kalau user sudah ada
    await db.execute(
      "UPDATE users SET name = ?, image = ?, updatedAt = NOW() WHERE email = ?",
      [discordUser.username || discordUser.global_name || "", avatarUrl, email],
    );
    dbUser.name = discordUser.username || discordUser.global_name || "";
    dbUser.image = avatarUrl;
  }

  const token = generateToken({
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || "",
    role: dbUser.role,
  });

  return c.redirect(
    `http://localhost:5500/GameRec/html/login.html?token=${token}`,
  );
});
