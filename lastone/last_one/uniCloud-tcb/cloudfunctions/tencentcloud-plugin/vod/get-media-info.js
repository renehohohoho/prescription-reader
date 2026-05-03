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
const getAntiTheftURL = require('./get-anti-theft-url.js');
const { antiTheftKey } = require('./config');

/**
 * 取得騰訊雲雲點播媒體詳細資訊
 * 更多資訊請訪問 https://cloud.tencent.com/document/api/266/31763
 * @param {object} params - 參數包裝物件
 * @param {string[]} params.mediaId - 媒體ID
 * @return {Promise<object>} 媒體詳細資訊
 */
async function getUploadSignature({ mediaId }) {
  if (!mediaId) {
    throw new Error('待查詢媒體ID不得為空');
  }
  // 呼叫騰訊雲查詢介面
  const {
    MediaInfoSet: [mediaInfo]
  } = await request('DescribeMediaInfos', {
    FileIds: [mediaId]
  });
  // 如果有設定antiTheftKey則自動生成帶簽名的url
  if (mediaInfo && antiTheftKey) {
    mediaInfo.BasicInfo.AntiTheftUrl = getAntiTheftURL({
      mediaUrl: mediaInfo.BasicInfo.MediaUrl
    });
  }
  return mediaInfo;
}

module.exports = getUploadSignature;
