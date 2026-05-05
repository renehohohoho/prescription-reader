"""
Batch process all prescription images in a folder.

Usage:
  python batch_process.py                         # uses config.INPUT_DIR
  python batch_process.py --input data/input      # custom input folder
  python batch_process.py --input img/ --output results/
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

import pandas as pd
from tqdm import tqdm

import config
from processor import process

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}


def flatten_record(record: dict) -> list[dict]:
    """Expand medications list into one row per medication."""
    base = {
        "source_file": record.get("source_file"),
        "patient_name": record.get("patient_name"),
        "doctor_name": record.get("doctor_name"),
        "hospital": record.get("hospital"),
        "prescription_date": record.get("prescription_date"),
        "diagnosis": record.get("diagnosis"),
        "prescription_notes": record.get("notes"),
        "ocr_raw": record.get("ocr_raw"),
    }
    medications = record.get("medications") or []
    if not medications:
        return [{**base, "med_name": None, "dosage": None, "frequency": None,
                 "duration_days": None, "route": None, "med_notes": None}]
    rows = []
    for med in medications:
        rows.append({
            **base,
            "med_name": med.get("name"),
            "dosage": med.get("dosage"),
            "frequency": med.get("frequency"),
            "duration_days": med.get("duration_days"),
            "route": med.get("route"),
            "med_notes": med.get("notes"),
        })
    return rows


def run(input_dir: str, output_dir: str):
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    images = [f for f in input_path.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS]
    if not images:
        print(f"No images found in {input_path}")
        sys.exit(1)

    print(f"Found {len(images)} image(s) in {input_path}")

    all_rows = []
    errors = []

    for img in tqdm(images, desc="Processing"):
        try:
            record = process(str(img))
            all_rows.extend(flatten_record(record))
        except Exception as e:
            errors.append({"file": img.name, "error": str(e)})
            tqdm.write(f"  ERROR {img.name}: {e}")

    if not all_rows:
        print("No records extracted.")
        sys.exit(1)

    df = pd.DataFrame(all_rows)

    # Normalise prescription_date column
    df["prescription_date"] = pd.to_datetime(df["prescription_date"], errors="coerce")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = output_path / f"prescriptions_{timestamp}.csv"
    xlsx_path = output_path / f"prescriptions_{timestamp}.xlsx"

    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    with pd.ExcelWriter(xlsx_path, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Prescriptions", index=False)
        if errors:
            pd.DataFrame(errors).to_excel(writer, sheet_name="Errors", index=False)

    print(f"\nDone. {len(df)} rows extracted from {len(images) - len(errors)} file(s).")
    print(f"  CSV  → {csv_path}")
    print(f"  XLSX → {xlsx_path}")
    if errors:
        print(f"  Errors: {len(errors)} file(s) failed (see Errors sheet)")


def main():
    parser = argparse.ArgumentParser(description="Batch prescription image processor")
    parser.add_argument("--input", default=config.INPUT_DIR, help="Input image folder")
    parser.add_argument("--output", default=config.OUTPUT_DIR, help="Output folder")
    args = parser.parse_args()
    run(args.input, args.output)


if __name__ == "__main__":
    main()
