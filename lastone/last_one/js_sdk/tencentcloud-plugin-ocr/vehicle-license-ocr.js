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
 * 汽車場景-行駛證識別（預設為主頁） https://cloud.tencent.com/document/product/866/36209
 * @param {object} params - 參數包裝物件
 * @param {string} params.imageBase64 - 需要識別圖片的base64編碼
 * @param {string} params.imageUrl - 需要識別圖片的url
 * @param {string} [params.cardSide] - FRONT 為行駛證主頁正面（有紅色印章的一面），BACK 為行駛證副頁正面（有號碼號牌的一面）。
 * @returns {Promise<object>}  - 汽車場景識別結果
 */
import ocr from "./api.js";
export default function vehicleLicenseOCR({ imageBase64, imageUrl, cardSide }) {
  return ocr.vehicleLicenseOCR({ imageBase64, imageUrl, cardSide });
}
