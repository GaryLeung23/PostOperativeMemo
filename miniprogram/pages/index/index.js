// index.js
// const app = getApp()

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '备忘录',
      tip: 'Memorandum',
      showItem: false,
      item: [{
        title: '新增备忘录',
        page: 'createPatientMemo',
        type: ''
      },
      {
        title: '修改备忘录',
        page: 'queryPatientMemo',
        type: 'update'
      },
      {
        title: '下载备忘录',
        page: 'queryPatientMemo',
        type: 'download'
      }
      ]
    }, {
      title: '模板导入',
      tip: 'Import Template',
      showItem: false,
      item: [{
        title: '康复模板导入',
        page: 'importRehabTemplate',
        type: ''
      }
      ]
    }]
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    this.setData({
      powerList
    });
  },
  jumpPage(e) {

    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index` + (e.currentTarget.dataset.type ? `?type=${e.currentTarget.dataset.type}` : ''),
    });
  },
    onShareAppMessage() {

    },
    onShareTimeline(){
      
    }
    
});
