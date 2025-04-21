const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let esp32Socket = null;

wss.on("connection", function connection(ws) {
  console.log("🟢 新連線已建立");

  ws.on("message", function incoming(data) {
    const msg = data.toString();
    console.log("📩 收到訊息:", msg);

    if (msg === "esp32") {
      esp32Socket = ws;
      console.log("✅ ESP32 註冊完成");
      return;
    }

    if (msg === "move") {
      console.log("🎮 控制端傳來 move 指令");
      if (esp32Socket && esp32Socket.readyState === WebSocket.OPEN) {
        esp32Socket.send("move");
        console.log("➡️ 已轉發 move 給 ESP32");
      } else {
        console.log("⚠️ ESP32 尚未連線或已中斷");
      }
    }
  });

  ws.on("close", () => {
    if (ws === esp32Socket) {
      console.log("❌ ESP32 離線");
      esp32Socket = null;
    }
  });
});

console.log(`🚀 WebSocket Server 正在 port ${PORT} 上運行`);
