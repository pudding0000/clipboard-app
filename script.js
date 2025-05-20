// 網站網址（請改成你自己的網址）
const siteURL = "https://你的帳號.github.io/clipboard-app/";

// QR Code 產生
const qrCanvas = document.getElementById("qrcode");
new QRious({
  element: qrCanvas,
  value: siteURL,
  size: 150
});

const log = document.getElementById("log");
let history = JSON.parse(localStorage.getItem("clipboardHistory")) || [];
let counter = history.length;

// 將紀錄顯示出來（包括刪除按鈕）
function renderHistory() {
  log.innerHTML = "";
  history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>#${entry.id}</strong> - ${entry.time}
      <button style="float:right" onclick="deleteEntry(${entry.id})">❌</button><br>
      ${
        entry.type === "text"
          ? `<div>${entry.content}</div>`
          : `<img src="${entry.content}" />`
      }
    `;
    log.prepend(div);
  });
}

// 加入新紀錄
function addEntry(type, content) {
  counter++;
  const time = new Date().toLocaleString();
  const entry = { id: counter, type, content, time };
  history.push(entry);
  localStorage.setItem("clipboardHistory", JSON.stringify(history));
  renderHistory();
}

// 刪除特定紀錄
function deleteEntry(id) {
  history = history.filter(entry => entry.id !== id);
  localStorage.setItem("clipboardHistory", JSON.stringify(history));
  renderHistory();
}

// 貼上事件處理
document.addEventListener("paste", async (e) => {
  const items = e.clipboardData.items;
  for (let item of items) {
    if (item.type.indexOf("image") !== -1) {
      const file = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function (event) {
        addEntry("image", event.target.result);
      };
      reader.readAsDataURL(file);
    } else if (item.type === "text/plain") {
      item.getAsString(text => {
        addEntry("text", text);
      });
    }
  }
});

// 初始化：載入現有紀錄
renderHistory();
