//index.js
//获取应用实例
const app = getApp();
import YI_GymService from "../../service/YI_GymService";
const gymService = new YI_GymService();

Page({
  data: {
    height:0,
    list: []
  },

  onLoad: function(options) {
    this.computeHeight();
    // 获取会员风采列表
    this.getCustomerShowList()
  },
  getCustomerShowList: function() {
    var that = this;
    gymService.getCustomerShow({}).then(res => {
      console.log(res)
      that.setData({
        list: res.data
      })
    }).catch(err => {

    })
  },
  capdetail: function(e) {
    var item = e.currentTarget.dataset.item;
    var currentimg = e.currentTarget.dataset.currentimg;
    var that = this;
    wx.previewImage({
      current: currentimg, // 当前显示图片的http链接
      urls: item.showImgArr // 需要预览的图片http链接列表
    })
  },
  //计算单个照片的高度
  computeHeight: function () {
    let screenW = wx.getSystemInfoSync().windowWidth
    let h = (screenW - 60) / 3
    console.log(h)
    this.setData({
      height: h
    })
  },
})