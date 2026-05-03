<template>
  <view class="container">
    <view class="header">
      <text class="title">處方辨識助手</text>
      <text class="subtitle">拍照或選取處方圖片，AI 自動辨識並解讀</text>
    </view>

    <view class="btn-group">
      <button
        class="btn btn-primary"
        @click="processImage('handwriting')"
        :disabled="isLoading"
      >英文 / 手寫體辨識</button>
      <button
        class="btn btn-secondary"
        @click="processImage('basic')"
        :disabled="isLoading"
      >少數民族語言辨識</button>
      <button
        class="btn btn-clear"
        v-if="imageSrc || ocrResult.length || deepSeekResult"
        @click="clearResult"
        :disabled="isLoading"
      >清除結果</button>
    </view>

    <view v-if="isLoading" class="loading-bar">
      <text class="loading-text">{{ loadingText }}</text>
    </view>

    <image
      v-if="imageSrc"
      :src="imageSrc"
      mode="widthFix"
      class="preview-image"
    />

    <view v-if="ocrResult.length" class="result-card">
      <text class="card-title">OCR 辨識結果</text>
      <view class="ocr-lines">
        <text
          v-for="(item, index) in ocrResult"
          :key="index"
          class="ocr-line"
        >{{ item.DetectedText }}</text>
      </view>
    </view>

    <view v-if="deepSeekResult" class="result-card">
      <text class="card-title">AI 醫療解讀</text>
      <zero-markdown-view :markdown="deepSeekResult" class="markdown-view" />
    </view>
  </view>
</template>

<script>
import { generalHandwritingOCR, generalBasicOCR } from '@/js_sdk/tencentcloud-plugin-ocr';
import config from '@/config.js';

export default {
  data() {
    return {
      imageSrc: '',
      ocrResult: [],
      deepSeekResult: '',
      isLoading: false,
      loadingText: ''
    };
  },
  methods: {
    clearResult() {
      this.imageSrc = '';
      this.ocrResult = [];
      this.deepSeekResult = '';
    },

    async processImage(ocrMode) {
      let filePath, base64;
      try {
        ({ filePath, base64 } = await this.chooseImageToBase64());
      } catch (err) {
        if (err && err.message === 'cancelled') return;
        uni.showToast({ title: (err && err.message) || '選取圖片失敗', icon: 'none', duration: 3000 });
        return;
      }

      this.imageSrc = filePath;
      this.ocrResult = [];
      this.deepSeekResult = '';
      this.isLoading = true;

      try {
        this.loadingText = 'OCR 辨識中，請稍候…';
        const ocrFn = ocrMode === 'handwriting' ? generalHandwritingOCR : generalBasicOCR;
        const { result } = await ocrFn({ imageBase64: base64 });
        this.ocrResult = result.TextDetections || [];

        if (this.ocrResult.length === 0) {
          uni.showToast({ title: '未辨識到文字，請嘗試更清晰的圖片', icon: 'none', duration: 3000 });
          return;
        }

        const rawText = this.ocrResult.map(item => item.DetectedText).join(' ');
        this.loadingText = 'AI 解讀中，請稍候…';
        await this.callDeepSeekAPI(rawText);
      } catch (err) {
        const msg = (err && err.message) ? err.message : '處理失敗，請重試';
        uni.showToast({ title: msg, icon: 'none', duration: 3000 });
      } finally {
        this.isLoading = false;
        this.loadingText = '';
      }
    },

    callDeepSeekAPI(userMessage) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://api.deepseek.com/chat/completions',
          method: 'POST',
          timeout: 60000,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.deepseekApiKey}`
          },
          data: {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: [
                  'You are a highly experienced medical professional specializing in decoding',
                  'and interpreting prescriptions, patient notes, and unclear handwriting.',
                  '',
                  'Your task is to:',
                  '0. Output language must match the input language.',
                  '1. Identify and explain any medical terms, symptoms, or medications in the text.',
                  '2. Describe each medication: purpose, common uses, and dosage (if available).',
                  '3. Ignore unrelated content (patient names, dates) unless medically relevant.',
                  '4. Output only the interpreted medical content in a clear, concise format.'
                ].join('\n')
              },
              {
                role: 'user',
                content: `Please decode and analyze the following text:\n${userMessage}`
              }
            ],
            stream: false
          },
          success: (res) => {
            if (res.statusCode === 200) {
              const content = res.data?.choices?.[0]?.message?.content;
              if (!content) {
                reject(new Error('DeepSeek API 回傳格式異常'));
                return;
              }
              this.deepSeekResult = content;
              resolve(this.deepSeekResult);
            } else {
              reject(new Error(`DeepSeek API 錯誤（${res.statusCode}）`));
            }
          },
          fail: (err) => {
            reject(new Error(`網路請求失敗：${err.errMsg}`));
          }
        });
      });
    },

    chooseImageToBase64() {
      return new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          success: (res) => {
            const filePath = res.tempFilePaths[0];

            // #ifdef APP-PLUS
            const readFile = () => {
              plus.io.resolveLocalFileSystemURL(
                filePath,
                (entry) => {
                  entry.file((file) => {
                    const reader = new plus.io.FileReader();
                    reader.onloadend = (e) => {
                      const base64 = e.target.result.split(',')[1];
                      resolve({ filePath, base64 });
                    };
                    reader.onerror = () => reject(new Error('圖片讀取失敗'));
                    reader.readAsDataURL(file);
                  });
                },
                () => reject(new Error('檔案存取失敗'))
              );
            };

            if (typeof plus !== 'undefined') {
              readFile();
            } else {
              const onPlusReady = () => {
                document.removeEventListener('plusready', onPlusReady, false);
                readFile();
              };
              document.addEventListener('plusready', onPlusReady, false);
            }
            // #endif

            // #ifndef APP-PLUS
            reject(new Error('僅支援 App 平台'));
            // #endif
          },
          fail: (err) => {
            const msg = (err && err.errMsg) || '';
            if (msg.toLowerCase().includes('cancel')) {
              reject(new Error('cancelled'));
            } else {
              reject(new Error(msg || '選取圖片失敗'));
            }
          }
        });
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #1a1a2e;
}

.subtitle {
  display: block;
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  border-radius: 10px;
  font-size: 16px;
  padding: 14px 0;
  border: none;
}

.btn[disabled] {
  opacity: 0.5;
}

.btn-primary {
  background-color: #1a73e8;
  color: #fff;
}

.btn-secondary {
  background-color: #34a853;
  color: #fff;
}

.btn-clear {
  background-color: #ea4335;
  color: #fff;
  font-size: 14px;
  padding: 10px 0;
}

.loading-bar {
  text-align: center;
  padding: 14px;
  background-color: #fff3cd;
  border-radius: 8px;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #856404;
}

.preview-image {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 16px;
}

.result-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.card-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.ocr-lines {
  border-left: 3px solid #1a73e8;
  padding-left: 12px;
}

.ocr-line {
  display: block;
  font-size: 14px;
  color: #444;
  line-height: 1.7;
}

.markdown-view {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
}
</style>
