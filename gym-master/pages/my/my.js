// pages/my/my.js
const app = getApp();
import YI_LoginService from "../../service/YI_LoginService";
const loginService = new YI_LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    user: null,
    showLead: false,
    leadImgUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('token')) {
      this.guide()
    }
  },
  onLoginClicked:function() {
    this.guide()
  },
  jump: function(e) {
    var name = e.currentTarget.dataset.name
    switch (name) {
      case 'yueke':
        // this.setData({
        //   showLead: true,
        // })
        wx.navigateTo({
          url: '../question/question',
        })
        break;
      case 'kefu':
        wx.showModal({
          title: '提示',
          content: '有问题请联系店长(13776082707)!',
          confirmText: "拨打",
          cancelText: "取消",
          success: function(res) {
            console.log(res)
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: '13776082707',
              })
            }
          }
        })
        break;
    }
  },
  select: function(e) {
    var index = e.currentTarget.dataset.index
    switch (index) {
      case '1':
        wx.navigateTo({
          url: '../record/record?tabIndex=1',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../record/record?tabIndex=2',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../record/record',
        })
        break;
    }
  },

  okHandler: function() {
    this.setData({
      showLead: false,
    })
  },
  // 充值课时
  recharge: function() {
    wx.showModal({
      title: '提示',
      content: '请联系店长充值课次(13776082707)!',
      confirmText: "拨打",
      cancelText: "取消",
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13776082707',
          })
        }
      }
    })
  },

  guide: function() {
    var that = this;
    loginService.getMyDetail({}).then(res => {
      console.log(res)
      that.setData({
        user: res.data
      })
    }).catch(err => {

    })
  },

  user: function() {
    var that = this;
    app.getLoginUser(function(res) {
      that.setData({
        user: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})