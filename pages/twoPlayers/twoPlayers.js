import FiveStone from "../../FiveStone/FiveStone"
import { aiStart, aiBegin, aiTurn, aiRestart, aiTackback, aiExit } from "../../utils/req"
import { URL } from "../../utils/config"
import { $wuxToptips } from '../../dist/index'
import io from '../../utils/wxapp-socket.js'
//index.js
//获取应用实例
(function () {
  const app = getApp();

  function handler(e) {
    let self = getCurrentPages()[0]
    if (!self.fiveStone.canStep()) return null

    let showTipPos = self.fiveStone.getCellPos(e)
    console.log(e)
    console.log(showTipPos)
    let absPos = self.fiveStone.getAbsPosPx(e)
    //console.log(showTipPos);
    if (!showTipPos) {
      self.setData({
        isShowTip: false,
        tipPosPx: null,
        tipRelative: null,
      })
    } else {
      self.setData({
        isShowTip: true,
        tipPosPx: absPos,
        tipRelative: showTipPos,
      })
    }
  }

  Page({
    data: {
      spinning: false,
      precent: 0,
      connectionLost: true,

    },

    onLoad: function () {
      this.fiveStone = new FiveStone(14, 0.9)

      this.setData({
        "fiveStone": this.fiveStone
      })
      
      this.socketStart()
      wx.showShareMenu({
        withShareTicket: false
      })
    },
    onShow: function () {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    },
    onChessBoardTouchStart: function (e) {
      handler(e)
    },
    onChessBoardTouchMove: function (e) {
      handler(e)
    },
    onChessBoardTouchEnd: function (e) {
      console.log(e)
      this.setData({
        isShowTip: true,
      })

      this.fiveStone.step(this.data.tipRelative, this.data.tipPosPx)
      this.setLockScreen(true)
      this.refreshFiveStone()

      // 服务器发送数据到对方， 对方开始下棋
    },
    refreshFiveStone: function () {
      this.setData({
        "fiveStone": this.fiveStone,
      })
    },
    regret: function () {
      this.fiveStone.backMove()
      this.setData({
        "fiveStone": this.fiveStone,
      })
    },
    //请求悔棋退后一步
    takeBack: function () {
      aiTackback(this.fiveStone.takeBack()).then(res => {
        console.log(res)
        this.refreshFiveStone()
      })
    },
    showTipMessage(msg) {
      if (success) {
        $wuxToptips().success({
          hidden: false,
          text: msg,
          duration: 3000,
        })
      } else {
        $wuxToptips().error({
          hidden: false,
          text: 'Connection Failed',
          duration: 3000,
          success() { },
        })
      }
    },
    socketStart() {
      this.socket = io(URL.urlWebSocket)
      this.socket.on('message', data => {
        console.log(data)
      })
    },
    onShareAppMessage: function(ops) {
      return {
        title: "邀请好友",
        path: `pages/twoPlayers/twoPlayers`,
        success: function(res) {
          var shareTickets = res.shareTickets
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res) {
              console.log(res)
            },
            fail: function(res) {
              console.log(res)
            }
          })
        },
        fail: function(res) {
          console.log(JSON.stringify(res));
        }
      }
    }
  })
})()