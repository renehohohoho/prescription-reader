from batch_process import flatten_record

BASE = {
    "source_file": "rx001.png",
    "patient_name": "王小明",
    "doctor_name": "陳大文",
    "hospital": "範例醫院",
    "prescription_date": "2026-01-15",
    "diagnosis": "上呼吸道感染",
    "notes": "多喝水",
    "ocr_raw": "raw text",
}


def test_one_row_per_medication():
    record = {
        **BASE,
        "medications": [
            {"name": "Amoxicillin", "dosage": "500mg", "frequency": "每日三次",
             "duration_days": 7, "route": "口服", "notes": "飯後"},
            {"name": "Acetaminophen", "dosage": "500mg", "frequency": "需要時",
             "duration_days": 3, "route": "口服", "notes": None},
        ],
    }
    rows = flatten_record(record)

    assert [r["med_name"] for r in rows] == ["Amoxicillin", "Acetaminophen"]
    assert rows[0]["med_notes"] == "飯後"
    assert rows[0]["duration_days"] == 7
    for row in rows:
        assert row["source_file"] == "rx001.png"
        assert row["patient_name"] == "王小明"
        assert row["prescription_notes"] == "多喝水"


def test_no_medications_keeps_one_row():
    for meds in ([], None):
        rows = flatten_record({**BASE, "medications": meds})
        assert len(rows) == 1
        assert rows[0]["med_name"] is None
        assert rows[0]["hospital"] == "範例醫院"


def test_missing_keys_become_none():
    rows = flatten_record({"medications": [{"name": "Ibuprofen"}]})
    assert rows == [{
        "source_file": None, "patient_name": None, "doctor_name": None,
        "hospital": None, "prescription_date": None, "diagnosis": None,
        "prescription_notes": None, "ocr_raw": None,
        "med_name": "Ibuprofen", "dosage": None, "frequency": None,
        "duration_days": None, "route": None, "med_notes": None,
    }]


def test_empty_and_full_rows_share_columns():
    empty = flatten_record({**BASE, "medications": []})[0]
    full = flatten_record({**BASE, "medications": [{"name": "X"}]})[0]
    assert list(empty) == list(full)
