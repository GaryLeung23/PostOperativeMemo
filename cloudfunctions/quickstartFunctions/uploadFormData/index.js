const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();


// 创建集合云函数入口函数
exports.main = async (event, context) => {

  var formData = event.data;
  var subtype = event.subtype;

  try {
    await db.createCollection('UserData');//collection名字不能中文
  } catch (e) {
    //
  }

  try {

    if (subtype === 'add') {
      const user = await db.collection('UserData').where({
        name: formData.name  // 筛选条件
      }).get()
      // console.log(user);
      if (user.data.length == 0) {
        await db.collection('UserData').add({
          // data 字段表示需新增的 JSON 数据
          data: formData
        });
        return {
          success: true
        };
      } else {
        return {
          success: false,
          errMsg: '用户已存在'
        };
      }
    } else {
      // console.log(formData);   
      var _id = formData._id;
      delete formData._id;//删除掉_id
      const res = await db.collection('UserData').doc(_id).update({
        // data 传入需要局部更新的数据
        data: formData
      });
      // console.log(res);
      return {
        success: true
      };
    }


  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    console.error(e);
    return {
      success: false,
      errMsg: '未知错误'
    };
  }




};
