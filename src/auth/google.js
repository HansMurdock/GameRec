import { Hono } from "hono";
import { db } from "../db";
import { generateToken } from "../utils/jwt";

export const googleAuthRoute = new Hono();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";

// Step 1: Redirect ke Google
googleAuthRoute.get("/google", (c) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: Handle callback — tukar code, kirim ke Express 5000
googleAuthRoute.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.redirect(
      "http://localhost:5500/GameRec/html/login.html?error=no_code",
    );
  }

  try {
    // Tukar code dengan access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("Google token response:", tokenData);

    if (!tokenData.access_token) {
      console.error("Gagal ambil access token:", tokenData);
      return c.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=google_token_failed",
      );
    }

    // Ambil data user dari Google
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const googleUser = await userRes.json();
    console.log("USER GOOGLE:", googleUser);

    if (!googleUser.email) {
      return c.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=no_email",
      );
    }

    // Kirim data user ke Express port 5000 untuk disimpan ke DB
    const socialRes = await fetch("http://localhost:5000/api/auth/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split("@")[0],
        image: googleUser.picture || "",
        provider: "google",
      }),
    });

    const socialData = await socialRes.json();
    console.log("Social response:", socialData);

    if (!socialData.success || !socialData.token) {
      return c.redirect(
        "http://localhost:5500/GameRec/html/login.html?error=social_failed",
      );
    }

    // Redirect ke frontend dengan token dari Express
    return c.redirect(
      `http://localhost:5500/GameRec/html/login.html?token=${socialData.token}`,
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return c.redirect(
      "http://localhost:5500/GameRec/html/login.html?error=server_error",
    );
  }
});
