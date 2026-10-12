'use strict';

// DeepSeek 金鑰只存在雲端函式，App 端不持有任何金鑰。
const { deepseekApiKey } = require('./config.js');

const MAX_TEXT_LENGTH = 8000;

const SYSTEM_PROMPT = [
  'You are a highly experienced medical professional specializing in decoding',
  'and interpreting prescriptions, patient notes, and unclear handwriting.',
  '',
  'Your task is to:',
  '0. Output language must match the input language.',
  '1. Identify and explain any medical terms, symptoms, or medications in the text.',
  '2. Describe each medication: purpose, common uses, and dosage (if available).',
  '3. Ignore unrelated content (patient names, dates) unless medically relevant.',
  '4. Output only the interpreted medical content in a clear, concise format.'
].join('\n');

/**
 * 處方 OCR 文字解讀
 * @param {object} event - 透過uniCloud.callFunction呼叫雲端函式時傳入的data物件
 * @param {string} event.text - OCR 辨識出的文字，必傳參數
 * @return {Promise<{content: string}>}
 */
exports.main = async (event) => {
  const text = typeof event.text === 'string' ? event.text.trim() : '';
  if (!text) {
    throw new Error('缺少 OCR 文字');
  }
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`OCR 文字過長（上限 ${MAX_TEXT_LENGTH} 字）`);
  }

  const res = await uniCloud.httpclient.request('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${deepseekApiKey}` },
    contentType: 'json',
    dataType: 'json',
    timeout: 55000,
    data: {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please decode and analyze the following text:\n${text}` }
      ],
      stream: false
    }
  });

  if (res.status !== 200) {
    throw new Error(`DeepSeek API 錯誤（${res.status}）`);
  }
  const content = res.data && res.data.choices && res.data.choices[0]
    && res.data.choices[0].message && res.data.choices[0].message.content;
  if (!content) {
    throw new Error('DeepSeek API 回傳格式異常');
  }
  return { content };
};
