import FiveStone from "../../FiveStone/FiveStone"

//index.js
//获取应用实例
(function() {
  const app = getApp();

  function handler(e) {
    let self = getCurrentPages()[0];
    if (!self.fiveStone.canStep()) return null;

    let showTipPos = self.fiveStone.getCellPos(e);
    let absPos = self.fiveStone.getAbsPosPx(e);
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

    },

    onLoad: function() {
      this.fiveStone = new FiveStone(14, 0.9)

      this.setData({
        "fiveStone": this.fiveStone
      })

    },
    onChessBoardTouchStart: function(e) {
      handler(e);
    },
    onChessBoardTouchMove: function(e) {
      handler(e);
    },
    onChessBoardTouchEnd: function(e) {
      this.setData({
        isShowTip: true,
      });

      this.fiveStone.step(this.data.tipRelative, this.data.tipPosPx);
      this.refreshFiveStone();
    },
    refreshFiveStone: function() {
      this.setData({
        "fiveStone": this.fiveStone,
      })
    },
    regret: function() {
      this.fiveStone.backMove();
      this.setData({
        "fiveStone": this.fiveStone,
      })
    },
    restart: function() {
      this.openConfirm(this.onLoad);
      
    },
    openConfirm: function(callback) {
      wx.showModal({
        title: '重新开始',
        content: '重新开始会导致游戏进度丢失',
        confirmText: "确认",
        cancelText: "取消",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            callback()
          } else {
            return;
          }
        }
      })
    }
  })

})()