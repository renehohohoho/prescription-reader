"""
Core prescription processing pipeline.
Input: image path → Output: structured dict with extracted fields.
"""

import json
from pathlib import Path

try:
    import config
except ImportError:
    raise SystemExit("請先複製 config.example.py 為 config.py 並填入 API Key")

_reader = None
_client = None


def _get_reader():
    global _reader
    if _reader is None:
        import easyocr

        # verbose=False: the model-download progress bar crashes on non-UTF-8 consoles
        _reader = easyocr.Reader(config.OCR_LANGUAGES, gpu=config.OCR_GPU, verbose=False)
    return _reader


def _get_client():
    global _client
    if _client is None:
        from openai import OpenAI

        _client = OpenAI(
            api_key=config.DEEPSEEK_API_KEY,
            base_url=config.DEEPSEEK_BASE_URL,
        )
    return _client


def ocr_image(image_path: str) -> str:
    """Run EasyOCR and return concatenated text."""
    reader = _get_reader()
    results = reader.readtext(image_path, detail=0, paragraph=True)
    return "\n".join(results)


_SYSTEM_PROMPT = """你是一位醫療資料分析師。請從以下處方 OCR 文字中提取結構化資訊，
以 JSON 格式回傳，欄位如下：

{
  "patient_name": "string or null",
  "doctor_name": "string or null",
  "hospital": "string or null",
  "prescription_date": "YYYY-MM-DD or null",
  "diagnosis": "string or null",
  "medications": [
    {
      "name": "藥品名稱",
      "dosage": "劑量（如 500mg）",
      "frequency": "頻次（如 每日三次）",
      "duration_days": 整數或 null,
      "route": "給藥途徑（如 口服）or null",
      "notes": "備註 or null"
    }
  ],
  "notes": "其他醫囑 or null"
}

只回傳 JSON，不要加任何說明文字。無法判斷的欄位填 null。"""


def extract_fields(ocr_text: str) -> dict:
    """Send OCR text to DeepSeek and return structured dict."""
    response = _get_client().chat.completions.create(
        model=config.DEEPSEEK_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": ocr_text},
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )
    raw = (response.choices[0].message.content or "").strip()
    if not raw:
        raise ValueError("DeepSeek 回傳空白內容")
    try:
        fields = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"DeepSeek 回傳的不是合法 JSON：{e}") from e
    if not isinstance(fields, dict):
        raise ValueError("DeepSeek 回傳的 JSON 不是物件")
    return fields


def process(image_path: str) -> dict:
    """Full pipeline: image → structured dict."""
    path = Path(image_path)
    ocr_text = ocr_image(str(path))
    fields = extract_fields(ocr_text)
    fields["source_file"] = path.name
    fields["ocr_raw"] = ocr_text
    return fields


if __name__ == "__main__":
    import sys
    import pprint

    if len(sys.argv) < 2:
        print("Usage: python processor.py <image_path>")
        sys.exit(1)

    result = process(sys.argv[1])
    pprint.pprint(result)
