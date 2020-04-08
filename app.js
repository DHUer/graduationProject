//app.js
import {getOpenId} from './utils/req.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if(wx.getStorageSync("session_key") != ""){
            console.log(wx.getStorageSync("session_key"))
          } 
          else {
            getOpenId(res.code).then(data => {
              wx.setStorageSync("session_key", data.openid)
            })
          }
      }
    })
  },
  onShow: function (res) {
    wx.getShareInfo({
      shareTicket: res.shareTicket,
    })
  },
  globalData: {
    userInfo: null
  }
})