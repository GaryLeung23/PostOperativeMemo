const uploadFormData = require('./uploadFormData/index');
const selectFormData = require('./selectFormData/index');
const delFormData = require('./delFormData/index');
const wxmlToPdf = require('./wxmlToPdf/index');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'uploadFormData':
      return await uploadFormData.main(event, context);
    case 'selectFormData':
      return await selectFormData.main(event, context);
    case 'delFormData':
      return await delFormData.main(event, context);
    case 'wxmlToPdf':
      return await wxmlToPdf.main(event, context);
  }
};
