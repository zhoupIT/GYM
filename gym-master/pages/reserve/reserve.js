// pages/reservation/reservation.js
const app = getApp();
var util = require('../../utils/util.js');

import YI_CoachService from "../../service/YI_CoachService";
const coachService = new YI_CoachService();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseSelectedIndex: 0,//选中教练的课程索引
    dateList: [],//日期列表
    enoughDate: '',//选中的日期
    coachList: [],//教练列表
    coachSelected: null, //选中的教练
    courseList: [],//教练的课程列表
    courseSelected: null,//选中的教练的课程
    formid:null,
    timeList: [{
        'begintime': '10:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '10:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '11:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '11:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '12:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '12:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '13:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '13:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '14:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '14:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '15:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '15:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '16:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '16:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '17:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '17:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '18:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '18:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '19:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '19:30',
        'hasBeenAppointment': false,
        'hasSigned': false
      },
      {
        'begintime': '20:00',
        'hasBeenAppointment': false,
        'hasSigned': false
      }
    ],
    timeSeleceted: null, //选择的时间段
    timeSelecetedIndex: null, //选择的时间段的索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
    this.getCoachList();
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
  
  },
  /**
   * 初始化时间 日期
   */
  init: function() {
    var that = this;
    let time = util.formatDate(new Date());
    let date = util.getDates(7, time);
    console.log('日期')
    console.log(date)
    this.setData({
      dateList: date,
      enoughDate: date[0].fullDate,
    })
  },
  bindPickerChange: function (e) {
    //重置预约时间段列表和已选的时间段
    this.data.timeList.map((item, index) => {
      item.hasBeenAppointment = false;
      item.hasSigned = false;
      item.unSel = false;
    })
    this.setData({
      courseSelectedIndex: e.detail.value,
      timeSeleceted: null,
      timeSelecetedIndex: null
    })
    //查询该教练默认课程预约列表
    this.getAppointmentList();
  },
  /**
   * 预约
   */
  onAppointmentClicked: function() {
    if (!this.data.coachSelected) {
      wx.showToast({
        title: '请选择教练',
        icon: 'none',
        duration: 2000
      })
       return;
    }
    if (!this.data.coachSelected.courseList.length) {
      wx.showToast({
        title: '该教练暂无课程,请联系管理员!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.timeSeleceted) {
      wx.showToast({
        title: '请选择课程开始时间!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var courseFrom = this.data.enoughDate + " " + this.data.timeSeleceted.begintime;
    console.log(courseFrom)
    var courseTo;
    if (this.data.timeSelecetedIndex == 20) {
      courseTo = this.data.enoughDate + " " + "21:00"
    } else if (this.data.timeSelecetedIndex == 19) {
      courseTo = this.data.enoughDate + " " + "20:30"
    } else {
      courseTo =  this.data.enoughDate + " " + this.data.timeList[this.data.timeSelecetedIndex + 2].begintime
    }
     
    console.log(courseTo)
    var that =this;
    courseService.courseAppointment({
      'coachId': this.data.coachSelected.id,
      'courseId': this.data.coachSelected.courseList[this.data.courseSelectedIndex].id,
      'courseFrom': courseFrom,
      'courseTo': courseTo,
      'formId': this.data.formid,
    }).then(res => {
      console.log(res)
      //预约成功后 置空当前选择的时间段+刷新预约时间段列表
      that.setData({
        timeSeleceted:null,
        timeSelecetedIndex:null
      })
      that.getAppointmentList();
    }).catch(err => {
       wx.hideLoading();
    })
  },
  /**
   * 选择日期
   */
  changeTab: function(e) {
    console.log('选择日期'+e.currentTarget.dataset.date)
    var that = this;
     //重置预约时间段列表和已选的时间段
    this.data.timeList.map((item, index) => {
      item.hasBeenAppointment = false;
      item.hasSigned = false;
      item.unSel = false;
    })
    this.setData({
      enoughDate: e.currentTarget.dataset.date,
      timeSeleceted: null,
      timeSelecetedIndex: null
    }, () => {
      //查询该教练默认课程预约列表
      this.getAppointmentList();
    });
  },
  /**
   * 选择教练
   */
  changeCoach: function(e) {
    var that = this;
    //重置预约时间段列表和已选的时间段
    this.data.timeList.map((item, index) => {
      item.hasBeenAppointment = false;
      item.hasSigned = false;
      item.unSel = false;
    })
    this.setData({
      coachSelected: e.currentTarget.dataset.item,
      courseSelectedIndex:0,//重置默认选择课程为0
      timeSeleceted:null,
      timeSelecetedIndex:null
    }, () => {
      //查询该教练默认课程预约列表
      this.getAppointmentList();
    });
  },
  /**
   * 选择时间段
   */
  onTimeClicked: function(e) {
    var timeItem = e.currentTarget.dataset.time;
    if (!timeItem.hasBeenAppointment && !timeItem.hasSigned) {
      this.setData({
        timeSeleceted: timeItem,
        timeSelecetedIndex: e.currentTarget.dataset.index
      })
    }
  },
  /**
   * 获取教练列表
   */
  getCoachList: function(e) {
    coachService.getAllCoach({}).then(res => {
      console.log(res);
      this.setData({
        coachList: res.data
      })
      if (res.data.length) {
        //默认选中第一位教练 并查询该教练当前默认课的预约列表
        this.setData({
          coachSelected: res.data[0]
        })
        console.log(this.data.coachSelected)
        console.log(this.data.enoughDate)
        this.getAppointmentList();
      }
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },
  /**
   * 查询当前教练的可教课列表
   */
  getCourseList: function() {
    courseService.getCourseList(this.data.coachSelected.id).then(res => {
      console.log(res);
      this.setData({
        courseList: res.data.courseList
      })
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },
  /**
   * 查询当前教练当前课程的约课列表
   */
  getAppointmentList: function() {
    var that = this;
    courseService.getAppointmentList({
      'courseFrom': this.data.enoughDate,
      'coachId': this.data.coachSelected.id
    }).then(res => {
      console.log(res);
      //遍历课时数据并设置状态
      var newTimeList = that.data.timeList.slice(0);
      newTimeList.map((timeItem, timeIndex) => {
        res.data.map((courseItem, courseIndex) => {
          if (courseItem.courseId == that.data.coachSelected.courseList[that.data.courseSelectedIndex].id && courseItem.courseFrom.split(" ")[1] == timeItem.begintime) {
            console.log(timeItem)
            that.data.timeList[timeIndex].hasBeenAppointment = courseItem.hasBeenAppointment;
            that.data.timeList[timeIndex].hasSigned = courseItem.hasSigned;
            that.data.timeList[timeIndex].unSel = courseItem.unSel;
            // if (timeIndex == 0) {
            //   that.data.timeList[timeIndex + 1].hasBeenAppointment = true;
            // } else if (timeIndex == 20) {
            //   that.data.timeList[timeIndex - 1].hasBeenAppointment = true;
            // } else {
            //   that.data.timeList[timeIndex + 1].hasBeenAppointment = true;
            //   that.data.timeList[timeIndex - 1].hasBeenAppointment = true;
            // }
            if (timeIndex == 0) {
              that.data.timeList[timeIndex + 1].unSel = 'Ma';
              that.data.timeList[timeIndex + 1].hasBeenAppointment = true;
            } else if (timeIndex == 20) {
              that.data.timeList[timeIndex - 1].unSel = 'Ma';
              that.data.timeList[timeIndex - 1].hasBeenAppointment = true;
            } else {
              that.data.timeList[timeIndex + 1].unSel = 'Ma';
              that.data.timeList[timeIndex - 1].unSel = 'Ma';
              that.data.timeList[timeIndex + 1].hasBeenAppointment = true;
              that.data.timeList[timeIndex - 1].hasBeenAppointment = true;
            }
          }
        })
      })
      //刷新界面
      this.setData({
        timeList: that.data.timeList
      })
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },
  //获取表单的formId(用来传给后台,后台给小程序发推送)
  formSubmit(e) {
    console.log(e.detail.formId)
    this.setData({
      formid: e.detail.formId
    })
  },
})