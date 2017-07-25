// module baseApi http://192.168.9.150:935
const api = "https://tickettest.jingdian.com";
// module baseRecord pageSize
const pageSize = 20;
//wxLogin
let wxLogin = function(fn) {
  wx.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            wx.request({
              url: `${api}/wechatapp/auth/login`,
              method: 'POST',
              data: {
                encrypted_data: res.encryptedData,
                iv: res.iv,
                code: code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                // 去登录
                if (res.data.res !== 0) {
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                } else { // 已登录
                  wx.setStorageSync('userCookie', res.data.data.cookie);
                  wx.setStorageSync('realName', res.data.data.realname);
                  wx.setStorageSync('scenicName', res.data.data.scenic_name);
                  if (fn) {
                    fn();
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
  return null;
}
//wxControlTwoCode
let wxControlTwoCode = function(_res) {
  if (!_res.result.match(/^\d{8}$/)){
    wx.showModal({
      title: '提示',
      content: '请扫描游客手中的门票二维码',
      showCancel: false,
      confirmColor: '#000',
      success: function (res) {
        if (res.confirm) {
          console.log(res);
        }
      }
    });
  }else{
    wx.showLoading({
      title: '验票中',
    })
    wx.request({
      url: `${api}/wechatapp/order/checkIn`,
      method: 'POST',
      data: {
        sn: _res.result
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('userCookie')
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.res === '40000') {
          wxLogin(function(){
            console.log("重新登录后处理");
            wxControlTwoCode(_res);
          });
        } else if (res.data.res === 0) {
          // 验证成功了
          wx.hideLoading();
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
};
// exports
module.exports = {
  api                  :   api,
  pageSize             :   pageSize,
  wxLogin              :   wxLogin,
  wxControlTwoCode     :   wxControlTwoCode
}
