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
 * 通用文字-英文識別介面 https://cloud.tencent.com/document/product/866/34938
 * @param {object} params - 參數包裝物件
 * @param {string} params.imageBase64 需要識別圖片的base64編碼
 * @param {string} params.imageUrl 需要識別圖片的url
 * @param {boolean} [params.enableCoordPoint] - 單詞四點座標開關，開啟可返回圖片中單詞的四點座標。該參數預設值為false。
 * @param {boolean} [params.enableCandWord] - 候選字開關，開啟可返回識別時多個可能的候選字（每個候選字對應其置信度）。該參數預設值為false。
 * @returns {Promise<object>} TextDetections - 檢測到的文字資訊
 */
import ocr from "./api.js";
export default function englishOCR({
  imageBase64,
  imageUrl,
  enableCoordPoint,
  enableCandWord,
}) {
  return ocr.englishOCR({
    imageBase64,
    imageUrl,
    enableCoordPoint,
    enableCandWord,
  });
}
