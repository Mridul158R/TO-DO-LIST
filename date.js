exports.getDate = function(){    
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date();
    var day = today.toLocaleDateString("en-US", options);
    return day;
};
exports.getDay = function (){    
    var options = { weekday: 'long' };
    var today = new Date();
    var day = today.toLocaleDateString("en-US", options);
    return day;
};