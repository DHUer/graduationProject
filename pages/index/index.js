import FiveStone from "../../FiveStone/FiveStone"
import { aiStart, aiBegin, aiTurn, aiRestart, aiTackback, aiExit } from "../../utils/req"
import {URL} from "../../utils/config"
import { $wuxToptips } from '../../dist/index'
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
            spinning: true,
            precent: 0,
            connectionLost: true,

        },
        onLoad: function () {
            this.fiveStone = new FiveStone(14, 0.9)

            this.setData({
                "fiveStone": this.fiveStone
            })
            this.setLockScreen(true)
            aiStart().then(data => {
              this.setLockScreen(false)
              this.setReturnData(data)
              this.setData({connectionLost: false})
            }, rej => {
              // TODO: fail
            })
        },
        onShow: function() {
          if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
              selected: 0
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

            // AI开始下棋
            aiTurn(this.data.tipRelative).then((res) => {
                this.setReturnData(res)
                this.fiveStone.aiStep(res.pos)
                this.setLockScreen(false)
                this.refreshFiveStone()
            })
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
        restart: function() {
          this.openConfirm(() => {
            this.setLockScreen(true)
            aiRestart().then(data => {
              console.log(data)
              getCurrentPages()[0].fiveStone = new FiveStone(14, 0.9)
              this.refreshFiveStone()
              this.setLockScreen(false)
            })
          })
        },
        //AI退后一步
        takeBack: function () {
            aiTackback(this.fiveStone.takeBack()).then(res => {
                console.log(res)
                this.refreshFiveStone()
            })
        },
        openConfirm: function (callback, fail) {
            wx.showModal({
                title: '重新开始',
                content: '重新开始会导致游戏进度丢失',
                confirmText: "确认",
                cancelText: "取消",
                success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                        callback()
                    } else {
                      return
                    }
                }
            })
        },
        setReturnData(data){
          this.setData({
            delay: data.delay,
            onlineSize: data.onlineSize,
            speed: data.speed
          })
        },
        setLockScreen: function(flag){
          this.setData({
            spinning: flag
          })
        },
        setConnectionMessage(msg){
          this.setData({
            message: msg
          })
        },
        showTipMessage(msg) {
          if(success) {
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
              success() {},
            })
          }
        }
    })
})()