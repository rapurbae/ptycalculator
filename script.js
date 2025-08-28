// Tambahkan ini di bagian atas file JavaScript Anda
const SHEET_ID = '1a23-L7tTxuOrwzHaXMrzBpmdM8JVy8kqIlA2B_AcpCU'; // Ganti dengan ID Google Sheet Anda
const API_KEY = 'AIzaSyCohVxMYJvkoKdxd5f_zmQuPcCetlTR92s'; // Ganti dengan API Key Anda
const SHEET_NAME = 'coba'; // Nama sheet

// Fungsi untuk mengirim data ke Google Sheets
async function sendToGoogleSheets(data) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW&key=${API_KEY}`;
  
  const requestBody = {
    values: [data]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      alert('Data berhasil dikirim ke Google Sheets!');
    } else {
      alert('Gagal mengirim data ke Google Sheets');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mengirim data');
  }
}

// Modifikasi event listener yang sudah ada (contoh untuk script.js - Material OB)
document.getElementById("calc-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Ambil input (kode yang sudah ada)
  const BC = parseFloat(document.getElementById("bucketCapacity").value);
  const F = parseFloat(document.getElementById("fillFactor").value);
  const CTE = parseFloat(document.getElementById("cycleTimeExca300").value);
  const TB = parseFloat(document.getElementById("totalBucket").value);
  const VC = parseFloat(document.getElementById("vesselCapacity").value);
  const MT = parseFloat(document.getElementById("manuverTime").value);
  const DT = parseFloat(document.getElementById("dumpingTime").value);
  const SL = parseFloat(document.getElementById("speedLoad").value);
  const SE = parseFloat(document.getElementById("speedEmpty").value);
  const KURS = parseFloat(document.getElementById("kursRupiah").value);
  const HD = parseFloat(document.getElementById("haulingDistance").value);
  const OT = parseFloat(document.getElementById("overtimeshift").value);
  const EX300 = parseFloat(document.getElementById("exca300").value);
  const EX200 = parseFloat(document.getElementById("exca200").value);
  const DOZER = parseFloat(document.getElementById("dozer").value);

  // Konstanta dan perhitungan (kode yang sudah ada)
  const MP = 1.790;
  const ODPM = 0.00018;
  const DMAX = 700;
  const FE300 = 22, DE300 = 87858, CM300 = 50049;
  const FE200 = 16, DE200 = 46185, CM200 = 51265;
  const FDT = 8, DDT = 33914, CMDT = 84500;
  const FDZ = 24, DDZ = 140826, CMDZ = 55230;
  const FC = 14000;
  const EF = 0.75, SF = 0.82;
  const BS = 3500000;
  const TT = 700000;

  // Semua perhitungan yang sudah ada...
  const q = BC * F;
  const prodExca = q * 3600 * EF * SF / CTE;
  const LT = CTE * TB;
  const TL = (HD / 1000) / SL * 3600;
  const TE = (HD / 1000) / SE * 3600;
  const CTD = LT + TL + TE + MT + DT;
  const RPH = 60 / (CTD / 60);
  const prodDT = EF * VC * 3600 * SF / CTD;
  const FM = prodExca / prodDT;
  const OD = Math.max(0, HD - DMAX);
  const revMat = prodExca * MP * KURS;
  const revDist = OD * ODPM * prodExca * KURS;
  const revTotal = revMat + revDist;

  const fuelExca300 = FE300 * FC * EX300;
  const fuelExca200 = EX200 * FE200 * FC;
  const fuelDT = FM * FDT * FC;
  const fuelDZ = DOZER * FDZ * FC;

  const TO = ((BS / 173) * OT) / 16.5;
  const AB = ((BS / 30) + (TT / 30)) / 16.5;
  const SO = AB + TO;

  const costExca300 = fuelExca300 + (EX300 * (DE300 + CM300 + SO));
  const costExca200 = fuelExca200 + (EX200 * (DE200 + CM200 + SO));
  const costDT = fuelDT + (FM * (DDT + CMDT + SO));
  const costDZ = fuelDZ + (DOZER * (DDZ + CMDZ + SO));

  const costTotal = costExca300 + costExca200 + costDT + costDZ;
  const profitIDR = revTotal - costTotal;

  // Format untuk tampilan
  const formatC = costTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
  const formatR = revTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
  const formatIDR = profitIDR.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  // Tampilkan hasil (kode yang sudah ada)
  document.getElementById("output").innerHTML = `
  <label>Excavator 300 Productivity (Bcm/Hour)</label>
  <input type="text" value="${prodExca.toFixed(2)}" readonly>
  
  <label>Dump Truck Productivity (Bcm/Hour)</label>
  <input type="text" value="${prodDT.toFixed(2)}" readonly>

  <label>Ritase/Hour</label>
  <input type="text" value="${RPH.toFixed(2)}" readonly>

  <label>Fleet Matching (Unit)</label>
  <input type="text" value="${FM.toFixed(2)}" readonly>

  <label>Cost Total (Rupiah/Hour)</label>
  <input type="text" value="${formatC}" readonly>

  <label>Revenue Total (Rupiah/Hour)</label>
  <input type="text" value="${formatR}" readonly>

  <label>Profit (Rupiah/Hour)</label>
  <input type="text" value="${formatIDR}" readonly>
  `;

  // Siapkan data untuk dikirim ke Google Sheets
  const currentDate = new Date().toLocaleString('id-ID');
  const dataToSend = [
    currentDate, // Timestamp
    'Material OB', // Jenis Material
    BC, F, CTE, TB, VC, MT, DT, SL, SE, KURS, HD, OT, EX300, EX200, DOZER, // Input data
    prodExca.toFixed(2), prodDT.toFixed(2), RPH.toFixed(2), FM.toFixed(2), // Hasil perhitungan
    costTotal.toFixed(2), revTotal.toFixed(2), profitIDR.toFixed(2) // Cost, Revenue, Profit
  ];

  // Kirim data ke Google Sheets
  await sendToGoogleSheets(dataToSend);
});
