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

/**
 * 取得基礎語音合成結果
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/1073/37995
 * @param {object} params - 參數包裝物件
 * @param {object} param - 語音合成介面相關參數
 * @return {Promise<object>} 合成結果
 */
async function getTtsResult({ param }) {
  // 呼叫騰訊雲基礎語音合成介面
  const result = await request('TextToVoice', param);

  return result;
}

module.exports = {
  getTtsResult
};
