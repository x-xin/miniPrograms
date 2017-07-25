// pages/record/record.js
import { api, pageSize, wxLogin } from '../../utils/util.js';
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordData: [],
    hasRecordData: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _this = this;
      wx.request({
        url: `${api}/wechatapp/order/check_record`,
        method: 'GET',
        data: {
          page_size: pageSize,
          page: page++
        },
        header: {
          'content-type': 'application/json',
          'cookie': wx.getStorageSync('userCookie')
        },
        success: function (res) {
          if (res.data.res === '40000') {
            // 登录过期
            wxLogin(function(){
              page = 1;
              _this.onLoad();
              console.log("我是重新请求了的数据");
            });
          } else {
            console.log(res.data);
            if (res.data.data.items.length === 0) {
              _this.setData({
                hasRecordData: false
              });
            } else {
              _this.setData({
                recordData: res.data.data.items,
                hasRecordData: true
              });
            }
          }
        }
      })

  },
  onShow: function () {
    page = 1;
    this.onLoad();
  },

  /**
   * 页面下拉触底事件的处理函数onReachBottom
   */
  onReachBottom: function () {
    console.log("ReachBottom");
    var _this = this;
    wx.request({
      url: `${api}/wechatapp/order/check_record`,
      method: 'GET',
      data: {
        page_size: pageSize,
        page: page++
      },
      header: {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('userCookie')
      },
      success: function (res) {
        console.log(res);
        if (res.data.res === '40000') {
          // 登录过期的处理
          wxLogin(function() {
            page = 1;
            _this.onReachBottom();
            console.log("我是重新请求了的数据ReachBottom");
          });
        } else {
          if (res.data.data.items.length === 0) {
            console.log("没有更多啦");
          } else {
            _this.data.recordData.push.apply(_this.data.recordData, res.data.data.items);
            _this.setData({
              recordData: _this.data.recordData,
              hasRecordData: true
            });
          }
        }
      }
    })
  }
})
