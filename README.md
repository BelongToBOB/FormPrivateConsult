# 🎯 FormPrivateConsult

ฟอร์มลงทะเบียน **Exclusive Private Consult** — บริการปรึกษากลยุทธ์การเงิน 1-on-1 กับคุณวิน

Base ต่อยอดจาก `FormAtIBsolo` แต่ปรับโครงให้เหมาะกับ **high-ticket lead qualification form** (ลูกค้าพร้อมจ่าย 35k–50k)

---

## 📋 โครงสร้างฟอร์ม

| Section | เนื้อหา | จำนวนฟิลด์ |
|---------|---------|------------|
| 1. ข้อมูลติดต่อ | ชื่อ / ชื่อเล่น / อีเมล / เบอร์ / **LINE ID** | 5 |
| 2. โปรไฟล์ธุรกิจ | ชื่อธุรกิจ / ประเภท / จดทะเบียน / อายุ / รายได้ | 5 |
| 3. สถานะการเงิน | มีสินเชื่อ? / ธนาคาร / วงเงินปัจจุบัน / เป้าหมาย / ปัญหา | 6 |
| 4. เป้าหมาย Session | หัวข้อที่ปรึกษา / เป้าหมาย / ความพร้อมเอกสาร | 3 |
| 5. Attribution | รู้จักจากไหน | 1 |
| + | PDPA Consent + Honeypot + consult_id | - |

**รวม:** 20 ฟิลด์ที่ลูกค้ากรอก

---

## 🆚 ความต่างจาก Base Form (FormAtIBsolo)

- ✅ เพิ่ม **LINE ID** (ช่องทางหลักปิดการขายไทย)
- ✅ เพิ่ม Section **โปรไฟล์ธุรกิจ** (qualify)
- ✅ แยก **วงเงินปัจจุบัน vs วงเงินเป้าหมาย** (base มีแค่ loan_amount)
- ✅ เปลี่ยน `expectation` เป็นแบบ **structured**: topic checkbox + open-ended goal
- ✅ เพิ่ม **documents_ready** (ให้วินรู้ว่าจะเตรียม session ได้เลยไหม)
- ✅ เพิ่ม **PDPA consent** (บังคับก่อนส่ง)
- ❌ ตัด `job` (Private Consult = เจ้าของธุรกิจอยู่แล้ว)
- ❌ ตัด `business` (ใช้ structured business profile แทน)
- ❌ ไม่มี section แพ็กเกจ + นัดหมาย (คุยใน sales call)

---

## 🚀 รันโปรเจกต์

```bash
docker-compose up -d
```

- **Form:** http://localhost:8082
- **n8n:** http://localhost:5679

---

## 🔗 Webhook

```
https://automation.winwinwealth.co/webhook/private-consult-register
```

## 🆔 Consult ID

Default: `EPC_2026`
Override ผ่าน URL: `?event=EPC_SUMMER_2026`

---

## 📦 Payload Schema

```json
{
  "type": "private_consult",
  "consult_id": "EPC_2026",
  "contact": { "full_name", "nickname", "email", "phone", "line_id" },
  "business": {
    "business_name", "business_type", "business_type_final",
    "registration", "business_age", "monthly_revenue"
  },
  "credit": {
    "loan_before", "credit_bank[]",
    "current_credit", "target_credit",
    "loan_problem", "loan_problem_detail"
  },
  "consult_topic": ["array"],
  "consult_topic_final": ["array (other expanded)"],
  "expectation": "string",
  "documents_ready": "string",
  "channel": ["array"],
  "pdpa_consent": true,
  "createdAt": "ISO timestamp",
  "submissionId": "UUID"
}
```

---

## 🎨 Theme

- Primary: Gold gradient (`#fbbf24` → `#d97706`)
- Background: Dark hero + light body
- Font: Kanit (headings) + Prompt (body)

สอดคล้องกับ brand identity ของหน้า sale page `private-consult.astro`
