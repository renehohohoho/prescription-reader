"""
Generate synthetic prescription images for testing the pipeline.
All names, hospitals and prescriptions are fictional.

Usage:
  python make_samples.py                  # writes data/samples/rx001.png ...
  python make_samples.py --output data/input
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_CANDIDATES = [
    "C:/Windows/Fonts/msjh.ttc",                               # Windows
    "/System/Library/Fonts/PingFang.ttc",                      # macOS
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",  # Linux
]

SAMPLES = [
    {
        "hospital": "範例市立聯合醫院",
        "date": "2026-01-15",
        "patient": "王小明",
        "doctor": "陳大文",
        "diagnosis": "急性上呼吸道感染",
        "medications": [
            ("Amoxicillin 500mg", "每日三次", "7 天", "口服"),
            ("Acetaminophen 500mg", "需要時服用", "3 天", "口服"),
        ],
        "notes": "多喝水，多休息",
    },
    {
        "hospital": "示範紀念醫院",
        "date": "2026-02-03",
        "patient": "林美華",
        "doctor": "張志強",
        "diagnosis": "原發性高血壓",
        "medications": [
            ("Amlodipine 5mg", "每日一次", "28 天", "口服"),
            ("Losartan 50mg", "每日一次", "28 天", "口服"),
        ],
        "notes": "每日早晚量測血壓",
    },
    {
        "hospital": "範例市立聯合醫院",
        "date": "2026-02-20",
        "patient": "黃建國",
        "doctor": "陳大文",
        "diagnosis": "第二型糖尿病",
        "medications": [
            ("Metformin 500mg", "每日兩次", "30 天", "口服"),
            ("Atorvastatin 20mg", "每日一次", "30 天", "口服"),
            ("Aspirin 100mg", "每日一次", "30 天", "口服"),
        ],
        "notes": "飯後服用，三個月後回診",
    },
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in FONT_CANDIDATES:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    raise SystemExit("找不到支援繁體中文的字型，請在 FONT_CANDIDATES 加入字型路徑")


def render(sample: dict) -> Image.Image:
    title_font, body_font = load_font(44), load_font(30)
    lines = [
        f"病患姓名：{sample['patient']}",
        f"處方日期：{sample['date']}",
        f"醫師：{sample['doctor']}",
        f"診斷：{sample['diagnosis']}",
        "",
        "處方藥品：",
    ]
    for i, (name, frequency, duration, route) in enumerate(sample["medications"], 1):
        lines.append(f"{i}. {name}  {route}  {frequency}  {duration}")
    lines += ["", f"醫囑：{sample['notes']}"]

    image = Image.new("RGB", (1200, 220 + 56 * len(lines)), "white")
    draw = ImageDraw.Draw(image)
    draw.text((60, 50), f"{sample['hospital']}  處方箋", font=title_font, fill="black")
    draw.line([(60, 125), (1140, 125)], fill="black", width=3)
    for i, line in enumerate(lines):
        draw.text((60, 160 + 56 * i), line, font=body_font, fill="black")
    return image


def main():
    parser = argparse.ArgumentParser(description="Synthetic prescription image generator")
    parser.add_argument("--output", default="data/samples", help="Output folder")
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.mkdir(parents=True, exist_ok=True)
    for i, sample in enumerate(SAMPLES, 1):
        target = output_path / f"rx{i:03d}.png"
        render(sample).save(target)
        print(f"  {target}")


if __name__ == "__main__":
    main()
