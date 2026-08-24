/**
 * Kode Google Apps Script untuk aplikasi Absensi Dewan Guru Dhiyaul Ulum.
 *
 * CARA PAKAI (lihat juga README.md):
 * 1. Buka https://sheet.new untuk membuat Google Sheet baru.
 * 2. Di sheet itu, buka menu Extensions > Apps Script.
 * 3. Hapus kode contoh yang ada, lalu tempel (paste) SELURUH isi file ini.
 * 4. Klik Deploy > New deployment > pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Klik Deploy, salin URL Web App yang muncul.
 * 6. Tempel URL itu ke variabel CONFIG.SCRIPT_URL di index.html DAN admin.html.
 */

const SHEET_NAME = 'Absensi';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    // Cegah duplikat: satu nama + tanggal + jenis hanya boleh tercatat sekali
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === body.nama && values[i][2] === body.tanggal && values[i][3] === body.jenis) {
        return jsonOutput({ ok: false, message: 'Absensi ' + body.jenis + ' untuk tanggal ini sudah tercatat.' });
      }
    }

    sheet.appendRow([
      new Date().toISOString(),
      body.nama || '',
      body.tanggal || '',
      body.jenis || '',
      body.jam || '',
      body.lat || '',
      body.lng || ''
    ]);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, message: String(err) });
  }
}

function doGet(e) {
  try {
    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1).map(function (r) {
      return {
        timestamp: r[0],
        nama: r[1],
        tanggal: r[2],
        jenis: r[3],
        jam: r[4],
        lat: r[5],
        lng: r[6]
      };
    });
    return jsonOutput({ ok: true, data: rows });
  } catch (err) {
    return jsonOutput({ ok: false, message: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nama', 'Tanggal', 'Jenis', 'Jam', 'Latitude', 'Longitude']);
  }
  return sheet;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
