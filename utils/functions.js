const moment = require('jalali-moment');

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

module.exports = {
  groupByDate,
};
