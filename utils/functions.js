const moment = require('jalali-moment');
const fs = require('fs');

const groupByDate = (array, field) => {
  let groupedArr = [];
  array.forEach(function (e) {
    //look for an existent group
    let group = groupedArr.find(
      (g) =>
        moment(g['field']).format('YYYY/MM/DD') ===
        moment(e[field]).format('YYYY/MM/DD')
    );
    if (group == undefined) {
      //add new group if it doesn't exist
      group = { field: e[field], groupList: [] };
      groupedArr.push(group);
    }

    //add the element to the group
    group.groupList.push(e);
  });

  return groupedArr;
};

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('file removed');
  });
};

const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    return fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = {
  groupByDate,
  deleteFile,
  createDirectory,
};
