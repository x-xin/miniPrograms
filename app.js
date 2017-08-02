//app.js
import { api, wxLogin } from 'utils/util.js';

App({
  onLaunch: function(options) {
    wxLogin(function() {
      if (wx.reLaunch){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }else{
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    });
  }
})
