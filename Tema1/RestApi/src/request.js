class Request {
    constructor(url, method, body)
    {
        this.url = url;
        this.method = method;
        this.body = body;
    }
}

module.exports = {Request}