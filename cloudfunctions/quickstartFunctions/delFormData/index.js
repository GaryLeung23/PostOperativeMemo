const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();


// 创建集合云函数入口函数
exports.main = async (event, context) => {


    try {
        var idx = parseInt(event.idx);
        var name = event.name;
        //
        const user = await db.collection('UserData').skip(idx).limit(1).get();
        if (user.data[0].name != name) {
            return {
                success: false,
                errMsg: '用户不存在'
            }
        } else {
            var _id = user.data[0]._id;
            const res = await db.collection('UserData').where({
                _id: _id
            }).remove();

            return {
                success: true,
                delCount: res.stats.removed
            }
        }
    } catch (e) {
        console.error(e)
        return {
            success: false,
            errMsg: '未知错误'
        };
    }
};
