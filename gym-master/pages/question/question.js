//index.js
//获取应用实例
const app = getApp();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();

Page({
  data: {
    list: []
  },

  onLoad: function(options) {
    // 获取签到列表
    this.getSignList()
  },
  getSignList: function() {
    var that = this;
    courseService.getMyAppointmentList({
      'hasSigned':true
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    }).catch(err => {

    })
  }  
})