/* =========================
   Exclusive Private Consult Registration
========================= */

const WEBHOOK_URL = window.APP_CONFIG?.WEBHOOK_URL || "https://api.winwinwealth.co/api/private-consult";

let cachedData = null;

const form = document.getElementById("consultForm");
const reviewBtn = document.getElementById("reviewBtn");
const editBtn = document.getElementById("editBtn");
const formSection = document.getElementById("formSection");
const confirmSection = document.getElementById("confirmSection");
const confirmData = document.getElementById("confirmData");
const submitBtn = document.getElementById("submitBtn");

const btOtherRadio = document.getElementById("btOtherRadio");
const btOtherInput = document.getElementById("btOtherInput");
const topicOtherBox = document.getElementById("topicOtherBox");
const topicOtherInput = document.getElementById("topicOtherInput");

/* INIT */
const consultId = new URLSearchParams(window.location.search).get("event") || "EPC_2026";
const consultIdInput = document.querySelector('input[name="consult_id"]');
if (consultIdInput) consultIdInput.value = consultId;

/* TOGGLES */
if (btOtherRadio) {
  btOtherRadio.addEventListener("change", () => {
    btOtherInput.classList.remove("hidden");
  });
  document.querySelectorAll('input[name="business_type"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value !== "อื่นๆ") {
        btOtherInput.classList.add("hidden");
        btOtherInput.value = "";
      }
    });
  });
}

if (topicOtherBox) {
  topicOtherBox.addEventListener("change", () => {
    if (topicOtherBox.checked) {
      topicOtherInput.classList.remove("hidden");
    } else {
      topicOtherInput.classList.add("hidden");
      topicOtherInput.value = "";
    }
  });
}

/* HELPERS */
function getCheckboxValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
}

function getVal(name) {
  const fd = new FormData(form);
  return (fd.get(name) || "").toString().trim();
}

/* REVIEW */
reviewBtn.addEventListener("click", () => {

  /* Section 1: Contact */
  const contact = {
    full_name: getVal("full_name"),
    nickname: getVal("nickname"),
    email: getVal("email"),
    phone: getVal("phone"),
    line_id: getVal("line_id"),
  };

  if (!contact.full_name || !contact.nickname || !contact.email || !contact.phone || !contact.line_id) {
    alert("⚠️ กรุณากรอกข้อมูลติดต่อให้ครบ");
    return;
  }
  if (!/^[0-9]{10}$/.test(contact.phone)) {
    alert("⚠️ เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
    return;
  }

  /* Section 2: Business */
  const business_type = getVal("business_type");
  const business_type_other = getVal("business_type_other");

  if (!business_type) { alert("⚠️ กรุณาเลือกประเภทธุรกิจ"); return; }
  if (business_type === "อื่นๆ" && !business_type_other) { alert("⚠️ กรุณาระบุประเภทธุรกิจ"); return; }

  const business = {
    business_name: getVal("business_name"),
    business_type,
    business_type_other,
    business_type_final: business_type === "อื่นๆ" ? business_type_other : business_type,
    monthly_revenue: getVal("monthly_revenue"),
  };

  if (!business.business_name || !business.monthly_revenue) {
    alert("⚠️ กรุณากรอกข้อมูลโปรไฟล์ธุรกิจให้ครบ");
    return;
  }

  /* Section 3: Goals */
  const consult_topic = getCheckboxValues("consult_topic");
  const consult_topic_other = getVal("consult_topic_other");

  if (consult_topic.length === 0) { alert("⚠️ กรุณาเลือกเรื่องที่อยากปรึกษา อย่างน้อย 1 ข้อ"); return; }
  if (consult_topic.includes("อื่นๆ") && !consult_topic_other) { alert("⚠️ กรุณาระบุเรื่องที่อยากปรึกษา (อื่นๆ)"); return; }

  /* Section 4: Attribution */
  const channel = getCheckboxValues("channel");
  if (channel.length === 0) { alert("⚠️ กรุณาเลือกช่องทางที่รู้จัก Exclusive Private Consult"); return; }

  /* PDPA */
  if (!document.getElementById("pdpaConsent").checked) {
    alert("⚠️ กรุณายินยอมให้ใช้ข้อมูลเพื่อการติดต่อกลับ");
    return;
  }

  /* Honeypot */
  if (getVal("website")) { console.warn("Bot detected"); return; }

  /* Build payload */
  const consult_topic_final = consult_topic.map(t => t === "อื่นๆ" ? consult_topic_other : t);

  const data = {
    type: "private_consult",
    consult_id: getVal("consult_id"),
    contact,
    business,
    consult_topic,
    consult_topic_other,
    consult_topic_final,
    channel,
    pdpa_consent: true,
    createdAt: new Date().toISOString(),
    submissionId: crypto.randomUUID(),
  };

  cachedData = data;

  /* Render confirm */
  confirmData.innerHTML = `
    <div class="confirm-row"><strong>ชื่อ:</strong> ${contact.full_name} (${contact.nickname})</div>
    <div class="confirm-row"><strong>ติดต่อ:</strong> ${contact.phone} · ${contact.email}</div>
    <div class="confirm-row"><strong>LINE ID:</strong> ${contact.line_id}</div>
    <div class="confirm-row"><strong>ธุรกิจ:</strong> ${business.business_name}</div>
    <div class="confirm-row"><strong>ประเภท:</strong> ${business.business_type_final}</div>
    <div class="confirm-row"><strong>รายได้/เดือน:</strong> ${business.monthly_revenue}</div>
    <div class="confirm-row"><strong>เรื่องที่อยากปรึกษา:</strong> ${consult_topic_final.join(", ")}</div>
    <div class="confirm-row"><strong>ช่องทางที่รู้จัก:</strong> ${channel.join(", ")}</div>
  `;

  formSection.classList.add("hidden");
  confirmSection.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* EDIT */
editBtn.addEventListener("click", () => {
  confirmSection.classList.add("hidden");
  formSection.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cachedData) { alert("กรุณาตรวจสอบข้อมูลก่อน"); return; }

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.innerHTML = '<span class="spinner"></span> กำลังส่ง...';

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cachedData),
    });

    if (res.ok) {
      window.location.href = "/success.html";
    } else {
      throw new Error("Server error");
    }
  } catch (err) {
    console.error(err);
    alert("ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมงานที่ LINE @winwinwealth");
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.innerHTML = "✅ ยืนยันการส่งข้อมูล";
  }
});
