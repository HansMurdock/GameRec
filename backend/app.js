const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const User = require("./models/User");
require("dotenv").config();
const Comment = require("./models/Comment");
const Wishlist = require("./models/Wishlist");

const app = express();

app.use(cors());
app.use(express.json());

// Helper: kirim plain text message
function sendPlainText(res, statusCode, message) {
  res.status(statusCode).type("text/plain").send(message);
}

// --- 1. REGISTER MANUAL ---
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return sendPlainText(res, 400, "Semua field wajib diisi!");
  }
  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist)
      return res
        .status(400)
        .json({ success: false, message: "Email sudah terdaftar" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      provider: "credentials",
    });

    res.status(201).json({
      success: true,
      message: "Berhasil daftar!",
      user: { id: newUser.id, name, email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error saat registrasi" });
  }
});

// --- 2. LOGIN MANUAL ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendPlainText(res, 400, "Email dan password wajib diisi!");
  }
  try {
    const user = await User.findOne({
      where: { email, provider: "credentials" },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error saat login" });
  }
});

// --- 3. SOCIAL LOGIN (Google) ---
app.post("/api/auth/social", async (req, res) => {
  const { email, name, image, provider } = req.body;
  if (!email || !provider) {
    return sendPlainText(res, 400, "Email dan provider wajib ada!");
  }
  try {
    let [user] = await User.findOrCreate({
      where: { email, provider }, // ← tambah provider
      defaults: {
        name: name || "",
        image: image || "",
        provider: provider,
        role: "user",
        password: "",
      },
    });

    const appToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token: appToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Social Auth Error:", error);
    res.status(500).json({ success: false, message: "Social Auth Failed" });
  }
});

// ── GOOGLE OAUTH ──────────────────────────────────────

// Step 1: Redirect ke Google
app.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: Handle callback Google
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      message: "Code tidak ada",
    });
  }

  try {
    // Tukar code dengan access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/auth/google/callback",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Google token error:", tokenData);

      return res.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=google_token_failed",
      );
    }

    // Ambil data user Google
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const googleUser = await userRes.json();

    console.log("GOOGLE USER DATA:", JSON.stringify(googleUser));

    // Cari atau buat user
    const [user, created] = await User.findOrCreate({
      where: { email: googleUser.email, provider: "google" }, // ← tambah provider
      defaults: {
        name: googleUser.name,
        image: googleUser.picture,
        provider: "google",
        role: "user",
        password: "",
      },
    });

    // Kalau user sudah ada → update data
    if (!created) {
      await user.update({
        name: googleUser.name,
        image: googleUser.picture,
      });

      user.name = googleUser.name;
      user.image = googleUser.picture;
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Redirect ke frontend
    return res.redirect(
      `http://localhost:5500/GameRec/html/login.html?token=${token}`,
    );
  } catch (error) {
    console.error("Google auth error:", error);

    return res.redirect(
      "http://localhost:5500/GameRec/html/login.html?error=auth_failed",
    );
  }
});

// --- 4. ENDPOINT ADMIN ---
app.get("/api/admin/check", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return sendPlainText(res, 401, "Login dulu bos!");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return sendPlainText(res, 403, "Bukan Admin!");
    res.json({ message: "Welcome Admin!" });
  } catch (e) {
    return sendPlainText(res, 401, "Token expired atau salah!");
  }
});

// --- 5. STATUS SERVER ---
app.get("/api/status", (req, res) => {
  sendPlainText(res, 200, "Server GameRec berjalan dengan baik!");
});

// A. ENDPOINT: KIRIM KOMENTAR
app.post("/api/comments", async (req, res) => {
  const { content, gameSlug, userId } = req.body;
  try {
    const newComment = await Comment.create({ content, gameSlug, userId });
    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal kirim komentar" });
  }
});

// B. ENDPOINT: AMBIL KOMENTAR BERDASARKAN GAME
app.get("/api/comments/:slug", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { gameSlug: req.params.slug },
      include: [{ model: User, attributes: ["name", "image"] }], // Biar muncul nama pengirimnya
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal ambil komentar" });
  }
});

// ── MIDDLEWARE AUTH ──────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Login dulu!" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid" });
  }
}

// ── GET LIBRARY / WISHLIST ───────────────
app.get("/api/user/games/:listType", authMiddleware, async (req, res) => {
  const { listType } = req.params;
  try {
    const games = await Wishlist.findAll({
      where: { userId: req.user.id, listType },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: games });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal ambil data" });
  }
});

// ── TAMBAH KE LIBRARY / WISHLIST ─────────
app.post("/api/user/games", authMiddleware, async (req, res) => {
  const {
    gameSlug,
    gameName,
    gameImage,
    gameScore,
    listType,
    status,
    progress,
  } = req.body;
  if (!gameSlug || !listType) {
    return res
      .status(400)
      .json({ success: false, message: "gameSlug dan listType wajib ada" });
  }
  try {
    const existing = await Wishlist.findOne({
      where: { userId: req.user.id, gameSlug, listType },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: `Game sudah ada di ${listType}` });
    }
    const entry = await Wishlist.create({
      userId: req.user.id,
      gameSlug,
      gameName: gameName || "",
      gameImage: gameImage || "",
      gameScore: gameScore || 0,
      listType,
      status: listType === "library" ? status || "Playing" : null,
      progress: progress || 0,
    });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal tambah game" });
  }
});

// ── HAPUS DARI LIBRARY / WISHLIST ────────
app.delete("/api/user/games/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Wishlist.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "Tidak ditemukan" });
    await entry.destroy();
    res.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal hapus" });
  }
});

// ── UPDATE STATUS / PROGRESS ─────────────
app.patch("/api/user/games/:id", authMiddleware, async (req, res) => {
  const { status, progress } = req.body;
  try {
    const entry = await Wishlist.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "Tidak ditemukan" });
    await entry.update({ status, progress });
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update" });
  }
});

// --- START SERVER ---
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server ready di http://localhost:${PORT}`),
  );
});
// ── DISCORD OAUTH ──────────────────────────────────────

// Step 1: Redirect ke Discord
app.get("/api/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: "http://localhost:5000/api/auth/discord/callback",
    response_type: "code",
    scope: "identify email",
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// Step 2: Handle callback
app.get("/api/auth/discord/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      "http://localhost:5500/GameRec/html/login.html?error=no_code",
    );
  }

  try {
    // Tukar code dengan access_token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:5000/api/auth/discord/callback",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Discord token error:", tokenData);
      return res.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=discord_token_failed",
      );
    }

    // Ambil data user dari Discord
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const discordUser = await userRes.json();
    console.log("DISCORD USER DATA:", JSON.stringify(discordUser));

    const email = discordUser.email;
    if (!email) {
      return res.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=no_email",
      );
    }

    const namaDiscord =
      discordUser.global_name || discordUser.username || "Gamer";
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : "";

    // Cari atau buat user
    const [user, created] = await User.findOrCreate({
      where: { email, provider: "discord" }, // ← tambah provider
      defaults: {
        name: namaDiscord,
        image: avatarUrl,
        provider: "discord",
        role: "user",
        password: "",
      },
    });

    if (!created) {
      await user.update({ name: namaDiscord, image: avatarUrl });
      user.name = namaDiscord;
      user.image = avatarUrl;
    }

    console.log("Nama yang disimpan:", user.name);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: namaDiscord,
        discordUsername: discordUser.username, // ← tambah ini
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.redirect(
      `http://localhost:5500/GameRec/html/login.html?token=${token}`,
    );
  } catch (error) {
    console.error("Discord auth error:", error);
    return res.redirect(
      "http://localhost:5500/GameRec/html/login.html?error=auth_failed",
    );
  }
});
// ── GOOGLE PROXY SERVER (PORT 3000) ───────────────────
const googleProxy = express();

googleProxy.get("/auth/google", (req, res) => {
  res.redirect("http://localhost:5000/auth/google");
});

googleProxy.get("/auth/google/callback", (req, res) => {
  const query = new URLSearchParams(req.query).toString();

  res.redirect(`http://localhost:5000/auth/google/callback?${query}`);
});

googleProxy.listen(3000, () => {
  console.log("Google Proxy running on http://localhost:3000");
});
