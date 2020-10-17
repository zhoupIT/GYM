var app = getApp();
import LoginService from "../../service/YI_LoginService";
const loginService = new LoginService();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    code: '', //获取code
    jump: '', //跳到登录页来源
    logging: false, //登录中
    infoAndPhone: false, //信息+手机号
    userinfo: null, //用户授权加密信息
    userData: null, //用户姓名 头像 手机号码
    showModal: false,
    textV: '', //输入的手机号码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.judgeToken();
    console.log('YI------->跳转来源')
    console.log(options.jump)
    this.setData({
      jump: options.jump ? options.jump : '',
    })
  },
  judgeToken: function() {
    var that = this;
    if (!wx.getStorageSync('token')) {
      that.getUser()
    } else {
      // 存在token 获取用户信息
      wx.checkSession({
        success: function(res) {
          //session_key 未过期，并且在本生命周期一直有效
          that.checkUserToken()
        },
        fail: function(res) {
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('token')
          that.getUser();
        }
      })
    }
  },

  // 存在token获取用户信息
  checkUserToken: function() {
    var that = this;
    loginService
      .checkUserToken({

      })
      .then(res => {
        if (res.code == '0030') {
          // 未登录
          wx.removeStorageSync('token')
          that.getUser();
        } else if (res.code == '0000') {
          // 判断手机号
          if (res.data.bindPhone == false) {
            //需要手机号
            that.setData({
              phoneNum: 'true'
            })
          } else {
            that.jump()
          }
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
//回跳页面
  jump: function() {
    var that = this;
    // 登录中
    that.setData({
      logging: true,
    })
    setTimeout(() => {
      if (that.data.jump) {
        if (that.data.jump == 'index/index' || that.data.jump == 'my/my' || that.data.jump == 'reserve/reserve') {
          wx.switchTab({
            url: "../" + that.data.jump
          })
        } else {
          var query = wx.getStorageSync('query')
          wx.redirectTo({
            url: '../' + that.data.jump + '?' + query
          })
          wx.removeStorage({
            key: 'query',
            success: function(res) {},
          })
        }
      } else {
        wx.switchTab({
          url: "../index/index",
        })
      }
    }, 250)
  },
  // 不存在token先获取用户信息 再登录
  getUser: function() {
    var that = this;
    that.getCode(function() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync('userInfo', res.userInfo)
                that.setData({
                  userData: res
                })
                that.codeLogin(res)
              },
              fail: res => {
                console.log('获取信息失败');
                that.getUser();
              },
            })
          } else {
            that.setData({
              userinfo: 'true'
            })
          }
        },
        fail: res => {
          that.getUser();
        }
      })
    })
  },
  //wx.login获取code
  getCode: function(cb) {
    var that = this;
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        }, () => {
          typeof cb == "function" && cb()
        })
      }
    })
  },
  //授权用户信息
  bindGetUserInfo: function(e) {
    // 用户点击授权后，登陆
    if (!e.detail.userInfo) {
      return;
    }
    if (app.globalData.isConnected) {
      console.log(e)
      this.setData({
        userinfo: e.detail,
        showModal: true
      })
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  /**
   * 获取input输入值
   */
  wish_put: function(e) {
    this.setData({
      textV: e.detail.value.replace(/\s+/g, '')
    })
  },
  /**
   * 点击确定按钮获取input值并且关闭弹窗
   */
  ok: function() {
    if (this.data.textV.length != 11) {
      wx.showModal({
        title: '提示',
        content: '输入的手机号码有误!',
      })
      return;
    }
    var userinfo = this.data.userinfo;
    this.setData({
      showModal: false
    })
    var that = this;
    that.getCode(function() {
      let userData = {
        'phone': that.data.textV,
        'portrait': userinfo.userInfo.avatarUrl,
        'nickname': userinfo.userInfo.nickName,
        'code': that.data.code
      }
      that.codeLogin(userData)
    })
  },
  //登录
  codeLogin: function (para) {
    console.log(para)
    var that = this;
    loginService.wxLoginWithCode({
      'code': para.code,
      'nickname': para.nickname,
      'phone': para.phone,
      'portrait': para.portrait
    }).then(res => {
      console.log(res)
      wx.setStorageSync('token', res.data.token)
      that.jump();
    }).catch(err => {
      wx.hideLoading();
    });
  },
})