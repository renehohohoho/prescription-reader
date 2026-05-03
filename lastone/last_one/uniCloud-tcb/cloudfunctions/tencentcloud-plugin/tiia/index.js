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

'use strict';
const { request } = require('./utils.js');

/**
 * 取得圖像識別結果
 * @param {object} params - 參數包裝物件
 * @param {string} params.name - 對應圖像識別 API的Action值 https://cloud.tencent.com/document/product/865/35462
 * @param {object} params.payload - API所需的參數
 * @param {string} [params.payload.ImageBase64] - 圖片的 Base64 值。支援的圖片格式：PNG、JPG、JPEG，暫不支援 GIF 格式。支援的圖片大小：所下載圖片經 Base64 編碼後不超過 3M。圖片下載時間不超過 3 秒。
 * @param {string} [params.payload.ImageUrl] - 圖片的 Url 地址。支援的圖片格式：PNG、JPG、JPEG，暫不支援 GIF 格式。支援的圖片大小：所下載圖片經 Base64 編碼後不超過 3M。圖片下載時間不超過 3 秒。
 * @returns {object} API回傳的有效資料
 */
async function getTiiaResult(params) {
  if (!params.name) {
    throw new Error('缺少API Action參數');
  }
  if (!(params.payload.ImageBase64 || params.payload.ImageUrl)) {
    throw new Error('ImageUrl 和 ImageBase64 必須有一個不為空');
  }
  // 呼叫圖像識別介面
  const result = await request(params.name, params.payload);
  return result;
}

module.exports = { getTiiaResult };
