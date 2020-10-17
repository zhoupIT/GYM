//index.js
//获取应用实例
const app = getApp();
import YI_GymService from "../../service/YI_GymService";
const gymService = new YI_GymService();

Page({
  data: {
    height:0,
    gymShowList: []
  },

  onLoad: function(options) {
    this.computeHeight();
    // 获取健身环境列表
    this.getGymShowList()
  },
  getGymShowList: function() {
    var that = this;
    gymService.getGymShow({}).then(res => {
      console.log(res)
      var gymShowList = [];
      if (res.data.length) {
        res.data.map((item,index)=>{
          gymShowList.push(item.imgArr[0])
        })
      }
      that.setData({
        gymShowList: gymShowList
      })
    }).catch(err => {

    })
  },
  capdetail: function(e) {
    // 向主题列表传递数据
    var item = e.currentTarget.dataset.item;
    var that = this;
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: that.data.gymShowList // 需要预览的图片http链接列表
    })
  },
  //计算单个照片的高度
  computeHeight: function () {
    let screenW = wx.getSystemInfoSync().windowWidth
    let h = (screenW - 30) / 2
    console.log(h)
    this.setData({
      height: h
    })
  }
})