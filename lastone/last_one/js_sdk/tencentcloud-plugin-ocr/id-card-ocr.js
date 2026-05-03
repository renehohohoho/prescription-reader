/*
 * Copyright (C) 2020 Tencent Cloud.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 卡證文字-身份證識別 https://cloud.tencent.com/document/product/866/33524
 * @param {object} params - 參數包裝物件
 * @param {string} params.imageBase64 - 需要識別圖片的base64編碼
 * @param {string} params.imageUrl - 需要識別圖片的url
 * @param {string} params.cardSide - FRONT：身份證有照片的一面（人像面），BACK：身份證有國徽的一面（國徽面），該參數如果不填，將為您自動判斷身份證正反面。
 * @param {string} params.config - 可選欄位，具體參照身份證識別文件
 * @returns {Promise<object>} - 檢測到的卡證資訊
 */
import ocr from './api.js';
export default function idCardOCR({ imageBase64, imageUrl, cardSide, config }) {
  return ocr.iDCardOCR({ imageBase64, imageUrl, cardSide, config });
}
