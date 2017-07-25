// pages/success/success.js
import { api, wxLogin, wxControlTwoCode } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    successInfo: []
  },
  /**
   * 二维码操作
   */
  controlTwoCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        wxControlTwoCode(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      successInfo: wx.getStorageSync('successInfo')
    })
  }
})
