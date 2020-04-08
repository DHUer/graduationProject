
export const URL = {
  urlGetUid: "https://wling.wang:443/getOpenID",
  urlAI: "https://wling.wang:443/AI",
  urlWebSocket: `wss://wling.wang:443?id=${wx.getStorageSync("session_key")}`
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