/**
 * PranaVeda - Google Sheets sync backend.
 *
 * Setup:
 *  1. Create a Google Sheet, then open Extensions > Apps Script.
 *  2. Replace the default code with this file and set SECRET below.
 *  3. Deploy > New deployment > Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *  4. Copy the Web app URL (ends in /exec) into js/sheets-config.js.
 */

const SECRET = 'change-me'; // must match `secret` in js/sheets-config.js
const SHEET_NAME = 'Sessions';
const HEADERS = ['id', 'date', 'pattern', 'duration', 'cycles', 'mindWanders', 'rating', 'clientDate', 'clientTime'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  // Keep ISO dates and locale strings as text so Sheets doesn't reformat them.
  sheet.getRange(1, 1, sheet.getMaxRows(), HEADERS.length).setNumberFormat('@');
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function cellToString_(v) {
  return v instanceof Date ? v.toISOString() : String(v);
}

function readAll_(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, HEADERS.length).getValues()
    .filter(function (row) { return row[0]; })
    .map(function (row) {
      const o = {};
      HEADERS.forEach(function (h, i) { o[h] = cellToString_(row[i]); });
      ['duration', 'cycles', 'mindWanders', 'rating'].forEach(function (k) { o[k] = Number(o[k]) || 0; });
      return o;
    });
}

function rowIndexById_(sheet) {
  const map = {};
  const last = sheet.getLastRow();
  if (last < 2) return map;
  sheet.getRange(2, 1, last - 1, 1).getValues().forEach(function (r, i) {
    if (r[0]) map[String(r[0])] = i + 2;
  });
  return map;
}

function doGet(e) {
  if ((e.parameter.secret || '') !== SECRET) return json_({ ok: false, error: 'unauthorized' });
  return json_({ ok: true, sessions: readAll_(getSheet_()) });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'invalid json' });
  }
  if ((body.secret || '') !== SECRET) return json_({ ok: false, error: 'unauthorized' });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();

    if (body.action === 'upsert' && Array.isArray(body.sessions)) {
      const index = rowIndexById_(sheet);
      const toAppend = [];
      body.sessions.forEach(function (s) {
        if (!s || !s.id) return;
        const row = HEADERS.map(function (h) { return s[h] == null ? '' : String(s[h]); });
        if (index[s.id]) {
          sheet.getRange(index[s.id], 1, 1, HEADERS.length).setValues([row]);
        } else {
          toAppend.push(row);
          index[s.id] = -1;
        }
      });
      if (toAppend.length) {
        sheet.getRange(sheet.getLastRow() + 1, 1, toAppend.length, HEADERS.length).setValues(toAppend);
      }
    } else if (body.action === 'delete' && Array.isArray(body.ids)) {
      const index = rowIndexById_(sheet);
      body.ids
        .map(function (id) { return index[id]; })
        .filter(Boolean)
        .sort(function (a, b) { return b - a; })
        .forEach(function (rowNum) { sheet.deleteRow(rowNum); });
    } else if (body.action === 'clear') {
      const last = sheet.getLastRow();
      if (last >= 2) sheet.deleteRows(2, last - 1);
    }

    return json_({ ok: true, sessions: readAll_(sheet) });
  } finally {
    lock.releaseLock();
  }
}
