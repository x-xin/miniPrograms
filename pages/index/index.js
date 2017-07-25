//index.js
//获取应用实例
import { api, wxLogin, wxControlTwoCode } from '../../utils/util.js';    
Page({
  data: {
    scenicInfo: {}
  },
  onShareAppMessage: function () {
    return {
      title: '笨游商家版',
      desc: '最具人气的笨游商家版',
      path: '/pages/index/index'
    }
  },
  //事件处理函数
  controlTwoCode: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        // wxRequest(res);
        wxControlTwoCode(res);
      }
    })
  },
  onLoad: function () {
    console.log(api);
    if (wx.getStorageSync('userCookie') === ""){
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }else{
      this.setData({
        scenicInfo: {
          userName: wx.getStorageSync('realName'),
          senceName: wx.getStorageSync('scenicName')
        }
      })
    }
  }
})
