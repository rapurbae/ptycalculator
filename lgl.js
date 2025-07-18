document.getElementById("calc-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil input
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
  const EX200 = parseFloat(document.getElementById("exca200").value);
  const EX200SEL = parseFloat(document.getElementById("exca200sel").value);
  const DOZER = parseFloat(document.getElementById("dozer").value);

  // Konstanta
  const MP = 4.0;
  const ODPM = 0.00013;
  const DMAX = 2000;
  const FE300 = 22, DE300 = 6.37, SE300 = 1.24;
  const FE200 = 16, DE200 = 3.76, SE200 = 1.24;
  const FDT = 8, DDT = 2.48, SDT = 1.24;
  const FDZ = 24, DDZ = 10.12, SDZ = 1.24;
  const FC = 0.86;
  const EF = 0.75, SF = 0.93;
  const DM = 1.578

  // Hitung q
  const q = BC * F;

  // Excavator Productivity
  const prodExca = q * 3600 * EF * SF / CTE;
  const prodExcaTon = prodExca * DM;

  // Loading Time
  const LT = CTE * TB;

  // Travel Time
  const TL = (HD / 1000) / SL * 3600;
  const TE = (HD / 1000) / SE * 3600;

  // Dump Truck Cycle
  const CTD = LT + TL + TE + MT + DT;

  // Ritase & Dump Truck Productivity
  const RPH = 60 / (CTD / 60);
  const prodDT = EF * VC * 3600 / CTD;
  const prodDTTon = prodDT * DM;

  // Fleet Matching
  const FM = prodExcaTon / prodDTTon;

  // Overdistance
  const OD = Math.max(0, HD - DMAX);

  // Revenue
  const revMat = prodExcaTon  * MP;
  const revDist = OD * ODPM * prodExcaTon;
  const revTotal = revMat + revDist;

  // Cost
  const fuelExca300 = FE300 * FC;
  const fuelExca200 = (EX200 + EX200SEL) * FE200 * FC;
  const fuelDT = FM * FDT * FC;
  const fuelDZ = DOZER * FDZ * FC;

  const costExca300 = fuelExca300 + DE300 + SE300;
  const costExca200 = fuelExca200 + (EX200 + EX200SEL) * (DE200 + SE200);
  const costDT = fuelDT + FM * (DDT + SDT);
  const costDZ = fuelDZ + DOZER * (DDZ + SDZ);

  const costTotal = costExca300 + costExca200 + costDT + costDZ;

  // Profit
  const profitUSD = revTotal - costTotal;
  const profitIDR = profitUSD * KURS;

const formatUSDC = costTotal.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const formatUSDR = revTotal.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const formatUSD = profitUSD.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const formatIDR = profitIDR.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  // Output
  document.getElementById("output").innerHTML = `
  <label>Excavator 300 Productivity (Ton/Hour)</label>
  <input type="text" value="${prodExcaTon.toFixed(2)}" readonly>
  
  <label>Dump Truck Productivity (Ton/Hour)</label>
  <input type="text" value="${prodDTTon.toFixed(2)}" readonly>

  <label>Ritase/Hour</label>
  <input type="text" value="${RPH.toFixed(2)}" readonly>

  <label>Fleet Matching (Unit)</label>
  <input type="text" value="${FM.toFixed(2)}" readonly>

  <label>Cost Total (Dollar/Hour)</label>
  <input type="text" value="${formatUSDC}" readonly>

  <label>Revenue Total (Dollar/Hour)</label>
  <input type="text" value="${formatUSDR}" readonly>

  <label>Profit (Dollar/Hour)</label>
  <input type="text" value="${formatUSD}" readonly>

  <label>Profit (Rupiah/Hour)</label>
  <input type="text" value="${formatIDR}" readonly>
`;

});
