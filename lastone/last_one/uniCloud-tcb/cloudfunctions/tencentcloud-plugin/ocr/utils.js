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

const axios = require('axios');
const { region } = require('./config');
const { sign } = require('../common');

/**
 * 請求騰訊雲OCR介面公共方法
 * @param {string} action - 介面請求action
 * @param {object} payload - 介面請求體
 * @returns {object} API回傳的有效資料
 */
async function request(action, payload) {
  const [timestamp, authorization] = sign('ocr', JSON.stringify(payload));
  const options = {
    url: 'https://ocr.tencentcloudapi.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-TC-Action': action,
      [region ? 'X-TC-Region' : '']: region,
      'X-TC-Version': '2018-11-19',
      'X-TC-Timestamp': timestamp,
      Authorization: authorization
    },
    data: payload
  };
  const response = await axios(options);
  const { status, statusText, data } = response;
  if (status !== 200) {
    throw new Error(`${action} 介面呼叫失敗 [${status} - ${statusText}]`);
  }
  if (!data || !data.Response) {
    throw new Error(`${action} API 回傳格式異常`);
  }
  if (data.Response.Error) {
    throw new Error(data.Response.Error.Message);
  }
  return data.Response;
}

module.exports = { request };
