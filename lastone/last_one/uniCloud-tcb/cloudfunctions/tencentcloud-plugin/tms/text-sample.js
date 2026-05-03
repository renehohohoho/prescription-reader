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
 * 查詢文字樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/35618
 * @param {object} params - 參數包裝物件
 * @param {int} params.limit - 數量限制
 * @param {int} params.offset - 偏移量
 * @return {Promise<object>} 文字樣本的資訊
 */
async function listTextSample({ limit = 20, offset = 0 }) {
  // 呼叫騰訊雲介面
  const { TextSampleSet, TotalCount } = await request('DescribeTextSample', {
    Limit: limit,
    Offset: offset
  });
  return {
    TextSampleSet,
    TotalCount
  };
}

/**
 * 新增文字樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/35620
 * @param {object} params - 參數包裝物件
 * @param {string[]} params.contents - 關鍵詞數組
 * @param {string} params.evilType - 惡意類型
 * @param {string} params.label - 樣本類型 1：黑庫 2：白庫
 * @return {Promise<int>} 任務狀態
 */
async function createTextSample({ contents, evilType, label }) {
  if (!contents || !contents.length || !evilType || !label) {
    throw new Error('關鍵詞/惡意類型/樣本類型不得為空');
  }
  // 呼叫騰訊雲介面
  const { Progress } = await request('CreateTextSample', {
    Contents: contents,
    EvilType: evilType,
    Label: label
  });
  return Progress;
}

/**
 * 刪除文字樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/35619
 * @param {object} params - 參數包裝物件
 * @param {string[]} params.ids - 唯一標識數組
 * @return {Promise<int>} 任務狀態
 */
async function deleteTextSample({ ids }) {
  if (!ids || !ids.length) {
    throw new Error('唯一標識不得為空');
  }
  // 呼叫騰訊雲介面
  const { Progress } = await request('DeleteTextSample', {
    Ids: ids
  });
  return Progress;
}

module.exports = {
  listTextSample,
  createTextSample,
  deleteTextSample
};
