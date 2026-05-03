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
 * 查詢圖片樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/37187
 * @param {object} params - 參數包裝物件
 * @param {int} params.limit - 數量限制
 * @param {int} params.offset - 偏移量
 * @return {Promise<object>} 圖片樣本的資訊
 */
async function listImageSample({ limit = 20, offset = 0 }) {
  // 呼叫騰訊雲介面
  const { FileSampleSet, TotalCount } = await request('DescribeFileSample', {
    Limit: limit,
    Offset: offset
  });
  return {
    FileSampleSet,
    TotalCount
  };
}

/**
 * 新增圖片樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/37189
 * @param {object} params - 參數包裝物件
 * @param {string} params.fileName - 圖片檔案名稱
 * @param {string} params.fileUrl - 圖片檔案路徑
 * @param {string} params.fileMd5 - 圖片檔案MD5
 * @param {string} params.evilType - 惡意類型
 * @param {string} params.label - 樣本類型 1：黑庫 2：白庫
 * @return {Promise<int>} 任務狀態
 */
async function createImageSample({ fileName, fileUrl, fileMd5, evilType, label }) {
  if (!fileName || !fileUrl || !fileMd5 || !evilType || !label) {
    throw new Error('fileName/fileUrl/fileMd5/evilType/label不得為空');
  }
  // 呼叫騰訊雲介面
  const { Progress } = await request('CreateFileSample', {
    Contents: [
      {
        FileName: fileName,
        FileUrl: fileUrl,
        FileMd5: fileMd5
      }
    ],
    EvilType: evilType,
    Label: label,
    FileType: 'image'
  });
  return Progress;
}

/**
 * 刪除圖片樣本
 * 更多資訊請訪問 https://cloud.tencent.com/document/product/669/37188
 * @param {object} params - 參數包裝物件
 * @param {string[]} params.ids - 唯一標識數組
 * @return {Promise<int>} 任務狀態
 */
async function deleteImageSample({ ids }) {
  if (!ids || !ids.length) {
    throw new Error('ids不得為空');
  }
  // 呼叫騰訊雲介面
  const { Progress } = await request('DeleteFileSample', {
    Ids: ids
  });
  return Progress;
}

module.exports = {
  listImageSample,
  createImageSample,
  deleteImageSample
};
