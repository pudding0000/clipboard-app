let recordCount = 1;

// 處理貼上內容
document.getElementById('pasteBtn').addEventListener('click', async () => {
  try {
    const permission = await navigator.permissions.query({ name: 'clipboard-read' });
    if (permission.state === 'denied') throw new Error('未授權讀取剪貼簿');

    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      for (const type of item.types) {
        const blob = await item.getType(type);
        const entry = document.createElement('div');
        entry.className = 'entry';

        const title = document.createElement('h3');
        title.textContent = `紀錄編號 #${recordCount++}`;
        entry.appendChild(title);

        if (type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(blob);
          entry.appendChild(img);
        } else if (type === 'text/plain') {
          const text = await blob.text();
          const p = document.createElement('p');
          p.textContent = text;
          entry.appendChild(p);
        }

        document.getElementById('output').prepend(entry);
      }
    }
  } catch (err) {
    console.error('讀取剪貼簿失敗:', err);
    alert('⚠️ 無法讀取剪貼簿內容，請確認瀏覽器權限');
  }
});

// 複製文字
document.getElementById('copyTextBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('這是一段範例文字');
    alert('✅ 文字已複製到剪貼簿');
  } catch (err) {
    console.error('複製文字失敗:', err);
  }
});

// 複製圖片
document.getElementById('copyImageBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('https://via.placeholder.com/150');
    const blob = await response.blob();
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    alert('✅ 圖片已複製到剪貼簿');
  } catch (err) {
    console.error('複製圖片失敗:', err);
  }
});

// QR Code 產生
const siteURL = https://pudding0000.github.io/clipboard-app/;
const qrCanvas = document.getElementById('qrcode-canvas');
QRCode.toCanvas(qrCanvas, siteURL, { width: 150 }, function (error) {
  if (error) console.error('QR code 產生失敗：', error);
});
