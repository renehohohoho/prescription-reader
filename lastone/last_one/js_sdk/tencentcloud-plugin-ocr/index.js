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
// OCR API
// ===行業文件識別介面===
import tableOCR from "./table-ocr.js"; // 表格識別
import arithmeticOCR from "./arithmetic-ocr.js"; // 算式識別
import formulaOCR from "./formula-ocr.js"; // 數學公式識別
import eduPaperOCR from "./edu-paper-ocr.js"; // 數學試題識別
import insuranceBillOCR from "./insurance-bill-ocr.js"; // 保險單據識別
import sealOCR from "./seal-ocr"; // 印章識別

// ===卡證文字識別相關介面===
import mlidPassportOCR from "./mlid-passport-ocr.js"; // 護照識別（港澳台地區及境外護照）
import mainlandPermitOCR from "./mainland-permit-ocr.js"; // 港澳台往來內地通行證識別
import hmtResidentPermitOCR from "./hmt-resident-permit-ocr.js"; // 港澳台居住證識別
import residenceBookletOCR from "./residence-booklet-ocr.js"; // 戶口本識別
import propOwnerCertOCR from "./prop-owner-cert-ocr.js"; // 房產證識別介面
import businessCardOCR from "./business-card-ocr.js"; // 名片識別
import bizLicenseOCR from "./biz-license-ocr.js"; // 營業執照識別
import bankCardOCR from "./bank-card-ocr"; // 銀行卡識別
import orgCodeCertOCR from "./org-code-cert-ocr"; // 組織機構代碼證識別
import institutionOCR from "./institution-ocr"; // 事業單位法人證書識別
import estateCertOCR from "./estate-cert-ocr"; // 不動產權證識別
import enterpriseLicenseOCR from "./enterprise-license-ocr"; // 企業證照識別
import passportOCR from "./passport-ocr"; // 護照識別（中國大陸地區護照）
import permitOCR from "./permit-ocr"; // 港澳台通行證識別
import idCardOCR from "./id-card-ocr"; // 身份證識別

// ===票據單據識別介面===
import vatInvoiceOCR from "./vat-invoice-ocr"; // 增值稅發票識別
import waybillOCR from "./waybill-ocr"; // 運單識別
import finanBillSliceOCR from "./finan-bill-slice-ocr"; // 金融票據切片識別
import finanBillOCR from "./finan-bill-ocr"; // 金融票據整單識別
import vatRollInvoiceOCR from "./vat-roll-invoice-ocr"; // 增值稅發票（捲票）識別
import tollInvoiceOCR from "./toll-invoice-ocr"; // 過路過橋費發票識別
import shipInvoiceOCR from "./ship-invoice-ocr"; // 輪船票識別
import mixedInvoiceOCR from "./mixed-invoice-ocr"; // 混貼票據識別
import mixedInvoiceDetect from "./mixed-invoice-detect"; // 混貼票據分類
import invoiceGeneralOCR from "./invoice-general-ocr"; // 通用機打發票識別
import busInvoiceOCR from "./bus-invoice-ocr"; // 汽車票識別
import trainTicketOCR from "./train-ticket-ocr"; // 火車票識別
import dutyPaidProofOCR from "./duty-paid-proof-ocr"; // 完稅證明識別
import taxiInvoiceOCR from "./taxi-invoice-ocr"; // 計程車發票識別
import quotaInvoiceOCR from "./quota-invoice-ocr"; // 定額發票識別
import flightInvoiceOCR from "./flight-voice-ocr"; // 機票行程單識別
import carInvoiceOCR from "./car-invoice-ocr"; // 購車發票識別

// ===汽車場景相關介面===
import vehicleLicenseOCR from "./vehicle-license-ocr"; // 行駛證識別
import licensePlateOCR from "./license-plate-ocr"; // 車牌識別
import driverLicenseOCR from "./driver-license-ocr"; // 駕駛證識別
import vinOCR from "./vin-ocr"; // 車輛VIN碼識別
import vehicleRegCertOCR from "./vehicle-reg-cert-ocr"; // 機動車登記證書識別

// ===通用文字識別介面===
import englishOCR from "@/js_sdk/tencentcloud-plugin-ocr/english-ocr.js"; // 英文識別介面
import generalBasicOCR from "@/js_sdk/tencentcloud-plugin-ocr/general-basic-ocr.js"; // 通用印刷體識別
import generalAccurateOCR from "@/js_sdk/tencentcloud-plugin-ocr/general-accurate-ocr.js"; // 通用印刷體識別（高精度版）
import generalEfficientOCR from "@/js_sdk/tencentcloud-plugin-ocr/general-efficient-ocr.js"; // 通用印刷體識別（精簡版）
import generalFastOCR from "@/js_sdk/tencentcloud-plugin-ocr/general-fast-ocr.js"; // 通用印刷體識別（高速版）
import generalHandwritingOCR from "@/js_sdk/tencentcloud-plugin-ocr/general-handwriting-ocr.js"; // 通用手寫體識別
import qrcodeOCR from "@/js_sdk/tencentcloud-plugin-ocr/qrcode-ocr.js"; // 二維碼和條形碼識別
import textDetect from "@/js_sdk/tencentcloud-plugin-ocr/text-detect.js"; // 快速文字偵測

export {
  // ===行業文件識別介面===
  tableOCR,
  arithmeticOCR,
  formulaOCR,
  eduPaperOCR,
  insuranceBillOCR,
  sealOCR,
  // ===卡證文字識別相關介面===
  mlidPassportOCR,
  mainlandPermitOCR,
  hmtResidentPermitOCR,
  residenceBookletOCR,
  propOwnerCertOCR,
  businessCardOCR,
  bizLicenseOCR,
  bankCardOCR,
  orgCodeCertOCR,
  institutionOCR,
  estateCertOCR,
  enterpriseLicenseOCR,
  passportOCR,
  permitOCR,
  idCardOCR,
  // ===票據單據識別介面===
  vatInvoiceOCR,
  waybillOCR,
  finanBillSliceOCR,
  finanBillOCR,
  vatRollInvoiceOCR,
  tollInvoiceOCR,
  shipInvoiceOCR,
  mixedInvoiceOCR,
  mixedInvoiceDetect,
  invoiceGeneralOCR,
  busInvoiceOCR,
  trainTicketOCR,
  dutyPaidProofOCR,
  taxiInvoiceOCR,
  quotaInvoiceOCR,
  flightInvoiceOCR,
  carInvoiceOCR,
  // ===汽車場景識別相關介面===
  vehicleLicenseOCR,
  licensePlateOCR,
  driverLicenseOCR,
  vinOCR,
  vehicleRegCertOCR,
  // ===通用文字識別介面===
  englishOCR,
  generalBasicOCR,
  generalAccurateOCR,
  generalEfficientOCR,
  generalFastOCR,
  generalHandwritingOCR,
  qrcodeOCR,
  textDetect,
};
