import { URL,AIPharse} from './config.js'


export function getOpenId(code) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: URL.urlGetUid,
      data: {
        code: code
      },
      success (res) {
        console.log(res)
        resolve(res.data)
      }
    })
  })
}



export function aiStart(){
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: URL.urlAI,
      data: {
        type: AIPharse.start,
        size: 15,
        session_key: wx.getStorageSync("session_key")
      },
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export function aiBegin() {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: URL.urlAI,
      data: {
        type: AIPharse.begin,
        session_key: wx.getStorageSync("session_key")
      },
      success (res) {
        resolve(res.data)
      }
    })
  })
}
/**
 * 
 */

export function aiTurn(pos) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: URL.urlAI,
      data: {
        session_key: wx.getStorageSync("session_key"),
        type: AIPharse.turn,
        pos: pos
      },
      success (res){
        resolve(res.data)
      }
    })
  })
}

export function aiRestart() {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "post",
      url: URL.urlAI,
      data: {
        session_key: wx.getStorageSync("session_key"),
        type: AIPharse.restart,
      },
      success (res){
        resolve(res.data)
      }
    })
  })
}

export function aiTackback(pos){
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: URL.urlAI,
      data: {
        session_key: wx.getStorageSync("session_key"),
        type: AIPharse.takeback,
        pos:{
          x: pos.x,
          y: pos.y
        }
      },
      success(res) {
        resolve(res.data)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export function aiExit() {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: URL.urlAI,
      data: {
        session_key: wx.getStorageSync("session_key"),
        type: AIPharse.exit
      },
      success(res){
        resolve(res.data)
      }
    })
  })
}
