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

/**
 * 票據單據-混貼票據識別 https://cloud.tencent.com/document/product/866/37835
 * @param {object} params - 參數包裝物件
 * @param {string} params.imageBase64 - 需要識別圖片的base64編碼
 * @param {string} params.imageUrl - 需要識別圖片的url
 * @param {array} params.types - 需要識別的票據類型列表，為空或不填表示識別全部類型 0：計程車發票 1：定額發票 2：火車票 3：增值稅發票 5：機票行程單 8：通用機打發票 9：汽車票 10：輪船票 11：增值稅發票（卷票 ） 12：購車發票 13：過路過橋費發票
 * @returns {Promise<object>} - 檢測到的票據資訊
 */
import ocr from "./api.js";
export default function mixedInvoiceOCR({ imageBase64, imageUrl, types }) {
  return ocr.mixedInvoiceOCR({ imageBase64, imageUrl, types });
}
