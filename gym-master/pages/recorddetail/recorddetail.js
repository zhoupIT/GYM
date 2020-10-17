// pages/recorddetail/recorddetail.js
const app = getApp();
import YI_CourseService from "../../service/YI_CourseService";
const courseService = new YI_CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channelNo: app.globalData.channelNo,
    image_cache: app.globalData.image_cache,
    reserveItem: '', //预约记录item
    reserveDetail: {
      'reserveStatus':'20'
    },
    status: {
      '10': 'dkb',
      '20': 'ykb',
      '30': 'ywc',
      '40': 'ywc',
    }, //状态
    colors: {
      '10': '#FFB451',
      '20': '#31BD5B',
      '30': '#8A8A8A',
      '40': '#8A8A8A',
    }, //进度条颜色
    title: '',//标题
    content: '',//弹窗内容
    cancelText: '',//取消按钮文案
    confirmText: '',//确认按钮文案
    confirmEvent: '',//确认事件
    backimg: "", //需要https图片路径
    head: "", //头像
    codeSrc: '',
    name: '', //姓名
    path: 'pages/fightgroup/fightgroup',
    userId: '',
    user:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let item = JSON.parse(options.item)
    this.setData({
      reserveItem: item
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.dialog = this.selectComponent("#dialog"); //获取子组件实例对象
  },
  //地址
  onlocClicked: function () {
    wx.openLocation({
      name: '毅劲健身工作室',
      address: '工业园区星湖街818号7幢166室',
      longitude: Number(120.725529),
      latitude: Number(31.285221),
      scale: 18
    })
  },

  cancel: function() {
    var that = this;
    that.setData({
      title: '温馨提示',
      content: '确定取消本次课程',
      cancelText: '取消',
      confirmText: '确定',
      confirmEvent: 'goCancel',
    }, () => {
      that.dialog.showDialog();
    })
  },

  goCancel: function(){
    var that = this;
    courseService
      .cancleCourseAppointment(
        that.data.reserveItem.id
      )
      .then(res => {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000
        })
        // 改变上个页面数据
        var pages = getCurrentPages();
        var lastpage = pages[pages.length - 2];
        lastpage.setData({
         fresh: true,
        })
        wx.navigateBack({
          delta:1
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  gomap: function() {
    wx.openLocation({
      name: this.data.reserveDetail.teachPlaceName,
      address: this.data.reserveDetail.detailAddress,
      longitude: Number(this.data.reserveDetail.longitude),
      latitude: Number(this.data.reserveDetail.latitude),
      scale: 18
    })
  },

  close: function () {
    this.setData({
      hbShow: false,
    })
  },

  getUser: function () {
    var that = this;
    app.getLoginUser(function (res) {
      that.setData({
        user: res.data
      })
    })
  },

  invite: function () {
    this.setData({
      hbShow: true,
    }, () => {
      this.make()
    })
  },

  make: function () {
    var that = this;
    courseService
      .create({
        channelNo: that.data.channelNo, // 渠道 
        page: that.data.path, // 小程序跳转页面
        codeType: 2, // 1=体验卡邀请，2=排课邀请
        userId: that.data.user.userId, // 用户ID
        scheduleId: that.data.reserveDetail.scheduleId // [非必须] 排课ID，当codeType=2时必填
      })
      .then(res => {
        that.setData({
          backimg: that.data.image_cache + 'hb3.png',
          codeSrc: res.data.qrcodeShortUrl,
        }, () => {
          that.user();
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  user: function () {
    this.setData({
      userId: this.data.user.userId,
      head: this.data.user.avatar,
      name: this.data.user.nickName.length > 6 ? this.data.user.nickName.substring(0, 6) + '...' : this.data.user.nickName.substring(0, 6),
    }, () => {
      this.getbackimgInfo();
    })
  },

  /**
   * 先下载背景图片
   */
  getbackimgInfo: function () {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.backimg, //背景图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var backimgSrc = res.tempFilePath; //下载成功返回结果
          that.gethead(backimgSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var backimgSrc = "";
              that.gethead(backimgSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 下载头像图片
   */
  gethead: function (backimgSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.head, //背景图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var headSrc = res.tempFilePath;
          that.getCode(backimgSrc, headSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var headSrc = "";
              that.getCode(backimgSrc, headSrc);
            }
          })
        }
      }
    })
  },

  // 下载小程序码图片
  getCode: function (backimgSrc, headSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.codeSrc, //背景图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.sharePosteCanvas(backimgSrc, headSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.sharePosteCanvas(backimgSrc, headSrc, codeSrc);
            }
          })
        }
      }
    })
  },


  /**
   * 开始用canvas绘制分享海报
   * @param backimgSrc 下载的头像图片路径
   * @param headSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function (backimgSrc, headSrc, codeSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      var height = rect.height;
      var right = rect.right;
      var width = rect.width;
      // console.log(width)
      var left = rect.left;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //背景图
      if (backimgSrc) {
        ctx.drawImage(backimgSrc, 0, 0, width, height);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.save() // 对当前区域保存
      }

      //姓名
      if (that.data.name) {
        ctx.setFontSize(8);
        ctx.setFillStyle('#333');
        ctx.setTextAlign('left');
        ctx.fillText(that.data.name, width * 0.2254, height * 0.07);
        ctx.stroke(); //对当前路径进行描边
        ctx.closePath(); //关闭当前路径
      }

      //  绘制头像
      if (headSrc) {
        const x = width * 0.0525;
        const y = height * 0.0295;
        const w = width * 0.0966;
        const h = width * 0.0966;
        const r = 3;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(headSrc, x, y, w, h, 0, 0);
        ctx.restore();
      }

      if (codeSrc) {
        const x = width * 0.118;
        const y = height * 0.82;
        const w = width * 0.21;
        const h = width * 0.21;
        const r = 5;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(codeSrc, x, y, w, h, 0, 0);
        ctx.restore();
      }

    }).exec()

    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功~',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                hbShow: false,
              })
            },
            fail: function (res) {
              that.setting()
            }
          })
        }
      });
    }, 200);
  },

  // 拒绝授权打开设置
  setting: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        var statu = res.authSetting;
        if (!statu['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '保存图片需开启权限',
            content: '请确认授权，否则将无法保存图片',
            showCancel: false,
            confirmColor: 'rgba(245, 175, 83, 1)',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后，再调用保存相册
                      that.saveShareImg()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '调用授权窗口失败',
          icon: 'success',
          duration: 1000
        })
      }
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