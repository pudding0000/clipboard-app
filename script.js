const log = document.getElementById("log");
let history = JSON.parse(localStorage.getItem("clipboardHistory")) || [];
let counter = history.length;

// 顯示紀錄
function renderHistory() {
  log.innerHTML = "";
  history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>#${entry.id}</strong> - ${entry.time}
      <button onclick="deleteEntry(${entry.id})">❌</button><br>
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

// 刪除一筆
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

// 支援 div 接收 paste
document.getElementById("pasteZone").focus();
document.getElementById("pasteZone").addEventListener("paste", (e) => {
  document.dispatchEvent(new ClipboardEvent("paste", { clipboardData: e.clipboardData }));
});

// 初始顯示
renderHistory();
