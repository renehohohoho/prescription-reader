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

function ocr() {}

// 參數首字母大寫轉換
function toUpperCase(obj) {
  if (obj !== null && typeof obj === 'object') {
    const formatObj = Object.keys(obj).reduce((newObj, key) => {
      const newKey = key.substring(0, 1).toUpperCase() + key.substring(1);
      newObj[newKey] = obj[key];
      return newObj;
    }, {});
    return formatObj;
  }
  throw new Error('參數需要為 object 型別');
}

function simpleOCR(name) {
  if (!name) throw new Error('請傳入 OCR 對應的 Action 名稱');
  return async function (args) {
    if (!args.imageBase64 && !args.imageUrl) {
      throw new Error('請傳入圖片');
    }
    try {
      // 將參數 key 的首字母大寫
      const payload = toUpperCase(args);
      // 呼叫雲端函式進行 OCR 辨識
      const result = await uniCloud.callFunction({
        name: 'tencentcloud-plugin',
        data: {
          module: 'OCR',
          action: 'getOcrResult',
          name,
          payload
        }
      });
      return result;
    } catch (e) {
      throw e;
    }
  };
}

const function_names = [
  // 通用文字識別
  'GeneralBasicOCR',
  'GeneralAccurateOCR',
  'GeneralEfficientOCR',
  'GeneralFastOCR',
  'EnglishOCR',
  'GeneralHandwritingOCR',
  'QrcodeOCR',
  'TextDetect',
  // 行業文件識別
  'TableOCR',
  'ArithmeticOCR',
  'FormulaOCR',
  'EduPaperOCR',
  'InsuranceBillOCR',
  'SealOCR',
  // 卡證文字識別相關介面
  'MLIDPassportOCR',
  'MainlandPermitOCR',
  'HmtResidentPermitOCR',
  'ResidenceBookletOCR',
  'PropOwnerCertOCR',
  'BusinessCardOCR',
  'BizLicenseOCR',
  'BankCardOCR',
  'OrgCodeCertOCR',
  'InstitutionOCR',
  'EstateCertOCR',
  'EnterpriseLicenseOCR',
  'PassportOCR',
  'PermitOCR',
  'IDCardOCR',
  // 票據單據
  'VatInvoiceOCR',
  'WaybillOCR',
  'FinanBillSliceOCR',
  'FinanBillOCR',
  'VatRollInvoiceOCR',
  'TollInvoiceOCR',
  'ShipInvoiceOCR',
  'MixedInvoiceOCR',
  'MixedInvoiceDetect',
  'InvoiceGeneralOCR',
  'BusInvoiceOCR',
  'TrainTicketOCR',
  'DutyPaidProofOCR',
  'TaxiInvoiceOCR',
  'QuotaInvoiceOCR',
  'FlightInvoiceOCR',
  'CarInvoiceOCR',
  // 汽車場景識別相關介面
  'VehicleLicenseOCR',
  'LicensePlateOCR',
  'DriverLicenseOCR',
  'VinOCR',
  'VehicleRegCertOCR'
];

// 註冊OCR函式
for (let i = 0; i < function_names.length; i++) {
  const name = function_names[i];
  ocr[name.charAt(0).toLowerCase() + name.slice(1)] = simpleOCR(function_names[i]);
}

export default ocr;
