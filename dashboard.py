"""
Streamlit dashboard for prescription data analysis.

Usage:
  streamlit run dashboard.py
  streamlit run dashboard.py -- --data data/output/prescriptions_xxx.csv
"""

import argparse
import sys
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st

# ── CLI argument for pre-selecting a CSV ─────────────────────────────────────
parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("--data", default=None)
args, _ = parser.parse_known_args()

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(page_title="處方分析儀表板", page_icon="💊", layout="wide")
st.title("💊 處方資料分析儀表板")


# ── Data loading ──────────────────────────────────────────────────────────────
@st.cache_data
def load_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, encoding="utf-8-sig")
    df["prescription_date"] = pd.to_datetime(df["prescription_date"], errors="coerce")
    return df


output_dir = Path("data/output")
csv_files = sorted(output_dir.glob("prescriptions_*.csv"), reverse=True) if output_dir.exists() else []

if args.data:
    selected_path = args.data
elif csv_files:
    options = {f.name: str(f) for f in csv_files}
    selected_name = st.sidebar.selectbox("選擇資料檔", list(options.keys()))
    selected_path = options[selected_name]
else:
    st.info("尚無資料。請先執行 `python batch_process.py` 產生 CSV 檔案。")
    st.stop()

df = load_csv(selected_path)
st.sidebar.markdown(f"**資料筆數：** {len(df)} 筆藥品記錄  \n**處方數：** {df['source_file'].nunique()}")

# ── Filters ───────────────────────────────────────────────────────────────────
with st.sidebar.expander("篩選條件"):
    hospitals = ["全部"] + sorted(df["hospital"].dropna().unique().tolist())
    sel_hospital = st.selectbox("醫院", hospitals)
    date_range = st.date_input("日期範圍", value=[], key="date_range")

if sel_hospital != "全部":
    df = df[df["hospital"] == sel_hospital]
if len(date_range) == 2:
    df = df[df["prescription_date"].between(pd.Timestamp(date_range[0]), pd.Timestamp(date_range[1]))]

# ── KPI row ───────────────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)
c1.metric("處方總數", df["source_file"].nunique())
c2.metric("藥品種類", df["med_name"].nunique())
c3.metric("涉及醫院", df["hospital"].nunique())
c4.metric("涉及醫師", df["doctor_name"].nunique())

st.divider()

# ── Charts ────────────────────────────────────────────────────────────────────
col_left, col_right = st.columns(2)

with col_left:
    st.subheader("最常見藥品 Top 20")
    med_counts = (
        df["med_name"].dropna().value_counts().head(20).reset_index()
    )
    med_counts.columns = ["藥品名稱", "處方次數"]
    fig = px.bar(med_counts, x="處方次數", y="藥品名稱", orientation="h",
                 color="處方次數", color_continuous_scale="Blues")
    fig.update_layout(yaxis={"categoryorder": "total ascending"}, showlegend=False,
                      coloraxis_showscale=False, height=500)
    st.plotly_chart(fig, use_container_width=True)

with col_right:
    st.subheader("診斷分布 Top 15")
    diag_counts = (
        df.drop_duplicates("source_file")["diagnosis"]
        .dropna().value_counts().head(15).reset_index()
    )
    diag_counts.columns = ["診斷", "次數"]
    fig2 = px.pie(diag_counts, names="診斷", values="次數", hole=0.4)
    fig2.update_traces(textposition="inside", textinfo="percent+label")
    fig2.update_layout(height=500, showlegend=False)
    st.plotly_chart(fig2, use_container_width=True)

# ── Time series ───────────────────────────────────────────────────────────────
st.subheader("每月處方量趨勢")
monthly = (
    df.dropna(subset=["prescription_date"])
    .drop_duplicates("source_file")
    .set_index("prescription_date")
    .resample("ME")["source_file"]
    .count()
    .reset_index()
)
monthly.columns = ["月份", "處方數"]
if not monthly.empty:
    fig3 = px.line(monthly, x="月份", y="處方數", markers=True)
    st.plotly_chart(fig3, use_container_width=True)
else:
    st.info("日期資料不足，無法顯示趨勢。")

# ── Frequency analysis ────────────────────────────────────────────────────────
st.subheader("給藥頻次分布")
freq_counts = df["frequency"].dropna().value_counts().head(10).reset_index()
freq_counts.columns = ["頻次", "次數"]
if not freq_counts.empty:
    fig4 = px.bar(freq_counts, x="頻次", y="次數", color="次數",
                  color_continuous_scale="Greens")
    fig4.update_layout(coloraxis_showscale=False)
    st.plotly_chart(fig4, use_container_width=True)

# ── Raw data table ────────────────────────────────────────────────────────────
with st.expander("原始資料表"):
    display_cols = ["source_file", "prescription_date", "patient_name",
                    "doctor_name", "hospital", "diagnosis",
                    "med_name", "dosage", "frequency", "duration_days"]
    st.dataframe(df[[c for c in display_cols if c in df.columns]], use_container_width=True)
