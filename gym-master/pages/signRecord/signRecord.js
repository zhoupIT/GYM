//index.js
//获取应用实例
const app = getApp();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();

Page({
  data: {
    list: [],
    para:{
      'hasSigned': true,
      'offset': 0,
      'limit': 10
    },
    more:false
  },

  onLoad: function(options) {
    // 获取签到列表
    this.getSignList(this.data.para)
  },
  getSignList: function(para) {
    var that = this;
    courseService.getMyAppointmentList(para).then(res => {
      console.log(res)
      if(that.data.more) {
        this.setData({
          list: that.data.list.concat(res.data),
          more:false
        })
      } else {
        this.setData({
          list: res.data
        })
      }
      
    }).catch(err => {

    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.more) {
      var that = this;
      this.data.para.offset = Number(this.data.para.offset) +10;
      console.log(this.data.para)
      this.setData({
        para: that.data.para,
        more:true
      })
      this.getSignList(this.data.para)
    }
  }, 
})