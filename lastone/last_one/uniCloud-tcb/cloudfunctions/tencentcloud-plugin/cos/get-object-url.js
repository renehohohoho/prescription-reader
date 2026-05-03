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
const { secretId, secretKey } = require('../config');
const { bucket, region, expires } = require('./config');

/**
 * 取得騰訊雲 COS 檔案的臨時存取網址
 * @param {object} params - 參數包裝物件
 * @param {string} params.key - 即將存取的 COS 檔案名稱
 * @return {string} COS 檔案的存取網址（含臨時簽名）
 */
function getObjectURL({ key }) {
  // 設定校驗
  if (!secretId || !secretKey) {
    throw new Error('請在雲端函式設定檔中填寫 secretId 和 secretKey');
  }
  if (!bucket || !region) {
    throw new Error('請在雲端函式 COS 模組中設定 bucket 和 region');
  }
  if (isNaN(expires) || expires <= 0) {
    throw new Error('請在雲端函式 COS 模組中設定有效的 expires');
  }
  // 產生簽名資訊
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + expires * 1000);
  const keyTime = `${Math.floor(currentDate.getTime() / 1000)};${Math.floor(expirationDate.getTime() / 1000)}`;
  const signKey = crypto.createHmac('sha1', secretKey).update(keyTime).digest('hex');
  const httpString = `get\n/${key}\n\n\n`;
  const httpStringHash = crypto.createHash('sha1').update(httpString).digest('hex');
  const stringToSign = `sha1\n${keyTime}\n${httpStringHash}\n`;
  const signature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');
  return (
    /* prettier-ignore */
    `https://${bucket}.cos.${region}.myqcloud.com/${key}`
    + `?q-sign-algorithm=sha1`
    + `&q-ak=${secretId}`
    + `&q-sign-time=${keyTime}`
    + `&q-key-time=${keyTime}`
    + `&q-header-list=`
    + `&q-url-param-list=`
    + `&q-signature=${signature}`
  );
}

module.exports = getObjectURL;
