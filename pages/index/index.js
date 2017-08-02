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
    var _this = this;
    var userCookie = wx.getStorageSync('userCookie') || "";
    if (userCookie === ""){
      // wx.redirectTo({
      //   url: '/pages/login/login'
      // })
      console.log("去登录哦哦哦哦哦");
      wxLogin(function() {
        _this.onLoad();
      });
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
