// pages/ticketCode/ticketCode.js
import { api,  wxLogin } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  loginSubmit: function (e) {
    var _this = this;
    if (!e.detail.value.ticketCode.match(/^\d{8}$/)) {
      wx.showModal({
        title: '提示',
        content: '请输入八位数字票码',
        showCancel: false,
        confirmColor: '#000',
        success: function (res) {
          if (res.confirm) {
            console.log(res);
          }
        }
      });
    } else {
      wx.showLoading({
        title: '验票中',
      })
      wx.request({
        url: `${api}/wechatapp/order/checkIn`,
        method: 'POST',
        data: {
          sn: e.detail.value.ticketCode
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': wx.getStorageSync('userCookie')
        },
        success: function (res) {
          if (res.data.res === '40000') {
            wxLogin(function () {
              _this.loginSubmit(e);
            });

          } else if (res.data.res === 0) {
            wx.hideLoading();
            // 验证成功了
            console.log(res.data.data);
            wx.setStorageSync('successInfo', res.data.data);
            wx.reLaunch({
              url: '/pages/success/success',
            })
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmColor: '#000',
              success: function (res) {
                if (res.confirm) {
                  console.log(res);
                }
              }
            });
          }
        }
      })
    }
  }
})
