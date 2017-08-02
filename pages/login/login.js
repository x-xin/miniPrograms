// pages/login/login.js
import { api } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  loginSubmit: function(e) {
    console.log(e.detail.value);
    if (e.detail.value.userName === "" || e.detail.value.userPwd === ""){
      wx.showModal({
        title: '提示',
        content: '账号或者密码不能为空',
        showCancel: false,
        confirmColor: '#00b7ff',
        success: function (res) {
          if (res.confirm) {
            console.log(res);
          }
        }
      });
    }else{
      // 验证接口数据
      //request
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            var code = res.code;
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                if (wx.showLoading){
                  wx.showLoading({
                    title: '加载中',
                  })
                }
                wx.request({
                  url: `${api}/wechatapp/auth/bind`,
                  method: 'POST',
                  data: {
                    username: e.detail.value.userName,
                    password: e.detail.value.userPwd,
                    encrypted_data: res.encryptedData,
                    iv: res.iv,
                    code: code
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    if (wx.hideLoading){
                      wx.hideLoading();
                    }
                    console.log(res.data);
                    if (res.data.res !== 0){
                      wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        confirmColor: '#00b7ff',
                        success: function (res) {
                          if (res.confirm) {
                            console.log(res);
                          }
                        }
                      });
                    }else{
                      // 正确登录了
                      console.log(res.data.data);
                      wx.setStorageSync('userCookie', res.data.data.cookie);
                      wx.setStorageSync('realName', res.data.data.realname);
                      wx.setStorageSync('scenicName', res.data.data.scenic_name);
                      if (wx.reLaunch){
                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
                      }else{
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                      
                    }
                  }
                })
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
      
      //end
    }
  }
})
