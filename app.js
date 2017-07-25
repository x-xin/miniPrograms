//app.js
import { api, wxLogin } from 'utils/util.js';

App({
  onLaunch: function(options) {
    wxLogin(function() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    });
  }
})
