
const {
    style
} = require('./wxml-to-canvas.js');

let st;
let wxml = '';




Page({
    data: {
        fileID_pdf: '',
        https_pdf: '',
        formData: {
            name: '',
            gender: '男',
            age: '',
            limb: '',
            surgery: [],//surgeryName doctorName surgeryDate
            mobility: [],//mobilityNum mobilityUnit  mobilityType mobilitySubType mobilityAngle date
            weightBearing: [],//num unit type percent date
            braceInfo: [],// type num unit date
            braceAngle: [],//num unit type angle date
            tissueQuality: [],
            recordFilePath: '',
            recordContent: '',
        },
        windowWidth: 0,
        windowHeight: 0
    },

    generateSubtitle(wxml, subtitle) {
        wxml += `<view class="line"></view>
                    <text class="text_1">${subtitle}</text>
                <view class="line"></view>`
        return wxml;
    },


    generateWxmlTitle(wxml) {
        wxml += `<view class="title">
                    <text class="title">运动学术后备忘录</text>
                 </view>
                 `
        return wxml;
    },

    generateWxmlPatientInfo(wxml) {
        const formData = this.data.formData;
        wxml += `
                <view class="container_row">
                    <view class="text_2 ">
                        <text class="text_2 text_align_left">姓名: ${formData.name}</text>
                        <text class="text_2 text_align_left">性别: ${formData.gender}</text>
                    </view>
                    <view class="text_2">   
                        <text class="text_2 text_align_left">年龄: ${formData.age}</text>
                        <text class="text_2 text_align_left">患肢: ${formData.limb}</text>
                    </view>
                </view>`
        return wxml;
    },
    generateWxmlSurgeryInfo(wxml) {
        const data = this.data.formData.surgery;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">手术${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col surgery_height">
                        <text class="text_1 text_align_left">手术名称: ${item.surgeryName}</text>
                        <text class="text_1 text_align_left">手术时间: ${item.surgeryDate}</text> 
                        <text class="text_1 text_align_left">主刀医生: ${item.doctorName}</text>
                </view>`
        })

        return wxml;
    },
    generateWxmlMobProgress(wxml) {
        const data = this.data.formData.mobility;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">病历${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col mobility_height">
                        <text class="text_1 text_align_left">检查时间: ${item.date}</text>
                        <text class="text_1 text_align_left">情况: ${item.num}${item.unit}内${item.type}${item.subType}不超过${item.angle}</text> 
                </view>`
        })

        return wxml;
    },
    generateWxmlWBProgress(wxml) {
        const data = this.data.formData.weightBearing;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">病历${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col weight_bearing_height">
                        <text class="text_1 text_align_left">检查时间: ${item.date}</text>`
            if (item.type == '不负重') {
                wxml += `<text class="text_1 text_align_left">情况: ${item.num}${item.unit}内${item.type}</text>`
            } else {
                wxml += `<text class="text_1 text_align_left">情况: ${item.num}${item.unit}内${item.type}不超过${item.percent}</text>`
            }

            wxml += `</view>`
        })

        return wxml;
    },
    generateWxmlBIProgress(wxml) {
        const data = this.data.formData.braceInfo;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">病历${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col brace_info_height">
                        <text class="text_1 text_align_left">检查时间: ${item.date}</text>
                        <text class="text_1 text_align_left">情况: ${item.type}佩带至术后${item.num}${item.unit}</text> 
                </view>`
        })

        return wxml;
    },
    generateWxmlBAProgress(wxml) {
        const data = this.data.formData.braceAngle;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">病历${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col brace_angle_height">
                        <text class="text_1 text_align_left">检查时间: ${item.date}</text>
                        <text class="text_1 text_align_left">情况: ${item.num}${item.unit}内支具${item.type}${item.angle}</text> 
                </view>`
        })

        return wxml;
    },
    generateWxmlTQuality(wxml) {
        const data = this.data.formData.tissueQuality;
        data.forEach((item, index) => {
            // console.log(e);
            wxml += `
                <text class="text_1">病历${index + 1}</text>
                <view class="sub_line"></view>
                <view class="container_col tissue_quality_height">
                        <text class="text_1 text_align_left">检查时间: ${item.date}</text>
                        <text class="text_1 text_align_left">情况: 骨质量${item.bone},肌腱质量${item.tendons}</text> 
                </view>`
        })

        return wxml;
    },
    generateWxmlNotes(wxml) {
        const content = this.data.formData.recordContent;
        if (!content || content == '') {
            wxml += `<text class="text_1 text_align_left content_height">无</text>`
        } else {
            wxml += `<text class="text_1 text_align_left content_height">${content}</text>`
        }


        return wxml;
    },

    generateWxml() {
        // console.log('generateWxml');

        wxml = `<view class="container">`
        //标题
        wxml = this.generateWxmlTitle(wxml);

        //个人信息
        wxml = this.generateSubtitle(wxml, '个人信息');
        wxml = this.generateWxmlPatientInfo(wxml);
        //手术
        wxml = this.generateSubtitle(wxml, '手术信息');
        wxml = this.generateWxmlSurgeryInfo(wxml);

        //情况
        wxml = this.generateSubtitle(wxml, '患肢活动度进展');
        wxml = this.generateWxmlMobProgress(wxml);

        wxml = this.generateSubtitle(wxml, '患肢负重进展');
        wxml = this.generateWxmlWBProgress(wxml);

        wxml = this.generateSubtitle(wxml, '支具/前臂吊带');
        wxml = this.generateWxmlBIProgress(wxml);

        wxml = this.generateSubtitle(wxml, '支具角度进展');
        wxml = this.generateWxmlBAProgress(wxml);

        wxml = this.generateSubtitle(wxml, '组织质量');
        wxml = this.generateWxmlTQuality(wxml);

        //备注
        wxml = this.generateSubtitle(wxml, '备注');
        wxml = this.generateWxmlNotes(wxml);

        wxml += `</view>`
    },




    async canvasToImage() {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });
            this.widget.canvasToTempFilePath().then(res => {
                wx.hideLoading();
                // console.log(res)
                resolve(res.tempFilePath)
            }).catch(err => {
                wx.hideLoading();
                reject(err)
            })

        })
    },

    async uploadImageFile(filePath) {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });
            const cloudPath = 'wxmlToPdf-img/' + parseInt(new Date().getTime() / 1000) + '.png';
            wx.cloud.uploadFile({
                cloudPath: cloudPath,
                filePath: filePath, // 文件路径
            }).then(resp => {
                wx.hideLoading();
                // console.log(res)
                if (resp.errMsg === 'cloud.uploadFile:ok') {
                    resolve(resp.fileID)
                } else {
                    reject(resp.errMsg)
                }
            }).catch(err => {
                wx.hideLoading();
                reject(err.errMsg)
            })
        })
    },
    async imageToPdf(savePath, fileID) {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });

            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'wxmlToPdf',
                    width: this.container.layoutBox.width,
                    height: this.container.layoutBox.height,
                    imgFileID: fileID,
                    fileSavePath: savePath,

                }
            }).then(res => {
                wx.hideLoading()
                resolve(res.result)
            }).catch(err => {
                wx.hideLoading();
                reject(err.errMsg)
            })


        })
    },
    async delTempFile(filePath) {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });

            wx.cloud.deleteFile({
                fileList: [filePath], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
            }).then((resp) => {
                wx.hideLoading();
                // console.log(resp);
                if (resp.errMsg == "cloud.deleteFile:ok") {
                    resolve(resp.fileList[0].fileID)
                } else {
                    reject(resp.fileList[0].errMsg)
                }
            }).catch((e) => {
                wx.hideLoading();
                reject(e.fileList[0].errMsg)
            });

        })
    },


    // 生成PDF
    async createPDF() {
        try {


            const tempFilePath = await this.canvasToImage();
            // console.log(tempFilePath)
            const fileID = await this.uploadImageFile(tempFilePath);
            // console.log(fileID)
            const savePath = `UserData/${this.data.formData.name}/` + 'Memo' + '.pdf';
            const res = await this.imageToPdf(savePath, fileID);
            // console.log("imageToPdf res:", res)
            const delFile = await this.delTempFile(fileID);
            // console.log(delFile)
            this.setData({
                fileID_pdf: res.data.fileID,
                https_pdf: res.data.pdf
            })
            wx.showToast({
                title: '生成成功！'
            })

        } catch (e) {
            // console.log(e)
            wx.showToast({
                title: e,
                icon: 'error'
            })
        }
    },




    // 预览PDF
    previewPDF() {
        // pdf文件在云服务器的id
        let fileID_pdf = this.data.fileID_pdf;
        // console.log(fileID_pdf)
        if (fileID_pdf == '') {
            wx.showToast({
                title: '请先生成PDF',
                icon: 'none'
            })
            return false;
        }
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.downloadFile({
            fileID: fileID_pdf
        }).then(res => {
            // console.log(res)
            wx.openDocument({
                filePath: res.tempFilePath,
                showMenu: true,
                success: function (res) {
                    wx.hideLoading();
                }
            })
        }).catch(error => {
            // handle error
        })
    },

    // 复制PDF链接
    copyPDF() {
        // PDF文件在云服务器上的https链接
        let https_pdf = this.data.https_pdf;
        // console.log(https_pdf)
        if (https_pdf == '') {
            wx.showToast({
                title: '请先生成PDF',
                icon: 'none'
            })
            return false;
        }
        wx.setClipboardData({
            data: https_pdf,
            success(res) {
                wx.showToast({
                    title: '复制成功，快到浏览器打开/下载！',
                    icon: 'none',
                    duration: 3000
                })
            }
        })
    },



    // 把页面数据渲染到canvas
    renderToCanvas() {
        // console.log("renderToCanvas")



        this.widget.renderToCanvas({
            wxml: wxml,
            style: st
        }).then((res) => {
            // console.log('container', res.layoutBox)
            this.container = res
        }).catch(err => {
            // console.log(err)
            // 防止canvas组件没有初始化完成
            setTimeout(() => {
                this.renderToCanvas()
            }, 100);
        })
    },






    initStyle() {
        // console.log("initStyle")
        // console.log(wx.getSystemInfoSync().screenWidth,wx.getSystemInfoSync().screenHeight)
        // console.log(wx.getSystemInfoSync().windowWidth,wx.getSystemInfoSync().windowHeight)

        let width = wx.getSystemInfoSync().windowWidth;
        let height = 1300;

        this.setData({
            windowWidth: width,
            windowHeight: height
        })
        // console.log(this.data.windowWidth,this.data.windowHeight)
        // 为了美观，把画布的宽度设置成屏幕的100%
        let wRatio = 0.8
        let styles = {
            containerWidth: width,
            containerHeight: height,
            containerRowWidth: width * wRatio,
            containerColWidth: width * wRatio,
            titleWidth: width * wRatio,
            text1Width: width * wRatio,
            text2Width: width * wRatio / 2,
            lineWidth: width * wRatio,
            subLineWidth: width * wRatio * wRatio,
        }
        st = style(styles)



        // console.log(st)
    },


    initCanvas() {
        // 获取wxml-to-canvas组件的节点
        // console.log("initCanvas")
        // console.log("wxml:",wxml)

        this.widget = this.selectComponent('.widget')
        // console.log("widget:",this.widget)
        this.renderToCanvas()
    },



    //获取数据
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

    async getSingleUserInfo() {


        // console.log("getSingleUserInfo")
        try {
            const res = await this.selectSingleFormData();//resolve
            // console.log(res);
            this.setData({
                formData: res.data[0]
            })
            // console.log(this.data.formData);


        } catch (e) {
            wx.showToast({
                title: e,//reject
                icon: 'error'
            })
        }

    },



    async getCanvasData() {
        this.initStyle()
        await this.getSingleUserInfo();
        this.generateWxml();
        await this.initCanvas()
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log("downloadPatientMemo",options.index)
        this.setData({
            updateEntryIdx: options.index
        })

        this.getCanvasData();

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

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