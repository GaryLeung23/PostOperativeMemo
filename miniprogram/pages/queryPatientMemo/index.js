// pages/UpdatePatientMemo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNum: 0,
    userInfo: [],
    page: 1,
    entries: 10,
    pageMax: 1,

    isUpdate: true,
    titleValue: 0,
    titleRange: ["修改备忘录", "下载备忘录"],
    subtitleValue: 0,
    subtitleRange: ["修改/查看", "下载/转发"],
    naviPageValue: 0,
    naviPageRange: ["createPatientMemo", "downloadPatientMemo"],
  },


  onPageUp() {
    var page = this.data.page;
    if (page > 1) {
      this.setData({
        page: this.data.page - 1
      })
      this.getUserInfo();
    }
  },
  onPageDown() {
    var page = this.data.page;
    var entries = this.data.entries;
    var userNum = this.data.userNum;
    if (page * entries < userNum) {
      this.setData({
        page: this.data.page + 1
      })
      this.getUserInfo();
    }
  },




  async selectFormData() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'selectFormData',
          subtype: 'page',
          page: this.data.page - 1,
          entries: this.data.entries
        }
      }).then((resp) => {
        wx.hideLoading();
        // console.log(resp);
        if (resp.result.success) {
          resolve(resp.result)
        } else {
          reject(resp.result.errMsg)
        }
      }).catch((e) => {
        wx.hideLoading();
        reject(e.result.errMsg)
      });

    })
  },

  async getUserInfo() {
    try {
      const res = await this.selectFormData();//resolve
      // console.log(res);
      this.setData({
        userNum: res.count,
        userInfo: res.data,
        pageMax: Math.ceil(res.count / this.data.entries)//向上取整
      })
    } catch (e) {
      wx.showToast({
        title: e,//reject
        icon: 'error'
      })
    }

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);

    if (options.type == 'download') {
      this.setData({
        isUpdate: false,
        titleValue: 1,
        subtitleValue: 1,
        naviPageValue: 1
      })
    }
    // console.log("onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //回到第一页
    this.setData({
      page: 1
    })
    this.getUserInfo();
    // console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})