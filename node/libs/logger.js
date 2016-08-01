var colors = require('colors');

exports.info = function (message, object) {
    if ( message ) {
        console.log( getTimeForLog().cyan + message.yellow );
    }
    if ( object ) {
        console.log(object);
    }
};

exports.warn = function  ( message, object ) {
    if (message) {
        console.log( getTimeForLog().cyan + message.bold.red   );
    }
    if (object) {
        console.log(object);
    }
};

exports.error = function  ( message, object ) {
    if (message) {
        console.log( getTimeForLog().cyan + message.inverse.red   );
    }
    if (object) {
        console.log(object);
    }
};

exports.trace = function  ( message, object ) {
    if (message) {
        console.log( getTimeForLog().cyan + message.grey  );
    }
    if (object) {
        console.log(object);
    }
};

exports.log = function  ( message, object ) {
    if (message) {
        console.log( getTimeForLog().cyan + message.green   );
    }
    if (object) {
        console.log(object);
    }
};


function getTimeForLog() {
    var timestamp = new Date(),
        hours = formatTime( timestamp.getHours() ),
        mins  = formatTime( timestamp.getMinutes() ),
        sec = formatTime( timestamp.getSeconds() ),
        day = formatTime( timestamp.getDate() ),
        month = formatTime( timestamp.getMonth() + 1),
        year = formatTime( timestamp.getFullYear() );

    return day + "/" + month + "/" + year + " " + hours + ":" + mins + ":" + sec + " -> ";
}

function formatTime (t) {
    if ( parseInt(t, 10) < 10 ) {
        return "0" + String(t);
    }
    else return t;
}