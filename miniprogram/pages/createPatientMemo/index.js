// pages/createPatientMemo/index.js
const colorLight = 'rgba(0, 0, 0, .9)'
const colorDark = 'rgba(255, 255, 255, .8)'
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
var recordRecManager;
var recorderManager;
var innerAudioContext;
const options = {
  format: 'mp3',
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /*制作表单变量*/
    surgeryNum: 0,

    // 
    MobilityProgress: 0,
    mobilityTimeRange: [],
    mobilitySituationRange: [],
    mobilityTimeValue: [],
    mobilitySituationValue: [],

    // 
    weightProgress: 0,
    weightTimeRange: [],
    weightSituationRange: [],
    weightTimeValue: [],
    weightSituationValue: [],

    // 
    braceInfoProgress: 0,
    braceInfoTimeRange: [],
    braceInfoTypeRange: [],
    braceInfoTimeValue: [],
    braceInfoTypeValue: [],

    // 
    braceAngleProgress: 0,
    braceAngleTimeRange: [],
    braceAngleTypeRange: [],
    braceAngleTimeValue: [],
    braceAngleTypeValue: [],

    // 
    tissueQualityProgress: 0,
    tissueQualityBoneRange: [],
    tissueQualityTendonsRange: [],
    tissueQualityBoneValue: [],
    tissueQualityTendonsValue: [],

    genderIdx: 0,
    genderRange: ['男', '女'],
    /*常量*/
    date: '2022-09',

    mtRange_1: ['1', '2', '3', '4', '5', '6'],
    mtRange_2: ['天', '周', '月', '年'],
    msRange_1: ['主动', '被动', '制动'],
    msRange_2: ['屈曲', '伸展', '外展'],
    msRange_3: ['30°', '60°', '90°', '120°'],

    wtRange_1: ['1', '2', '3', '4', '5', '6'],
    wtRange_2: ['天', '周', '月', '年'],
    wsRange_1: ['负重', '不负重'],
    wsRange_2_1: ['25%', '40%', '60%', '80%', '100%'],
    wsRange_2_2: [''],

    biTimeRange_1: ['1', '2', '3', '4', '5', '6'],
    biTimeRange_2: ['周', '月', '年'],
    biTypeRange_1: ['支具', '前臂吊带'],

    baTimeRange_1: ['1', '2', '3', '4', '5', '6'],
    baTimeRange_2: ['周', '月', '年'],
    baTypeRange_1: ['不超过', '固定于'],
    baTypeRange_2: ['30°', '45°', '60°'],

    tqBoneRange_1: ['好', '中', '差'],
    tqTendonsRange_1: ['好', '中', '差'],

    /*表单数据*/
    formData: {
      name: '',
      gender: '男',
      age: '',
      limb: '',
      surgery: [],//surgeryName doctorName surgeryDate
      mobility: [],//num unit  type subType angle date
      weightBearing: [],//num unit type percent date
      braceInfo: [],// type num unit date
      braceAngle: [],//num unit type angle date
      tissueQuality: [],//bone tendons date
      recordFilePath: '',
      recordContent: '',
    },
    /*表单规则*/
    rules: [{
      name: 'name',
      rules: { required: true, message: '请输入姓名' },
    }, {
      name: 'gender',
      rules: { required: true, message: '请选择性别' },
    }, {
      name: 'age',
      rules: {
        validator(rule, value) {
          if (!value || !/^\d+$/.test(value)) {
            return '请输入正确年龄'
          }
          return ''
        }
      }
    }, {
      name: 'limb',
      rules: { required: true, message: '请输入受伤部位' },
    }, {
      name: 'surgery',
      rules: {
        validator(rule, value) {
          var num = value.length
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              var info = value[i]
              if (!info.surgeryName) {
                return '请输入手术名称'
              } else if (!info.doctorName) {
                return '请输入医生姓名'
              }
            }
          }
          return ''
        }
      }
    }, {
      name: 'mobility',
      rules: { required: false },
    }, {
      name: 'weightBearing',
      rules: { required: false },
    }, {
      name: 'braceInfo',
      rules: { required: false },
    }, {
      name: 'braceAngle',
      rules: { required: false },
    }, {
      name: 'tissueQuality',
      rules: { required: false },
    }, {
      name: 'recordFilePath',
      rules: { required: false },
    }, {
      name: 'recordContent',
      rules: { required: false },
    }, {
      name: '_id',//数据库记录标识符
      rules: { required: false },
    }],

    /*icon*/
    iconList: [{
      icon: 'mike2',
      color: colorLight,
      size: 25,
      name: ''
    }, {
      icon: 'voice',
      color: colorLight,
      size: 25,
      name: ''
    }],

    /*录音 播放*/
    recordState: false,
    tmpFilePath: '',
    playState: false,
    /*提交结果*/
    error: '',

    /*用于"查看/修改页面*/
    updateEntryIdx: 0,
    isUpdate: false,
    titleValue: 0,
    titleRange: ["新增备忘录", "修改备忘录"],
  },


  // 
  // 
  getCurrentDate() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()

    return `${year}-${month}-${day}`
  },

  bindDateChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`formData.surgery[${index}].surgeryDate`]: e.detail.value
    })

  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  formTypeFormInputChange(e) {
    const { formtype } = e.currentTarget.dataset
    const { index } = e.currentTarget.dataset
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${formtype}[${index}].${field}`]: e.detail.value
    })

  },
  // 

  bindMPMobilityTimeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.mobility[${index}].num`]: this.data.mobilityTimeRange[0][value[0]],
      [`formData.mobility[${index}].unit`]: this.data.mobilityTimeRange[1][value[1]],
      [`formData.mobility[${index}].timeValue`]: value
    })
  },
  bindMPCMobilityTimeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  bindMPMobilitySituationChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.mobility[${index}].type`]: this.data.mobilitySituationRange[0][value[0]],
      [`formData.mobility[${index}].subType`]: this.data.mobilitySituationRange[1][value[1]],
      [`formData.mobility[${index}].angle`]: this.data.mobilitySituationRange[2][value[2]],
      [`formData.mobility[${index}].situationValue`]: value
    })
  },
  bindMPCMobilitySituationChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  // 
  // 

  bindMPWeightTimeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.weightBearing[${index}].num`]: this.data.weightTimeRange[0][value[0]],
      [`formData.weightBearing[${index}].unit`]: this.data.weightTimeRange[1][value[1]],
      [`formData.weightBearing[${index}].timeValue`]: value
    })
  },
  bindMPCWeightTimeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value); 
  },
  bindMPWeightSituationChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.weightBearing[${index}].type`]: this.data.weightSituationRange[0][value[0]],
      [`formData.weightBearing[${index}].percent`]: this.data.weightSituationRange[1][value[1]],
      [`formData.weightBearing[${index}].situationValue`]: value
    })
  },
  bindMPCWeightSituationChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      weightSituationRange: this.data.weightSituationRange,
      weightSituationValue: this.data.weightSituationValue
    };
    data.weightSituationValue[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.weightSituationValue[0]) {
          case 0:
            data.weightSituationRange[1] = this.data.wsRange_2_1;
            break;
          case 1:
            data.weightSituationRange[1] = this.data.wsRange_2_2;
            break;
        }
        data.weightSituationValue[1] = 0;
        break;
    }
    //console.log(data.weightSituationValue);
    this.setData(data);
  },

  // 
  bindMPBraceInfoTimeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.braceInfo[${index}].num`]: this.data.braceInfoTimeRange[0][value[0]],
      [`formData.braceInfo[${index}].unit`]: this.data.braceInfoTimeRange[1][value[1]],
      [`formData.braceInfo[${index}].timeValue`]: value
    })
  },
  bindMPCBraceInfoTimeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value); 
  },
  bindMPBraceInfoTypeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.braceInfo[${index}].type`]: this.data.braceInfoTypeRange[0][value[0]],
      [`formData.braceInfo[${index}].typeValue`]: value

    })
  },
  bindMPCBraceInfoTypeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },

  // 
  // 
  bindMPBraceAngleTimeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.braceAngle[${index}].num`]: this.data.braceAngleTimeRange[0][value[0]],
      [`formData.braceAngle[${index}].unit`]: this.data.braceAngleTimeRange[1][value[1]],
      [`formData.braceAngle[${index}].timeValue`]: value
    })
  },
  bindMPCBraceAngleTimeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value); 
  },
  bindMPBraceAngleTypeChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.braceAngle[${index}].type`]: this.data.braceAngleTypeRange[0][value[0]],
      [`formData.braceAngle[${index}].angle`]: this.data.braceAngleTypeRange[1][value[1]],
      [`formData.braceAngle[${index}].typeValue`]: value
    })
  },
  bindMPCBraceAngleTypeChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },

  // 
  // 
  bindMPTissueQualityBoneChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.tissueQuality[${index}].bone`]: this.data.tissueQualityBoneRange[0][value[0]],
      [`formData.tissueQuality[${index}].boneValue`]: value
    })
  },
  bindMPCTissueQualityBoneChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value); 
  },
  bindMPTissueQualityTendonsChange: function (e) {
    var value = e.detail.value
    const { index } = e.currentTarget.dataset
    //console.log('picker发送选择改变，携带值为', value)
    this.setData({
      [`formData.tissueQuality[${index}].tendons`]: this.data.tissueQualityTendonsRange[0][value[0]],
      [`formData.tissueQuality[${index}].tendonsValue`]: value
    })
  },
  bindMPCTissueQualityTendonsChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },

  //上传record文件
  async uploadRecordFile() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '',
      });
      var path = `UserData/${this.data.formData.name}/my-record.mp3`
      wx.cloud.uploadFile({
        cloudPath: path,
        filePath: this.data.tmpFilePath, // 文件路径
      }).then((resp) => {
        wx.hideLoading();
        // console.log(resp);
        if (resp.errMsg === 'cloud.uploadFile:ok') {
          resolve(resp.fileID)
        } else {
          reject(resp.errMsg)
        }
      }).catch((e) => {
        wx.hideLoading();
        reject(e.errMsg)
      });

    })
  },



  //上传formData
  // 
  // 
  async uploadFormData() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'uploadFormData',
          subtype: (this.data.isUpdate ? 'update' : 'add'),
          data: this.data.formData
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

  // 
  // 
  // 
  async submitForm() {
    //选择id="form"的组件
    this.selectComponent('#form').validate(async (valid, errors) => {
      //console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        // console.log('formData', this.data.formData)

        try {
          if (this.data.tmpFilePath != '' && this.data.tmpFilePath != this.data.formData.recordFilePath) { //新的录音需要提交
            const fileId = await this.uploadRecordFile()
            this.setData({
              'formData.recordFilePath': fileId,
            })
          }
          const res = await this.uploadFormData()
          wx.showToast({
            title: '提交成功',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })

        } catch (e) {
          wx.showToast({
            title: e,
            icon: 'error'
          })
        }





      }
    })
  },
  bindGenderChange(e) {
    this.setData({
      genderIdx: e.detail.value,
      'formData.gender': this.data.genderRange[e.detail.value]
    })
  },


  // changeRule(name,state){
  //   var rules = this.data.rules
  //   var idx =rules.findIndex(obj => obj.name === name)

  //   this.setData({
  //     [`rules[${idx}].rules.required`] : state,
  //   })
  // },



  // 
  onAddSurgeryInfo() {
    if (this.data.surgeryNum < 5) {
      var info = this.data.formData.surgery
      var fdata = {
        surgeryName: '',
        doctorName: '',
        surgeryDate: this.data.date
      }
      info.push(fdata)
      this.setData({
        surgeryNum: this.data.surgeryNum + 1,
        'formData.surgery': info
      })
    }
  },
  onDelSurgeryInfo() {
    if (this.data.surgeryNum > 0) {
      var info = this.data.formData.surgery
      info.pop()
      this.setData({
        surgeryNum: this.data.surgeryNum - 1,
        'formData.surgery': info
      })
    }
  },
  // 
  onAddMobilityInfo() {
    if (this.data.MobilityProgress < 5) {
      // 
      this.initMobilityProgressData();

      var info = this.data.formData.mobility
      var timeRange = this.data.mobilityTimeRange
      var situationRange = this.data.mobilitySituationRange
      var date = this.getCurrentDate()
      var fdata = {
        num: timeRange[0][0],
        unit: timeRange[1][0],
        type: situationRange[0][0],
        subType: situationRange[1][0],
        angle: situationRange[2][0],
        timeValue: this.data.mobilityTimeValue,
        situationValue: this.data.mobilitySituationValue,
        date: date
      }
      info.push(fdata)
      this.setData({
        MobilityProgress: this.data.MobilityProgress + 1,
        'formData.mobility': info
      })
    }
  },
  onDelMobilityInfo() {
    if (this.data.MobilityProgress > 0) {
      var info = this.data.formData.mobility
      info.pop()
      this.setData({
        MobilityProgress: this.data.MobilityProgress - 1,
        'formData.mobility': info
      })
    }
  },
  //
  onAddWeightBearingInfo() {
    if (this.data.weightProgress < 5) {
      //
      this.initWeightProgressData();

      var info = this.data.formData.weightBearing
      var timeRange = this.data.weightTimeRange
      var situationRange = this.data.weightSituationRange
      var date = this.getCurrentDate()
      var fdata = {
        num: timeRange[0][0],
        unit: timeRange[1][0],
        type: situationRange[0][0],
        percent: situationRange[1][0],
        timeValue: this.data.weightTimeValue,
        situationValue: this.data.weightSituationValue,
        date: date,
      }
      info.push(fdata)
      this.setData({
        weightProgress: this.data.weightProgress + 1,
        'formData.weightBearing': info
      })
    }
  },
  onDelWeightBearingInfo() {
    if (this.data.weightProgress > 0) {
      var info = this.data.formData.weightBearing
      info.pop()
      this.setData({
        weightProgress: this.data.weightProgress - 1,
        'formData.weightBearing': info
      })
    }
  },
  //

  onAddBraceInfo() {
    if (this.data.braceInfoProgress < 5) {
      //
      this.initBraceInfoProgressData();

      var info = this.data.formData.braceInfo
      var timeRange = this.data.braceInfoTimeRange
      var typeRange = this.data.braceInfoTypeRange
      var date = this.getCurrentDate()
      var fdata = {
        num: timeRange[0][0],
        unit: timeRange[1][0],
        type: typeRange[0][0],
        timeValue: this.data.braceInfoTimeValue,
        typeValue: this.data.braceInfoTypeValue,
        date: date
      }
      info.push(fdata)
      this.setData({
        braceInfoProgress: this.data.braceInfoProgress + 1,
        'formData.braceInfo': info
      })
    }
  },
  onDelBraceInfo() {
    if (this.data.braceInfoProgress > 0) {
      var info = this.data.formData.braceInfo
      info.pop()
      this.setData({
        braceInfoProgress: this.data.braceInfoProgress - 1,
        'formData.braceInfo': info
      })
    }
  },
  //

  onAddBraceAngle() {
    if (this.data.braceAngleProgress < 5) {
      //
      this.initBraceAngleProgressData();

      var info = this.data.formData.braceAngle
      var timeRange = this.data.braceAngleTimeRange
      var typeRange = this.data.braceAngleTypeRange
      var date = this.getCurrentDate()
      var fdata = {
        num: timeRange[0][0],
        unit: timeRange[1][0],
        type: typeRange[0][0],
        angle: typeRange[1][0],
        timeValue: this.data.braceAngleTimeValue,
        typeVale: this.data.braceAngleTypeValue,
        date: date
      }
      info.push(fdata)
      this.setData({
        braceAngleProgress: this.data.braceAngleProgress + 1,
        'formData.braceAngle': info
      })
    }
  },
  onDelBraceAngle() {
    if (this.data.braceAngleProgress > 0) {
      var info = this.data.formData.braceAngle
      info.pop()
      this.setData({
        braceAngleProgress: this.data.braceAngleProgress - 1,
        'formData.braceAngle': info
      })
    }
  },



  //
  // 

  onAddTissueQuality() {
    if (this.data.tissueQualityProgress < 5) {
      //
      this.initTissueQualityProgressData();

      var info = this.data.formData.tissueQuality
      var boneRange = this.data.tissueQualityBoneRange
      var tendonsRange = this.data.tissueQualityTendonsRange
      var date = this.getCurrentDate()
      var fdata = {
        bone: boneRange[0][0],
        tendons: tendonsRange[0][0],
        boneValue: this.data.tissueQualityBoneValue,
        tendonsValue: this.data.tissueQualityTendonsValue,
        date: date
      }
      info.push(fdata)
      this.setData({
        tissueQualityProgress: this.data.tissueQualityProgress + 1,
        'formData.tissueQuality': info
      })
    }
  },
  onDelTissueQuality() {
    if (this.data.tissueQualityProgress > 0) {
      var info = this.data.formData.tissueQuality
      info.pop()
      this.setData({
        tissueQualityProgress: this.data.tissueQualityProgress - 1,
        'formData.tissueQuality': info
      })
    }
  },


  /**
   * 以下是用于"查看/修改页面"
   */

  async selectSingleFormData() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'selectFormData',
          subtype: 'single',
          idx: this.data.updateEntryIdx
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

  updateFormStatus() {
    var tmpFormData = this.data.formData
    var idx = 0;

    if (tmpFormData.gender == '男') {
      idx = 0;
    } else {
      idx = 1;
    }

    this.setData({
      surgeryNum: tmpFormData.surgery.length,
      MobilityProgress: tmpFormData.mobility.length,
      weightProgress: tmpFormData.weightBearing.length,
      braceInfoProgress: tmpFormData.braceInfo.length,
      braceAngleProgress: tmpFormData.braceAngle.length,
      tissueQualityProgress: tmpFormData.tissueQuality.length,
      genderIdx: idx,
      tmpFilePath: tmpFormData.recordFilePath
    })
  },



  async getSingleUserInfo() {
    try {
      const res = await this.selectSingleFormData();//resolve
      // console.log(res);
      await this.setData({
        formData: res.data[0]
      })
      // console.log(this.data.formData);
      this.updateFormStatus();

    } catch (e) {
      wx.showToast({
        title: e,//reject
        icon: 'error'
      })
    }

  },

  async delFormData() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'delFormData',
          idx: this.data.updateEntryIdx,
          name: this.data.formData.name
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

  async delUserInfo() {
    try {
      const res = await this.delFormData()
      wx.showToast({
        title: '删除成功',
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })

    } catch (e) {
      wx.showToast({
        title: e,
        icon: 'error'
      })
    }
  },






  //录音、播放功能
  // 
  onStartRecord() {
    // console.log("onStartRecord")
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能
              // console.log("用户已经同意小程序使用录音功能")
              that.setData({
                recordState: true,
              })
              // recorderManager.start(options)
              recordRecManager.start({
                lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
              })
            },
            fail() {
              // 用户未授权小程序使用录音功能，提示用户开启授权
              wx.showToast({
                title: '请先授权小程序使用录音功能',
                icon: 'error',
              })
            }
          })
        } else {
          // console.log("默认已经同意，直接录音")
          that.setData({
            recordState: true,
          })
          // recorderManager.start(options)
          // 语音开始识别
          recordRecManager.start({
            lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '获取设置失败',
          icon: 'error',
        })
      }
    })

  },
  initRecordManager() {
    var that = this
    recorderManager = wx.getRecorderManager();
    recorderManager.onStop((res) => {
      // console.log('recorder stop', res)
      that.setData({
        tmpFilePath: res.tempFilePath
      })
      // 此处可以对录音文件进行操作，例如播放、上传等
    })
  }
  ,
  onStopRecord() {
    // console.log("onStopRecord")
    // recorderManager.stop()
    // 语音结束识别
    recordRecManager.stop()
    this.setData({
      recordState: false,
    })
  },
  initInnerAudioContext() {
    var that = this
    innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })
    innerAudioContext.onEnded((res) => {
      that.setData({
        playState: false
      })
    })
  }
  ,
  onPlayRecord() {
    // console.log("onplayRecord")
    if (this.data.tmpFilePath != '') {
      innerAudioContext.src = this.data.tmpFilePath
      this.setData({
        playState: true
      })
      innerAudioContext.play()
    } else {
      wx.showToast({
        title: '请先录音',
        icon: 'error',
      })
    }
  },


  initRecordRec() {
    recordRecManager = plugin.getRecordRecognitionManager();

    const that = this;
    // 有新的识别内容返回，则会调用此事件
    recordRecManager.onRecognize = function (res) {
      // console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    recordRecManager.onStart = function (res) {
      // console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    recordRecManager.onError = function (res) {
      // console.error("error msg", res)
    }
    //识别结束事件
    recordRecManager.onStop = function (res) {
      // console.log('..............结束录音')
      // console.log('录音临时文件地址 -->' + res.tempFilePath);
      // console.log('录音总时长 -->' + res.duration + 'ms');
      // console.log('文件大小 --> ' + res.fileSize + 'B');
      // console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) { }
        })
        return;
      }
      // var text = that.data.content + res.result;
      that.setData({
        tmpFilePath: res.tempFilePath
      })
      that.setData({
        'formData.recordContent': res.result
      })
    }
  },


  //
  // 初始化数据
  // 
  initMobilityProgressData() {
    this.setData({

      mobilityTimeRange: [this.data.mtRange_1, this.data.mtRange_2],
      mobilitySituationRange: [this.data.msRange_1, this.data.msRange_2, this.data.msRange_3],
      mobilityTimeValue: [0, 0],
      mobilitySituationValue: [0, 0, 0]
    })
  },
  initWeightProgressData() {
    this.setData({

      weightTimeRange: [this.data.wtRange_1, this.data.wtRange_2],
      weightSituationRange: [this.data.wsRange_1, this.data.wsRange_2_1],
      weightTimeValue: [0, 0],
      weightSituationValue: [0, 0]
    })

  },
  initBraceInfoProgressData() {
    this.setData({

      braceInfoTimeRange: [this.data.biTimeRange_1, this.data.biTimeRange_2],
      braceInfoTypeRange: [this.data.biTypeRange_1],
      braceInfoTimeValue: [0, 0],
      braceInfoTypeValue: [0]
    })

  },
  initBraceAngleProgressData() {
    this.setData({

      braceAngleTimeRange: [this.data.baTimeRange_1, this.data.baTimeRange_2],
      braceAngleTypeRange: [this.data.baTypeRange_1, this.data.baTypeRange_2],
      braceAngleTimeValue: [0, 0],
      braceAngleTypeValue: [0, 0]
    })

  },

  initTissueQualityProgressData() {
    this.setData({

      tissueQualityBoneRange: [this.data.tqBoneRange_1],
      tissueQualityTendonsRange: [this.data.tqTendonsRange_1],
      tissueQualityBoneValue: [0],
      tissueQualityTendonsValue: [0]
    })

  },


  initPageData() {
    this.initMobilityProgressData();
    this.initWeightProgressData();
    this.initBraceInfoProgressData();
    this.initBraceAngleProgressData();
    this.initTissueQualityProgressData();
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options)
    if (Object.keys(options).length === 0) {
      // this.setData({
      //   isUpdate: false
      // })
    } else {
      this.setData({
        isUpdate: true,
        updateEntryIdx: options.index,
        titleValue: 1,
      })
    }
    // console.log("isUpdate:", this.data.isUpdate)



    this.initPageData();

    //初始化录音功能
    // this.initRecordManager();
    //初始化播放音频功能
    this.initInnerAudioContext();
    //初始化语音识别功能
    this.initRecordRec();

    //修改页面
    if (this.data.isUpdate) {
      this.getSingleUserInfo();
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
    // console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // console.log("onHide")
    innerAudioContext.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // console.log("onUnload")
    innerAudioContext.pause();
    innerAudioContext.destroy();
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

  },
})