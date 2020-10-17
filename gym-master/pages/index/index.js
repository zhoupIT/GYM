//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
import YI_LoginService from "../../service/YI_LoginService";
const loginService = new YI_LoginService();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();

Page({
  data: {
    imgUrls: [{
        'advUrl': 'http://106.54.199.143/group1/M00/00/00/rBEACl2Ro6OAFJG4AALn5R25Wc8113.png'
      },
      {
        'advUrl': 'http://106.54.199.143/group1/M00/00/00/rBEACl2Ro9WAcrZwAAGATQWi6dM325.png'
      }
    ], //图片轮播
    adBanner: null, //广告
    interval: 4000,
    duration: 400,
    circular: true,
    leftMargin: '16rpx',
    rightMargin: '30rpx',
    currentIndex: 0,
    timestamp: new Date().getTime(),
    list: [], //今日预约列表
    getCourseListByPick: [], //精选课程
    week: '',
    fresh: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
    this.getMyAppointmentList();
  },

  // 切换swiper
  handleChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      this.onShow()
    }, 1500)
  },
  //获取今日预约
  getMyAppointmentList: function() {
    let time = util.formatDate(new Date());
    let date = util.getDates(1, time);
    this.setData({
      week: date[0].week
    })
    if (wx.getStorageSync('token')) {
      courseService.getMyAppointmentList({
        'courseFrom': date[0].fullDate,
        'coachCourseOrderBy': 'COURSE_FROM_ASC'
      }).then(res => {
        console.log(res)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        res.data.map((item, index) => {
          item.courseFrom = item.courseFrom.split(" ")[1]
        })
        this.setData({
          list: res.data
        })
      }).catch(err => {
        wx.hideLoading();
      })
    }
  },
  lessondetail: function(e) {
    // 课程详情
    const item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: '../recorddetail/recorddetail?item=' + JSON.stringify(item),
    })
  },
  //地址
  onlocClicked: function() {
    wx.openLocation({
      name: '毅劲健身工作室',
      address: '工业园区星湖街818号7幢166室',
      longitude: Number(120.725529),
      latitude: Number(31.285221),
      scale: 18
    })
  },
  // 扫一扫
  onScanClicked: function() {
    // 只允许从相机扫码
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        if (res.errMsg == "scanCode:ok") {
          //获取的结果
          console.log(res.result)
          loginService.appointmentSignWithCode({
            'signCode': res.result
          }).then(res => {
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 3000
            })
            that.getMyAppointmentList();
          }).catch(err => {
            wx.hideLoading();
          });
        }

      }
    })
  },
  //签到记录
  onSignListClicked: function() {
    wx.navigateTo({
      url: '../signRecord/signRecord',
    })
  },
  // 会员风采
  onCustomerShowClicked: function() {
    wx.navigateTo({
      url: '../customerShow/customerShow',
    })
  },
  // 健身环境
  onEnvShowClicked: function() {
    wx.navigateTo({
      url: '../gymShow/gymShow',
    })
  },

  onReady: function() {

  },
  onUnload: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '毅劲健身工作室',
      path: '/pages/index/index',
      success: (res) => {

      },
      fail: function(res) {
        // 分享失败
      }
    }
  }
})