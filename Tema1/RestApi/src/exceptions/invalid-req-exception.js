class InvalidRequestException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRequestException';
    }
}

module.exports = { InvalidRequestException };