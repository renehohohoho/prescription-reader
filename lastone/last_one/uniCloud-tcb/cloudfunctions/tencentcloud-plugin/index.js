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

const { report } = require('./common');

const modules = {
  COS: require('./cos'),
  SMS: require('./sms'),
  OCR: require('./ocr'),
  VOD: require('./vod'),
  CAPTCHA: require('./captcha'),
  TIIA: require('./tiia'),
  TMS: require('./tms'),
  IMS: require('./ims'),
  ASR: require('./asr'),
  SOE: require('./soe'),
  HTTPDNS: require('./httpdns'),
  TTS: require('./tts'),
  TMT: require('./tmt'),
  IAI: require('./iai'),
  FACEID: require('./faceid')
};

/**
 * 騰訊雲uni-app插件依賴的雲端函式入口
 * @param {object} event - 透過uniCloud.callFunction呼叫雲端函式時傳入的data物件
 * @param {string} event.module - 雲端函式模組（目前僅支援傳入"COS"），必傳參數
 * @param {string} event.action - 雲端函式模組下的方法名，必傳參數
 * @return {Promise<any>}
 */
exports.main = async (event) => {
  const { module, action, ...params } = event;
  if (!modules[module] || !modules[module][action]) {
    throw new Error(`${module}.${action}不存在`);
  }
  // 資料統計
  const getExtraInfoMethod = modules[module].getExtraReportInfo;
  const extraInfo = getExtraInfoMethod ? getExtraInfoMethod() : {};
  report(module, extraInfo);
  // 呼叫相應的模組
  const result = await modules[module][action](params);
  return result;
};
