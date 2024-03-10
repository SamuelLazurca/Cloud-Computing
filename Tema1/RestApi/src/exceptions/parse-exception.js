class ParseException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParseException';
    }
}

module.exports = { ParseException };