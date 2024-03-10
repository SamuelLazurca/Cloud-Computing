class DBException extends Error {
    constructor(message) {
        super(message);
        this.name = 'DBException';
    }
}

module.exports = { DBException };