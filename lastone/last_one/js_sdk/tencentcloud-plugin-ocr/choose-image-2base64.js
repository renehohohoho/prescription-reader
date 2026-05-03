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

"use strict";
import {
  filePath2Base64,
  blob2Base64
} from './util.js';

/**
 * 選擇圖片轉換為Base64格式輸出
 * @return {Promise<string>} 返回圖片的Base64編碼
 */
export default async function chooseImage2Base64() {
  const [error, res] = await uni.chooseImage({ count: 1 });
  if (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }

  // #ifdef H5
  if (!/^image/.test(res.tempFiles[0].type)) {
    throw new Error('檔案類型錯誤');
  }
  const h5Base64 = await blob2Base64(res.tempFiles[0]);
  return (/.+;\s*base64\s*,\s*(.+)$/i.exec(h5Base64) || [])[1];
  // #endif

  // #ifdef MP
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: res.tempFilePaths[0],
      encoding: 'base64',
      success: ({ data }) => resolve(data),
      fail: (err) => reject(new Error(err.errMsg || '讀取檔案失敗')),
    });
  });
  // #endif

  // #ifdef APP-PLUS
  const appBase64 = await filePath2Base64(res.tempFilePaths[0]);
  return (/.+;\s*base64\s*,\s*(.+)$/i.exec(appBase64) || [])[1];
  // #endif
}
