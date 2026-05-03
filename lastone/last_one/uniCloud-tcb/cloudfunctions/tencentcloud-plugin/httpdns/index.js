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
const crypto = require('crypto');
const { encId, encKey } = require('./config.js');

/**
 * 核查 DNS 解析結果
 * @param {*} params
 * @param {integer} params.domainName - 需要解析的網域名稱
 * @param {string?} params.ip - 使用者 IP，預設取用戶端 IP
 * @param {number?} params.ttl - 是否遞迴伺服器快取時間 1：回傳
 * @param {number?} params.clientip - 是否回傳使用者公網出口 IP 1：回傳
 * @param {boolean} param.isEnc - 是否加密 true（呼叫企業版 API）：加密；false：不加密（呼叫免費版 API）
 */
async function describeDnsResult({ domainName, ip, ttl, clientip, isEnc }) {
  // 設定校驗
  if (isEnc && (!encId || !encKey)) {
    throw new Error('請在雲端函式 HTTPDNS 模組中設定 encId 和 encKey');
  }
  // 若未傳入 ip，則取用戶端 ip
  if (!ip) {
    const auth = uniCloud.auth();
    ip = auth.getClientIP();
  }
  // 企業版 API 呼叫需加密
  if (isEnc) {
    domainName = encrypt(domainName);
    ip = encrypt(ip);
  }

  const params = {
    dn: domainName,
    ip,
    ttl,
    clientip,
    id: isEnc ? encId : undefined
  };
  const { status, statusText, data } = await uniCloud.httpclient.request('http://119.29.29.29/d', {
    method: 'GET',
    dataType: 'text',
    data: params
  });

  if (status !== 200) {
    throw new Error(`介面呼叫失敗 [${status} - ${statusText}]`);
  }
  if (!data) {
    throw new Error('網域名稱解析失敗');
  }
  if (isEnc) {
    return decrypt(data);
  }

  return data;
}

/**
 * 加密
 * @param {string} encString - 需要加密的字串
 * @return {string} 加密資料
 */
function encrypt(encString) {
  try {
    if (!encString) {
      throw new Error('請傳入待加密資料');
    }
    const iv = Buffer.alloc(0);
    const cipher = crypto.createCipheriv('des-ecb', encKey, iv);
    let encrypText = cipher.update(encString, 'utf8', 'hex');
    encrypText += cipher.final('hex');
    return encrypText;
  } catch (e) {
    throw new Error('加密失敗');
  }
}

/**
 * 解密
 * @param {string} decString - 需要解密的字串
 * @return {string} 解密資料
 */
function decrypt(decString) {
  try {
    if (!decString) {
      throw new Error('請傳入待解密資料');
    }
    const iv = Buffer.alloc(0);
    const cipher = crypto.createDecipheriv('des-ecb', encKey, iv);
    let decryptText = cipher.update(decString, 'hex', 'utf8');
    decryptText += cipher.final('utf8');
    return decryptText;
  } catch (e) {
    throw new Error('解密失敗');
  }
}

module.exports = {
  describeDnsResult
};
