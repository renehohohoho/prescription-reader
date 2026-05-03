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

const sendSMS = require('./send-sms');
const { verificationCodeCollection, verificationCodeTemplateId, verificationCodeLength } = require('./config');

/**
 * 發送簡訊驗證碼
 * @async
 * @param {object} params - 參數包裝物件
 * @param {string} params.phoneNumber - 手機號碼
 * @return {Promise<void>} 驗證碼發送狀態（無異常代表發送成功）
 */
async function sendVerificationCode({ phoneNumber }) {
  // 設定校驗
  if (!verificationCodeCollection) {
    throw new Error('請在雲端函式SMS模組中設定verificationCodeCollection');
  }
  if (!verificationCodeTemplateId) {
    throw new Error('請在雲端函式SMS模組中設定verificationCodeTemplateId');
  }
  if (isNaN(verificationCodeLength) || verificationCodeLength < 4 || verificationCodeLength > 8) {
    throw new Error('請在雲端函式SMS模組中設定有效的verificationCodeLength');
  }
  // 參數校驗
  if (!phoneNumber) {
    throw new Error('手機號碼不得為空');
  }
  // 自動為無前綴手機號碼添加+86前綴
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = `+86${phoneNumber}`;
  }
  // 生成隨機驗證碼並存入雲資料庫
  const verificationCode = `${Math.random()}`.substr(2, verificationCodeLength);
  const db = uniCloud.database();
  const verificationCodes = db.collection(verificationCodeCollection);
  await verificationCodes.add({
    phoneNumber,
    verificationCode,
    createTime: new Date().getTime(),
    checkCounter: 0
  });
  // 發送簡訊
  const { SendStatusSet } = await sendSMS({
    phoneNumbers: [phoneNumber],
    templateId: verificationCodeTemplateId,
    templateParams: [verificationCode]
  });
  if (SendStatusSet[0].Code !== 'Ok') {
    throw new Error(SendStatusSet[0].Message);
  }
}

module.exports = sendVerificationCode;
