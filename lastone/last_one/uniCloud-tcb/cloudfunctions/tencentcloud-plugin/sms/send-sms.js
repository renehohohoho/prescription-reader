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

const { request } = require('./utils');
const { appId, appSign } = require('./config');

/**
 * 發送簡訊
 * @param {object} params - 參數包裝物件
 * @param {string[]} params.phoneNumbers - 手機號碼清單
 * @param {string} params.templateId - 簡訊範本ID
 * @param {string[]} params.templateParams - 簡訊範本參數清單
 * @return {Promise<object>} 簡訊發送狀態資訊，詳見文件 https://cloud.tencent.com/document/api/382/38778
 */
async function sendSMS({ phoneNumbers, templateId, templateParams }) {
  // 設定校驗
  if (!appId || !appSign) {
    throw new Error('請在雲端函式SMS模組中設定appId和appSign');
  }
  // 呼叫騰訊雲發送SMS介面
  const result = await request('SendSms', {
    SmsSdkAppid: appId,
    Sign: appSign,
    PhoneNumberSet: phoneNumbers,
    TemplateID: templateId,
    TemplateParamSet: templateParams
  });
  return result;
}

module.exports = sendSMS;
