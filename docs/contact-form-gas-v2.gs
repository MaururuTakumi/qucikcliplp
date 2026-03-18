function doPost(e) {
  var errors = [];
  try {
    if (!e || !e.postData) {
      throw new Error("postDataが存在しません");
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([data.timestamp, data.name, data.email, data.company, data.department, data.message]);
    sendTelegramNotification(data);
    try {
      var emailAddresses = "quickclip@ltdhonkoma.com,essentialtk2914@gmail.com,ta.hayashi@buysell-technologies.com";
      var subject = "【honkoma】新しい問い合わせがありました";
      var name = data.name || "名前なし";
      var email = data.email || "メールなし";
      var company = data.company || "未記入";
      var department = data.department || "未記入";
      var message = data.message || "メッセージなし";
      var timestamp = data.timestamp || new Date().toLocaleString("ja-JP");
      var body = "新しい問い合わせが届きました。\n\nお名前: " + name + "\nメールアドレス: " + email + "\n会社名: " + company + "\n部署: " + department + "\n\n【お問い合わせ内容】\n" + message + "\n\n送信日時: " + timestamp;
      GmailApp.sendEmail(emailAddresses, subject, body);
    } catch(mailError) {
      errors.push("メール送信エラー: " + mailError.toString());
    }
    var response = errors.length > 0 ? { "result": "partial_success", "errors": errors } : { "result": "success" };
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegramNotification(data) {
  var text = "🔔【LP問い合わせ】\n名前: " + (data.name || "-") + "\n会社名: " + (data.company || "-") + "\n部署: " + (data.department || "-") + "\nメール: " + (data.email || "-") + "\n\n内容:\n" + (data.message || "-") + "\n\n送信時刻: " + (data.timestamp || new Date().toLocaleString("ja-JP"));
  UrlFetchApp.fetch("https://api.telegram.org/bot8777165888:AAFiPB2NaiB0rsA77pX1ImwyuZI8pdhcmYY/sendMessage", { method: "post", contentType: "application/json", payload: JSON.stringify({ chat_id: "5752822568", text: text }), muteHttpExceptions: true });
}
