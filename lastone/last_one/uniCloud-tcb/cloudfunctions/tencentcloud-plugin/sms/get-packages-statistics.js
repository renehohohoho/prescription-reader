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
const { appId } = require('./config');

/**
 * 取得騰訊雲SMS產品套餐包狀態
 * @param {object} params - 參數包裝物件
 * @param {number} params.limit - 最大上限（需要拉取的套餐包個數）
 * @return {Promise<object>} 短訊套餐包狀態資訊，詳見文件 https://cloud.tencent.com/document/api/382/39533
 */
async function getPackagesStatistics({ limit = 10 }) {
  // 設定校驗
  if (!appId) {
    throw new Error('請在雲端函式SMS模組中設定appId');
  }
  // 呼叫騰訊雲查詢SMS狀態介面
  const result = await request('SmsPackagesStatistics', {
    SmsSdkAppid: appId,
    Limit: limit,
    Offset: 0
  });
  return result;
}

module.exports = getPackagesStatistics;
