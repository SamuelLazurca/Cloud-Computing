var uuid = require('uuid');

function generateUuid() {
    return uuid.v4();
}

function getRequestBodyData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (chunk) => {
                console.log('hei');
                body += chunk.toString();
            })

            req.on('end', () => {
                if (body == null || body == undefined || body == '')
                    body = JSON.stringify({});
                
                resolve(body);
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {getRequestBodyData, generateUuid}