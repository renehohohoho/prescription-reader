# prescription-reader

醫療處方圖像辨識與結構化分析工具，供資料分析師批次處理處方影像並進行統計分析。

## 架構

```
prescription-reader/
├── processor.py          # 核心管線：圖像 → OCR → LLM → 結構化 dict
├── batch_process.py      # 批次 CLI：資料夾 → CSV / Excel
├── dashboard.py          # Streamlit 分析儀表板
├── make_samples.py       # 產生合成處方圖（data/samples）
├── config.py             # API 金鑰與設定（不進版本控制）
├── config.example.py     # 設定範本
├── requirements.txt
├── requirements-dev.txt  # 加上 pytest
├── data/
│   ├── input/            # 放置處方圖片（jpg/png）
│   ├── output/           # 批次輸出的 CSV / Excel
│   └── samples/          # 合成範例處方圖
├── tests/                # pytest 單元測試（不呼叫 API）
├── OCR train/            # PyTorch 文字辨識訓練程式
├── lastone/last_one/     # uni-app 手機 App（OCR 與 DeepSeek 皆走 uniCloud 雲端函式）
└── notebooks/
    └── analysis.ipynb    # EDA 分析 Notebook
```

## 資料流

```
data/input/*.jpg
    ↓  EasyOCR（繁中 + 英文）
    OCR 文字
    ↓  DeepSeek Chat（結構化提取 prompt）
    {patient, doctor, hospital, date, diagnosis, medications[]}
    ↓  batch_process.py 攤平（每藥一列）
    data/output/prescriptions_YYYYMMDD_HHMMSS.csv / .xlsx
```

## 快速開始

```bash
py -3.13 -m venv .venv              # 使用專案自己的 venv（Python 3.13）
pip install -r requirements-dev.txt
cp config.example.py config.py      # 填入 DEEPSEEK_API_KEY

# 單元測試
pytest

# 單張測試（合成範例）
python processor.py data/samples/rx001.png

# 批次處理
python batch_process.py --input data/input --output data/output

# 啟動儀表板
streamlit run dashboard.py

# Jupyter 分析
jupyter notebook notebooks/analysis.ipynb
```

## 輸出 CSV 欄位

| 欄位 | 說明 |
|------|------|
| source_file | 來源圖片檔名 |
| patient_name | 病患姓名 |
| doctor_name | 醫師姓名 |
| hospital | 醫療機構 |
| prescription_date | 處方日期 |
| diagnosis | 診斷 |
| prescription_notes | 其他醫囑 |
| med_name | 藥品名稱 |
| dosage | 劑量 |
| frequency | 給藥頻次 |
| duration_days | 療程天數 |
| route | 給藥途徑 |
| med_notes | 單一藥品備註 |
| ocr_raw | OCR 原始文字 |

## 設定說明（config.py）

| 參數 | 說明 |
|------|------|
| DEEPSEEK_API_KEY | DeepSeek API 金鑰 |
| OCR_LANGUAGES | EasyOCR 語言，預設 `["ch_tra", "en"]` |
| OCR_GPU | True 可大幅加速，需 CUDA |
| INPUT_DIR / OUTPUT_DIR | 預設資料夾路徑 |

## 注意事項

- `config.py` 已列入 `.gitignore`，**勿提交 API 金鑰**
- **勿提交 APK 等編譯產物**：打包檔會內嵌建置當下的設定；App 端不得持有金鑰，DeepSeek 一律經 `deepseek-chat` 雲端函式呼叫
- EasyOCR 首次執行會下載語言模型（約 500 MB）
- 手寫處方辨識率取決於字跡清晰度；建議以高解析度掃描輸入
