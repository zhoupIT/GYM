// pages/record/record.js
const app = getApp();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    tabIndex: 0, //点击tab下标
    tabList: [{
      name: '全部',
      para: {
        'offset': 0,
        'limit': 10
      }
    }, {
      name: '待签到',
      para: {
        'hasSigned': false,
        'signStatus': 'NORMAL',
        'coachCourseOrderBy': 'COURSE_FROM_DESC',
        'offset': 0,
        'limit': 10
      }
    }, {
      name: '已签到',
      para: {
        'hasSigned': true,
        'coachCourseOrderBy': 'COURSE_FROM_DESC',
        'offset': 0,
        'limit': 10
      }
    }],
    para: null,
    height: '', //swiper高度
    more_1: false,
    pageNo_1: 0,
    list_1: [],
    more_2: false,
    pageNo_2: 0,
    list_2: [],
    more_3: false,
    pageNo_3: 0,
    list_3: [],
    learned: '',
    fresh: false, //下个页面取消后刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.countheight();
    if (options.tabIndex) {
      this.setData({
        tabIndex: options.tabIndex
      })
      this.getMyappointmentList(this.data.tabList[this.data.tabIndex].para)
    } else {
      this.getMyappointmentList('')
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.fresh == true) {
      this.changeData();
    }
  },
  /**
   * 获取我的预约列表
   */
  getMyappointmentList: function(para) {
    var that = this;
    courseService.getMyAppointmentList(
      para
    ).then(res => {
      console.log(res)
      if (that.data.tabIndex == 0) {
        if (that.data.more_1) {
          that.setData({
            list_1: that.data.list_1.concat(res.data),
            more_1: false
          })
        } else {
          that.setData({
            list_1: res.data,
          })
        }
      } else if (that.data.tabIndex == 1) {
        if (that.data.more_2) {
          that.setData({
            list_2: that.data.list_2.concat(res.data),
            more_2: false
          })
        } else {
          that.setData({
            list_2: res.data
          })
        }
      } else if (that.data.tabIndex == 2) {
        if (that.data.more_3) {
          that.setData({
            list_3: that.data.list_3.concat(res.data),
            more_3: false
          })
        } else {
          that.setData({
            list_3: res.data
          })
        }
      }

    }).catch(err => {

    })

  },
  //下个页面取消成功后调用 
  changeData: function() {
    this.getMyappointmentList(this.data.para)
  },


  tab: function(e) {
    var that = this;
    this.data.tabList[this.data.tabIndex].para['offset'] = 0;
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      para: that.data.tabList[e.currentTarget.dataset.index].para
    })
    this.getMyappointmentList(this.data.tabList[e.currentTarget.dataset.index].para)
  },

  //滑动切换
  bindChange: function(e) {
    this.setData({
      tabIndex: e.detail.current,
    })
  },

  countheight: function() {
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.select('.calcu').boundingClientRect(rect => {
          this.setData({
            height: rect ? res.windowHeight - rect.height : res.windowHeight
          })
        }).exec();
      }
    })
  },

  getCourseList: function(more, pageNo, list, reserveStatus) {
    var that = this;
    if (that.data[more] == 'false') {
      return
    }
    that.data[pageNo]++
      courseService
      .getCourseReservePage({
        pageNo: that.data[pageNo],
        pageSize: 7,
        reserveStatus: that.data[reserveStatus],
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            [more]: 'false'
          })
        }
        var new_list = that.data[list].concat(res.data.list)
        for (var i = 0; i < new_list.length; i++) {
          new_list[i].time = new_list[i].scheduleDate.split('-')[1] + '-' + new_list[i].scheduleDate.split('-')[2]
        }
        that.setData({
          [list]: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  user: function(param) {
    var that = this;
    app.getLoginUser(function(res) {
      if (param == 'onLoad') {
        that.getCourseList('more_1', 'pageNo_1', 'list_1', 'reserveStatus_1')
        that.getCourseList('more_2', 'pageNo_2', 'list_2', 'reserveStatus_2')
        that.getCourseList('more_3', 'pageNo_3', 'list_3', 'reserveStatus_3')
      }
      that.setData({
        learned: Math.abs(res.data.consumeLcoin).toFixed(1)
      })
    })
  },
  //加载更多
  lower: function(e) {
    if (this.data.tabIndex == 0 && !this.data.more_1) {
      this.data.more_1 = true;
      this.data.tabList[this.data.tabIndex].para['offset'] = Number(this.data.tabList[this.data.tabIndex].para['offset']) + 10;
      console.log(this.data.tabList[this.data.tabIndex].para)
      this.getMyappointmentList(this.data.tabList[this.data.tabIndex].para)
    } else if (this.data.tabIndex == 1 && !this.data.more_2) {
      this.data.more_2 = true;
      this.data.tabList[this.data.tabIndex].para['offset'] = this.data.tabList[this.data.tabIndex].para['offset'] + 10;
      console.log(this.data.tabList[this.data.tabIndex].para)
      this.getMyappointmentList(this.data.tabList[this.data.tabIndex].para)
    } else if (this.data.tabIndex == 2 && !this.data.more_3) {
      this.data.more_3 = true;
      this.data.tabList[this.data.tabIndex].para['offset'] = this.data.tabList[this.data.tabIndex].para['offset'] + 10;
      console.log(this.data.tabList[this.data.tabIndex].para)
      this.getMyappointmentList(this.data.tabList[this.data.tabIndex].para)
    }
  },

  backHome: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },

  reservedetail: function(e) {
    const item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: '../recorddetail/recorddetail?item=' + JSON.stringify(item),
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

  }
})