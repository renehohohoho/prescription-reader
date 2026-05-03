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
const { appId, appSecretKey } = require('./config.js');
const { request } = require('./utils.js');
const getExtraReportInfo = () => ({ captcha_appid: appId });

/**
 * 取得設定在雲端函式的 appId
 */
function getAppId() {
  return appId;
}

/**
 * 核查驗證碼票據結果
 * @param {*} params
 * @param {integer} params.CaptchaType - 固定填值：9。可在控制台設定不同驗證碼類型。
 * @param {string} params.Ticket - 前端回呼函式回傳的使用者驗證票據
 * @param {string} params.UserIp - 使用者操作來源的外網 IP
 * @param {string} params.Randstr - 前端回呼函式回傳的隨機字串
 * @param {integer} [params.BusinessId] - 業務 ID，網站或應用在多個業務中使用此服務，透過此 ID 區分統計資料
 * @param {integer} [params.SceneId] - 場景 ID，網站或應用的業務下有多個場景使用此服務，透過此 ID 區分統計資料
 * @param {string} [params.MacAddress] - mac 位址或裝置唯一識別碼
 * @param {string} [params.Imei] - 手機裝置號碼
 * @param {integer} [params.NeedGetCaptchaTime] - 是否回傳前端取得驗證碼時間，取值 1：需要回傳
 */
async function describeCaptchaResult(params) {
  // 設定校驗
  if (!appId || !appSecretKey) {
    throw new Error('請在雲端函式 CAPTCHA 模組中設定 appId 和 AppSecretKey');
  }
  const auth = uniCloud.auth();
  const userIp = auth.getClientIP();
  // 刪除雲端函式帶上來的額外參數
  delete params.uniIdToken;
  // 呼叫核查驗證碼票據介面
  const result = await request('DescribeCaptchaResult', {
    AppSecretKey: appSecretKey,
    CaptchaAppId: Number(appId),
    UserIp: userIp,
    ...params
  });
  return result;
}

module.exports = {
  getAppId,
  describeCaptchaResult,
  getExtraReportInfo
};
