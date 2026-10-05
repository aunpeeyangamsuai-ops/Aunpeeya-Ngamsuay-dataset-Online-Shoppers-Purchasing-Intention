"""แปลงข้อมูลที่ทำความสะอาดแล้ว (CSV) เป็นไฟล์ web/d3/data/shoppers.js สำหรับหน้าเว็บ
วิธีรัน: python scripts/build_data.py
"""
import json
import pandas as pd

SRC = "data/cleaned/online_shoppers_cleaned.csv"
OUT = "web/d3/data/shoppers.js"

d = pd.read_csv(SRC)
rows = [
    dict(
        m=int(r.month_num),                      # เดือน (เลข)
        v=r.visitor_type,                        # ประเภทผู้เยี่ยมชม
        r=int(r.region_code),                    # รหัสโซน/ภูมิภาค
        d=round(r.total_duration_sec / 60, 2),   # เวลาที่อยู่ในเว็บ (นาที)
        p=round(r.page_value, 2),                # page value
        b=int(r.purchased),                      # 1 = ซื้อ, 0 = ไม่ซื้อ
    )
    for r in d.itertuples()
]
with open(OUT, "w", encoding="utf-8") as f:
    f.write("const DATA=" + json.dumps(rows, separators=(",", ":")) + ";\n")
print(f"เขียน {len(rows):,} แถวไปที่ {OUT}")
