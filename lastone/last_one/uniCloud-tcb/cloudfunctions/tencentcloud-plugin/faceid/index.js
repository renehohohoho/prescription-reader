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
 * 取得人臉核身結果
 * @param {object} params - 參數包裝物件
 * @param {string} params.name - 人臉核身 API 的 Action 值 https://cloud.tencent.com/document/product/1007/31320
 * @param {object} params.payload - API 所需的參數
 * @return {Promise<object>} API 回傳資料
 */
async function getFaceidResult(params) {
  if (!params.name) {
    throw new Error('缺少 API Action 參數');
  }
  const result = await request(params.name, params.payload);
  return result;
}

module.exports = {
  getFaceidResult
};
