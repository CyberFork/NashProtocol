const LocalData = {
  fetch: function() {
    //整个取
    let _oracles = JSON.parse(localStorage.getItem("Datas") || "[]");
    return _oracles;
  },
  save: function(_oracles) {
    //整个存
    localStorage.setItem("Datas", JSON.stringify(_oracles));
  },
};
const LocalData_Cache = {
  fetch: function(LS_NetWork) {
    //整个取
    let _oracles = JSON.parse(localStorage.getItem(LS_NetWork + "Cache") || "[]");
    return _oracles;
  },
  save: function(_oracles, LS_NetWork) {
    //整个存
    localStorage.setItem(LS_NetWork + "Cache", JSON.stringify(_oracles));
  },
};
const LocalData_Sent = {
  fetch: function(LS_NetWork) {
    //整个取
    let _oracles = JSON.parse(localStorage.getItem(LS_NetWork + "Sent") || "[]");
    return _oracles;
  },
  save: function(_oracles, LS_NetWork) {
    //整个存
    localStorage.setItem(LS_NetWork + "Sent", JSON.stringify(_oracles));
  },
};
const LocalData_WaitJoin = {
  fetch: function(LS_NetWork) {
    //整个取
    let _oracles = JSON.parse(localStorage.getItem(LS_NetWork + "Listening") || "[0]");
    return _oracles;
  },
  save: function(_oracles, LS_NetWork) {
    //整个存
    localStorage.setItem(LS_NetWork + "Listening", JSON.stringify(_oracles));
  },
};
const myDate = new Date();

export { LocalData, LocalData_Cache, LocalData_Sent, LocalData_WaitJoin, myDate };
