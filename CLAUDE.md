# prescription-reader

醫療處方圖像辨識與結構化分析工具，供資料分析師批次處理處方影像並進行統計分析。

## 架構

```
prescription-reader/
├── processor.py          # 核心管線：圖像 → OCR → LLM → 結構化 dict
├── batch_process.py      # 批次 CLI：資料夾 → CSV / Excel
├── dashboard.py          # Streamlit 分析儀表板
├── config.py             # API 金鑰與設定（不進版本控制）
├── config.example.py     # 設定範本
├── requirements.txt
├── data/
│   ├── input/            # 放置處方圖片（jpg/png）
│   └── output/           # 批次輸出的 CSV / Excel
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
pip install -r requirements.txt
cp config.example.py config.py      # 填入 DEEPSEEK_API_KEY

# 單張測試
python processor.py data/samples/rx001.jpg

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
| med_name | 藥品名稱 |
| dosage | 劑量 |
| frequency | 給藥頻次 |
| duration_days | 療程天數 |
| route | 給藥途徑 |
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
- EasyOCR 首次執行會下載語言模型（約 500 MB）
- 手寫處方辨識率取決於字跡清晰度；建議以高解析度掃描輸入
