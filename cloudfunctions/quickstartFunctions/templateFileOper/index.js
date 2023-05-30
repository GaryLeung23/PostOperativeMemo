const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const MAX_LIMIT = 100;

exports.main = async (event, context) => {

    let subtype = event.subtype;

    try {
        await db.createCollection('TemplateFile');//collection名字不能中文
    } catch (e) {
        //
    }


    try {
        if (subtype === 'add') {
            let fileInfo = event.fileInfo
            //删除同名
            // const user = await db.collection('TemplateFile').where({
            //     name: fileInfo.name  // 筛选条件
            // }).get()
            // // console.log(user);
            // if (user.data.length != 0) {
            //     //循环删除记录
            //     for (let i = 0; i < user.data.length; i++) {
            //         await db.collection('TemplateFile').doc(user.data[i]._id).remove()
            //     }
            // }
            await db.collection('TemplateFile').add({
                // data 字段表示需新增的 JSON 数据
                    data: fileInfo
            });
            return {
                success: true
            };

        } else if(subtype === 'del') {
            let fileInfo = event.fileInfo
            await db.collection('TemplateFile').doc(fileInfo._id).remove()
            return {
                success: true
            };
        } else if(subtype === 'query'){
            // 先取出集合记录总数
            const countResult = await db.collection('TemplateFile').count()
            //这里先只能处理100条文件
            const data = await db.collection('TemplateFile').skip(0).limit(MAX_LIMIT).get()
            return {
                success: true,
                count : countResult.total,
                data : data.data
            }

        }else{



        }

    } catch (e) {
        console.error(e)
        return {
            success: false,
            errMsg: '未知错误'
        };
    }
};
