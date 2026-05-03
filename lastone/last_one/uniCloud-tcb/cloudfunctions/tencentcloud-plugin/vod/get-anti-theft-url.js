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

const crypto = require('crypto');
const { antiTheftKey, antiTheftExpires } = require('./config');

/**
 * 取得雲點播檔案防盜鏈連結
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/266/14047
 * @param {object} params - 參數包裝物件
 * @param {string} params.mediaUrl - 雲點播檔案地址
 * @return {string} 雲點播檔案完整url（包含簽名）
 */
function getAntiTheftURL({ mediaUrl }) {
  // 設定校驗
  if (!antiTheftKey) {
    throw new Error('請在雲端函式VOD模組中設定有效的antiTheftKey');
  }
  if (isNaN(antiTheftExpires) || antiTheftExpires <= 0) {
    throw new Error('請在雲端函式VOD模組中設定有效的antiTheftExpires');
  }
  // 生成包含簽名的url
  const result = new RegExp('^https?://[^/]*(.*/)[^/]*$').exec(mediaUrl);
  if (!result) {
    throw new Error('無效的媒體檔案Url');
  }
  const dir = result[1];
  const t = Math.floor(new Date().getTime() / 1000 + antiTheftExpires * 60).toString(16);
  const sign = crypto.createHash('md5').update(`${antiTheftKey}${dir}${t}`).digest('hex');
  return `${mediaUrl}?t=${t}&sign=${sign}`;
}

module.exports = getAntiTheftURL;
