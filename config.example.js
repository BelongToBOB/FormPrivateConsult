/* =========================
   🔐 CONFIG TEMPLATE
   ---------------------------
   วิธีใช้:
   1. copy ไฟล์นี้เป็น `config.js`
   2. ใส่ WEBHOOK_URL จริงของ production
   3. config.js ถูก gitignore ไว้ ไม่ขึ้น public repo
========================= */

window.APP_CONFIG = {
  // n8n webhook endpoint (production)
  WEBHOOK_URL: "https://automation.example.com/webhook/your-endpoint",

  // Default consult ID (override ผ่าน ?event=XXX ได้)
  DEFAULT_CONSULT_ID: "EPC_2026",

  // LINE OA link สำหรับหน้า success
  LINE_OA_URL: "https://lin.ee/example",
};
