/* =================================
   CONFIG API SMM (WAJIB GANTI)
================================= */
const API_URL = "https://providersmm.id/api/v2";
const API_KEY = "0e9cf2ac82fad4273d1ab13c1c534761";

/* =================================
   STATE
================================= */
let saldo = 0;
let usedFiles = [];
let selectedPrice = 0;

/* =================================
   DATA SERVICE / PAKET
================================= */
const paketData = {
  tiktok: [{ id: 101, price: 5000, max: 10000 }],
  youtube: [{ id: 201, price: 8000, max: 10000 }],
  instagram: [{ id: 301, price: 6000, max: 10000 }],
  discord: [{ id: 401, price: 7000, max: 5000 }]
};

/* =================================
   ELEMENT
================================= */
const orderBtn   = document.getElementById("orderBtn");
const depositBtn = document.getElementById("depositBtn");
const proofInput = document.getElementById("proofFile");

/* =================================
   SALDO
================================= */
function updateSaldo() {
  document.getElementById("saldo").innerText = saldo.toLocaleString();
}

/* =================================
   LOAD PAKET
================================= */
document.getElementById("service").addEventListener("change", function () {
  const pkg = document.getElementById("package");
  pkg.innerHTML = `<option value="">Pilih Paket</option>`;
  selectedPrice = 0;
  document.getElementById("totalPrice").innerText = "0";

  paketData[this.value]?.forEach(p => {
    pkg.innerHTML += `
      <option value="${p.id}" data-price="${p.price}" data-max="${p.max}">
        Rp ${p.price}/1K (Max ${p.max})
      </option>`;
  });

  cekOrderForm();
});

/* =================================
   PILIH PAKET
================================= */
document.getElementById("package").addEventListener("change", function () {
  const opt = this.options[this.selectedIndex];
  if (!opt) return;

  selectedPrice = Number(opt.dataset.price || 0);
  document.getElementById("quantity").max = opt.dataset.max || "";
  hitungTotal();
  cekOrderForm();
});

/* =================================
   INPUT JUMLAH
================================= */
document.getElementById("quantity").addEventListener("input", () => {
  hitungTotal();
  cekOrderForm();
});

/* =================================
   VALIDASI ORDER
================================= */
function cekOrderForm() {
  const service = document.getElementById("service").value;
  const pkg     = document.getElementById("package").value;
  const qty     = document.getElementById("quantity").value;

  orderBtn.disabled = !(service && pkg && qty > 0);
}

/* =================================
   HITUNG TOTAL
================================= */
function hitungTotal() {
  const qty = Number(document.getElementById("quantity").value);
  const total = Math.ceil(qty / 1000) * selectedPrice || 0;
  document.getElementById("totalPrice").innerText = total.toLocaleString();
}

/* =================================
   ORDER API
================================= */
function order() {
  const serviceId = document.getElementById("package").value;
  const link      = document.getElementById("link").value;
  const quantity  = document.getElementById("quantity").value;
  const total     = Number(
    document.getElementById("totalPrice").innerText.replace(/,/g, "")
  );

  if (!serviceId || !link || !quantity) {
    alert("Lengkapi data order!");
    return;
  }

  if (saldo < total) {
    alert("Saldo tidak cukup!");
    return;
  }

  orderBtn.disabled = true;
  orderBtn.innerText = "Processing...";

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      key: API_KEY,
      action: "add",
      service: serviceId,
      link: link,
      quantity: quantity
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.order) {
      saldo -= total;
      updateSaldo();
      alert("Order berhasil! ID: " + data.order);
      resetOrder();
    } else {
      alert("Order gagal: " + (data.error || "Unknown error"));
      orderBtn.disabled = false;
      orderBtn.innerText = "🚀 Order Sekarang";
    }
  })
  .catch(() => {
    alert("Gagal koneksi ke API!");
    orderBtn.disabled = false;
    orderBtn.innerText = "🚀 Order Sekarang";
  });
}

/* =================================
   RESET ORDER
================================= */
function resetOrder() {
  document.getElementById("service").value = "";
  document.getElementById("package").innerHTML =
    `<option value="">Pilih Paket</option>`;
  document.getElementById("link").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("totalPrice").innerText = "0";
  orderBtn.disabled = true;
  orderBtn.innerText = "🚀 Order Sekarang";
}

/* =================================
   PAYMENT INFO
================================= */
function showDana() {
  document.getElementById("paymentInfo").innerHTML =
    "<b>DANA</b><br>083843066892";
}

function showGopay() {
  document.getElementById("paymentInfo").innerHTML =
    "<b>GOPAY</b><br>083843066892";
}

function showQris() {
  document.getElementById("paymentInfo").innerHTML =
    "<b>QRIS</b><br><img src='https://files.catbox.moe/mf3n28.png' alt='QRIS'>";
}

/* =================================
   DEPOSIT
================================= */
proofInput.addEventListener("change", () => {
  depositBtn.disabled = proofInput.files.length === 0;
});

function deposit() {
  const amount = Number(document.getElementById("depositAmount").value);
  const file   = proofInput.files[0];

  if (amount < 1000) {
    alert("Minimal deposit 1000!");
    return;
  }

  if (usedFiles.includes(file.name)) {
    alert("File bukti sudah digunakan!");
    return;
  }

  usedFiles.push(file.name);
  saldo += amount;
  updateSaldo();

  alert("Deposit berhasil dikirim, menunggu admin.");

  document.getElementById("depositAmount").value = "";
  proofInput.value = "";
  depositBtn.disabled = true;
}

/* =================================
   TICKET ADMIN
================================= */
function openTicket() {
  document.getElementById("ticketModal").classList.add("active");
}

function closeTicket() {
  document.getElementById("ticketModal").classList.remove("active");
}

function sendTicket() {
  const msg = document.getElementById("ticketMessage").value.trim();
  if (!msg) return alert("Pesan tidak boleh kosong!");
  alert("Pesan terkirim ke admin:\n\n" + msg);
  document.getElementById("ticketMessage").value = "";
  closeTicket();
}

/* =================================
   MENU
================================= */
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("active");
}

/* =================================
   INIT
================================= */
updateSaldo();