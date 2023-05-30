// pages/importRehabTemplate/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileNum: 0,
        fileList: [],//name,fileID,basename
        currentId: -1,
        slideButtons: [{
            // text: '打开',
            src: '../../../images/file-open.svg', // icon的路径
        }, {
            // text: '喜好',
            src: '../../../images/like.svg' // icon的路径
        }, {
            // text: '删除',
            src: '../../../images/delete_light.svg' // icon的路径
        }],
    },









    slideShowTap(e) {
        const { index } = e.currentTarget.dataset
        this.setData({
            currentId: index
        })
    },


   

    async openPdf(idx){
        return new Promise((resolve, reject) => {
            const fileID = this.data.fileList[idx].fileID
            wx.showLoading({
                title: '',
            });
            wx.cloud.downloadFile({
                fileID: fileID,
            }).then(res => {
                wx.openDocument({
                    filePath: res.tempFilePath,
                }).then(res => {
                    wx.hideLoading();
                    resolve(res)
                }).catch(err => {
                    wx.hideLoading();
                    reject(err)
                })
            }).catch(err => {
                wx.hideLoading();
                reject(err.errMsg)
            })
        })

    },

    async delCloudPdf(fileID){
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });
            wx.cloud.deleteFile({
                fileList: [fileID], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
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
    async delPdf(idx){
        try{
            let fileList = this.data.fileList
            const fileID = fileList[idx].fileID;
            const res = await this.delCloudPdf(fileID);
            // console.log(res)
            const res2 = await this.delTemplateFileList(fileList[idx]);

            //删除this.data.fileList特定的idx对应的值
            fileList.splice(idx,1)
            this.setData({
                fileNum:  this.data.fileNum -1,
                fileList: fileList,
            })

            wx.showToast({
                title: '删除成功',
            })  
        }catch(e){
            console.log(e)
            wx.showToast({
                title: err,
                icon: 'error'
              })
        }


    },


    async slideButtonTap(e) {
        // console.log('slide button tap', e.detail)
        const funcValue = e.detail.index;
        const idx = this.data.currentId;
        if(funcValue == 0){
            await this.openPdf(idx)
        }else if(funcValue == 1){
            //设置为偏好
            
        }else if(funcValue == 2){
            await this.delPdf(idx)
        }
        this.setData({
            currentId: -1
        })
    },

    async chooseFile() {
        return new Promise((resolve, reject) => {
            wx.chooseMessageFile({
                count: 1,
                type: 'file',
            }).then(res => {
                resolve(res.tempFiles[0])
            }).catch(err => {
                reject(err)
            })
        })
    },

    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '',
            });
            wx.cloud.uploadFile({
                cloudPath: file.cloudPath,
                filePath: file.path,
            }).then(res => {
                wx.hideLoading();
                resolve(res.fileID)
            }).catch(err => {
                wx.hideLoading();
                reject(err)
            })
        })
    },

    async onSelectFile() {
        try{
            const file = await this.chooseFile();
            const cloudPath = "rehabTemplate/" + parseInt(new Date().getTime() / 1000) + '.pdf'//加入时间戳确保唯一
            let fileInfo = {
                path:file.path,
                cloudPath:cloudPath,
            }
            // console.log(file)
            const fileID = await this.uploadFile(fileInfo);//重名自动覆盖

            let fileList = this.data.fileList
            let info = {
                name: cloudPath,
                basename:file.name,
                fileID: fileID
            }

            // console.log(fileList)
            const res = await this.uploadTemplateFileList(info);

            fileList.push(info)
            this.setData({
                fileNum: this.data.fileNum + 1,
                fileList: fileList,
            })


            // console.log(res)
            wx.showToast({
                title: '导入成功',
            })  
        }catch(err){
            console.log(err);
            wx.showToast({
                title: err,
                icon: 'error'
              })
        }
        

    },


    async uploadTemplateFileList(fileInfo){
        return new Promise((resolve, reject) => {
            wx.showLoading({
            title: '',
            });
            wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'templateFileOper',
                subtype:'add',
                fileInfo:fileInfo
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
    async delTemplateFileList(fileInfo){
        return new Promise((resolve, reject) => {
            wx.showLoading({
            title: '',
            });
            wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'templateFileOper',
                subtype:'del',
                fileInfo:fileInfo
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









    async getTemplateFileList(){
        return new Promise((resolve, reject) => {
            wx.showLoading({
            title: '',
            });
            wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'templateFileOper',
                subtype:'query'
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

    async getFileList(){
        const fileList = await this.getTemplateFileList()
        // console.log(fileList)
        this.setData({
            fileNum:fileList.count,
            fileList:fileList.data
        })
        // console.log(this.data.fileList)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getFileList()

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