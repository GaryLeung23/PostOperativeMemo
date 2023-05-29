const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();


// 创建集合云函数入口函数
exports.main = async (event, context) => {


  try {
    const res = await db.collection('UserData').count();
    if (res.total != 0) {

      var subtype = event.subtype;
      if (subtype == 'page') {

        //分页返回
        var page = parseInt(event.page);
        var entries = parseInt(event.entries);
        const user = await db.collection('UserData').skip(page * entries).limit(entries).get();
        return {
          success: true,
          data: user.data,
          count: res.total
        }
      } else if (subtype == 'single') {
        //单个返回
        var entryIdx = parseInt(event.idx);
        const user = await db.collection('UserData').skip(entryIdx).limit(1).get();
        return {
          success: true,
          data: user.data,
          count: res.total
        }

      } else {
        return {
          success: false,
          errMsg: '未处理subtype'
        };
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
