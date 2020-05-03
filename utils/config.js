
export const URL = {
  urlGetUid: "https://localhost:443/getOpenID",
  urlAI: "https://localhost:443/AI",
  urlWebSocket: `wss://localhost:443?id=${wx.getStorageSync("session_key")}`
}

export const AIPharse = {
  start: "START",
  begin: "BEGIN",
  turn: "TURN",
  restart: "RESTART",
  takeback: "TAKEBACK",
  play: "PLAY",
  exit: "EXIT"
}