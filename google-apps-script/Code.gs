const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const secret = PropertiesService.getScriptProperties().getProperty("ORDER_SECRET");
    if (!secret || data.secret !== secret) return json({ ok: false, error: "Unauthorized" });
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(["Order ID", "Created At", "Name", "Phone", "Governorate", "Address", "Notes", "Items", "Subtotal (EGP)", "Delivery (EGP)", "Total (EGP)", "Payment", "Status"]);
    const lines = (data.items || []).map(i => `${i.product} — ${i.size} × ${i.quantity} @ EGP ${i.unitPrice}`).join(" | ");
    sheet.appendRow([data.orderId, data.createdAt, data.customer.name, data.customer.phone, data.customer.governorate, data.customer.address, data.customer.notes || "", lines, data.subtotal, data.shipping, data.total, data.payment, "New"]);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "Could not save order" });
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
