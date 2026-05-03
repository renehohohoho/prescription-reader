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

const { verificationCodeCollection, verificationCodeExpires, verificationCodeCheckTimes } = require('./config');

/**
 * 校驗驗證碼是否正確
 * @async
 * @param {object} params - 參數包裝物件
 * @param {string} params.phoneNumber - 手機號碼
 * @param {string} params.verificationCode - 使用者輸入的驗證碼
 * @return {Promise<void>} 驗證碼核驗狀態（無異常代表正確）
 */
async function checkVerificationCode({ phoneNumber, verificationCode }) {
  // 設定校驗
  if (!verificationCodeCollection) {
    throw new Error('請在雲端函式SMS模組中設定verificationCodeCollection');
  }
  if (!verificationCodeExpires || isNaN(verificationCodeExpires) || verificationCodeExpires <= 0) {
    throw new Error('請在雲端函式SMS模組中設定有效的verificationCodeExpires');
  }
  if (!verificationCodeCheckTimes || isNaN(verificationCodeCheckTimes) || verificationCodeCheckTimes <= 0) {
    throw new Error('請在雲端函式SMS模組中設定有效的verificationCodeCheckTimes');
  }
  // 參數校驗
  if (!phoneNumber) {
    throw new Error('手機號碼不得為空');
  }
  if (!verificationCode) {
    throw new Error('驗證碼不得為空');
  }
  // 自動為無前綴手機號碼添加+86前綴
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = `+86${phoneNumber}`;
  }
  const db = uniCloud.database();
  const verificationCodes = db.collection(verificationCodeCollection);
  // 清理過期驗證碼記錄
  const result = await verificationCodes
    .where({
      createTime: db.command.lt(new Date().getTime() - verificationCodeExpires * 60 * 1000)
    })
    .remove();
  if (result.deleted) {
    console.log(`已自動清理掉${result.deleted}條過期記錄`);
  }
  // 驗證碼查詢並核對
  const {
    data: [record]
  } = await verificationCodes
    .where({
      phoneNumber
    })
    .orderBy('createTime', 'desc')
    .limit(1)
    .get();
  if (!record) {
    throw new Error('驗證碼不正確');
  }
  // 每個驗證碼僅支持核驗有限次數（防止字典遍歷）
  if (record.checkCounter >= verificationCodeCheckTimes) {
    throw new Error('驗證碼不正確');
  }
  // 增加驗證碼核驗次數
  if (record.verificationCode !== verificationCode) {
    await verificationCodes.doc(record._id).update({
      checkCounter: record.checkCounter + 1
    });
    throw new Error('驗證碼不正確');
  }
  // 驗證成功後非同步刪除驗證碼記錄
  try {
    verificationCodes
      .where({
        phoneNumber
      })
      .remove();
  } catch (error) {
    console.log(error);
  }
}

module.exports = checkVerificationCode;
