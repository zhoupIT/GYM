const util = require('./util.js');
// const BASE_URL = "http://106.54.199.143:80"; //测试环境
const BASE_URL = "https://yijin.royalzp.xyz";
// const BASE_URL = "http://192.168.8.19:8299";

const sideEffect = {
  beforeRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.showLoading({
        title: "" + options.loadingMsg,
        mask: true,
      });
    }
  },
  afterRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.hideLoading();
    }
  }
};

function filterParams(params) {
  let res = {};
  Object.keys(params).forEach(key => {
    if (params[key] === null || params === undefined) {
      return;
    }
    res[key] = params[key];
  });
  return res;
}





export function request(method, contentType, api, params = {}, options = {}) {
  sideEffect.beforeRequest(options);
  if (Object.prototype.toString.call(params) === '[Object Object]') {
    params = filterParams(params);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: (options.url || BASE_URL) + api,
      data: params,
      method,
      header: {
        "content-type": contentType,
        "GYM_APPOINTMENT_CUSTOMER": wx.getStorageSync('token')
      },
      success(res) {
        const currentPage = getCurrentPages()[getCurrentPages().length - 1].route.split('/')[1];
        if (res.data.code == '200') {
          resolve(res.data);
        } else if (res.data.code == '401') {
          wx.getSetting({
            success: response => {
              if (response.authSetting['scope.userInfo']) {
                console.log('YI------>用户授权过,直接登录')
                login(function(data) {
                  resolve(data)
                }, method, contentType, api, params)
              } else {
                console.log('YI------>用户没有授权过,去授权页面')
                jumplogin(res)
              }
            }
          })
        } else if (res.data.code == 2012) {
          console.log("YI------>用户授权过,但是没有输入手机号码，注册不成功")
          setTimeout(() => {
            wx.redirectTo({
              url: '../authorize/authorize?jump=' + getCurrentPages()[getCurrentPages().length - 1].route.replace('pages/', '')
            })
          }, 500)
        } else {
          setTimeout(function() {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }, 100)
        }
      },
      fail(e) {
        reject({
          info: "网络请求失败"
        });
      },
      complete() {
        sideEffect.afterRequest(options);
      }
    });

    // 登录 
    function login(callBack, method, contentType, api, params) {
      wx.login({
        success: response => {
          console.log('YI------>获取code码' + JSON.stringify(response))
          wx.showLoading({
            title: "登录中...",
            mask: true,
          });
          wx.request({
            url: BASE_URL + '/api/customer/login', //登录
            method:'POST',
            data:{
              'code':response.code
            },
            header: {
              'content-type': "application/json"
            },
            success: function (res) {
              wx.hideLoading();
              console.log(res)
              if (res.data.code == '200') {
                wx.setStorageSync('token', res.data.data.token)
                //登录成功后重新获取接口数据
                wx.request({
                  url: BASE_URL+api, 
                  method: method,
                  data:params,
                  header: {
                    'content-type': 'application/json', // 默认值
                    "GYM_APPOINTMENT_CUSTOMER": wx.getStorageSync('token')
                  },
                  success(res) {
                    callBack(res.data)
                  }
                })

              } else if (res.data.code == '2012') {
                console.log("YI------>用户授权过,但是没有输入手机号码，注册不成功")
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../authorize/authorize?jump=' + getCurrentPages()[getCurrentPages().length - 1].route.replace('pages/', '')
                  })
                }, 500)
              } else {
                
                if (res.data.message) {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: '您已授权，但登录失败，请联系店长！',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            }, fail: function(err) {
              wx.hideLoading();
              wx.showToast({
                title: '您已授权，但登录失败，请联系店长！',
                icon: 'none',
                duration: 2000
              })
            }
          })
         
        }
      })
    }

    // 未登录跳转登录
    function jumplogin(res) {
      setTimeout(() => {
        wx.redirectTo({
          url: '../authorize/authorize?jump=' + getCurrentPages()[getCurrentPages().length - 1].route.replace('pages/', ''),
        })
      }, 500)
    }
  });
}

export function get(api, params = {}, options = {}) {
  return request("GET", "", api, params, options);
}

export function post(api, params = {}, options = {}) {
  return request("POST", "application/json", api, params, options);
}

export function postJson(api, params = {}, options = {}) {
  return request("POST", "application/json", api, params, options);
}

export function put(api, params = {}, options = {}) {
  return request("PUT", "application/json", api, params, options);
}

export {
  BASE_URL
}




/*
api 接口请求路径
params 数据
options  loadingMsg加载状态gif
type  自定义content-type
*/