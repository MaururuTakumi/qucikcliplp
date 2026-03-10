const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'inquiries';
const TELEGRAM_BOT_TOKEN = '8777165888:AAFiPB2NaiB0rsA77pX1ImwyuZI8pdhcmYY';
const TELEGRAM_CHAT_ID = '5752822568';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    saveInquiry(data);
    sendTelegramNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveInquiry(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp',
      'name',
      'email',
      'company',
      'department',
      'inquiryType',
      'message',
    ]);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.company || '',
    data.department || '',
    data.inquiryType || '',
    data.message || '',
  ]);
}

function sendTelegramNotification(data) {
  const text = [
    '【LP問い合わせ】',
    '名前: ' + safe(data.name),
    '会社名: ' + safe(data.company),
    '部署: ' + safe(data.department),
    'メール: ' + safe(data.email),
    '種別: ' + safe(data.inquiryType),
    '',
    '内容:',
    safe(data.message),
    '',
    '送信時刻: ' + safe(data.timestamp || new Date().toISOString()),
  ].join('\n');

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
    muteHttpExceptions: true,
  });
}

function safe(value) {
  return value ? String(value) : '-';
}
