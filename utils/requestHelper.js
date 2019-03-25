
const request = require('request');

function request_get(url) {
    return new Promise( (resolve, reject) => {
        request.get(url, (err, req, body) => {
            if(err) reject(err);
            else {
                resolve({req, body});
            }
        })
    })
}

module.exports = {
    request_get,
};