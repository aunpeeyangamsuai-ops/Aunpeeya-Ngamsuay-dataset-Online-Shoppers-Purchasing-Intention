# Online Shoppers Purchasing Intention

Dashboard แบบ interactive (d3.js) แสดงพฤติกรรมผู้เยี่ยมชมร้านค้าออนไลน์ 12,330 เซสชัน
ว่าอะไรสัมพันธ์กับการตัดสินใจซื้อ ออกแบบด้วยธีมซุปเปอร์มาร์เก็ต

## กราฟและ interactivity
- กราฟ 5 แบบ: กราฟแท่ง, กราฟเส้น, แผนภาพกระจาย, โดนัท, heatmap
- interactivity: filter (คลิกแท่ง/โดนัท/ช่อง heatmap), tooltip, brush (ลากเลือกบนแผนภาพกระจาย)
- อนิเมชันแบบซุปเปอร์มาร์เก็ต, responsive, รองรับโหมดสว่าง/มืด

## โครงสร้างโปรเจกต์
```
data/raw/                          ข้อมูลดิบ
data/cleaned/                      ข้อมูลที่ทำความสะอาดแล้ว (online_shoppers_cleaned.csv)
web/d3/                            โค้ดเว็บ (HTML, CSS, JavaScript + d3.js)
  index.html
  css/style.css
  js/app.js
  data/shoppers.js                 ข้อมูลที่หน้าเว็บใช้ (สร้างจาก scripts/build_data.py)
scripts/build_data.py              แปลง CSV เป็น shoppers.js
docs/process_report.pdf            รายงานกระบวนการทำงาน
index.html                         หน้าส่งต่อไปยัง web/d3/
```

## วิธีรันบนเครื่อง
เปิด `web/d3/index.html` ในเบราว์เซอร์ได้เลย (ต้องต่ออินเทอร์เน็ตเพื่อโหลด d3.js และฟอนต์)

ถ้าแก้ข้อมูลแล้วต้องการสร้างไฟล์ข้อมูลใหม่:
```
pip install -r requirements.txt
python scripts/build_data.py
```

## เผยแพร่ด้วย GitHub Pages
1. สร้าง public repository บน GitHub แล้วอัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
2. ไปที่ Settings > Pages
3. เลือก Source เป็น "Deploy from a branch" เลือก branch `main` โฟลเดอร์ `/ (root)`
4. ลิงก์เว็บจะเป็น `https://USERNAME.github.io/REPO/` (ส่งต่อไป `web/d3/` อัตโนมัติ)

## ที่มาของข้อมูล
Online Shoppers Purchasing Intention Dataset (UCI Machine Learning Repository)
