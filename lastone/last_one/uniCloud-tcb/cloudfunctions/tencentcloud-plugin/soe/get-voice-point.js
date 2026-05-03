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
 * 取得參數
 * @param {object} param - 待包裝物件
 * @return {object} 包裝參數物件
 */
function getParams(param) {
  const paramsData = {
    SeqId: param.seqId,
    IsEnd: param.isEnd,
    VoiceFileType: 3,
    VoiceEncodeType: 1,
    UserVoiceData: param.voiceData,
    SessionId: param.sessionId,
    RefText: param.refText,
    WorkMode: param.workMode,
    EvalMode: param.evalMode,
    ScoreCoeff: param.scoreCoeff
  };

  // 非必填參數
  param.hasOwnProperty('soeAppId') && (paramsData.SoeAppId = param.soeAppId);
  param.hasOwnProperty('storageMode') && (paramsData.StorageMode = param.storageMode);
  param.hasOwnProperty('sentenceInfoEnabled') && (paramsData.SentenceInfoEnabled = param.sentenceInfoEnabled);
  param.hasOwnProperty('serverType') && (paramsData.ServerType = param.serverType);
  param.hasOwnProperty('textMode') && (paramsData.TextMode = param.textMode);

  return paramsData;
}

/**
 * 取得口語評測資訊
 * 更多資訊請訪問 https://cloud.tencent.com/document/api/884/32605
 * @param {object} params - 參數包裝物件
 * @param {object} params.param - 口語評測相關參數
 * @return {Promise<object>} 評測資訊
 */
async function getVoicePoint({ param }) {
  const paramsData = getParams(param);

  // 呼叫騰訊雲發音資料傳輸介面（附帶初始化過程介面）
  const evaluateInfo = await request('TransmitOralProcessWithInit', paramsData);

  return evaluateInfo;
}

module.exports = getVoicePoint;
