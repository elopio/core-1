class MessageParsingError extends Error {
    /**
     * @param {number} type
     * @param args
     */
    constructor(type, ...args) {
        super(...args);
        Error.captureStackTrace(this, MessageParsingError);
        this._messageType = type;
    }

    /**
     * @type {number}
     */
    get messageType() {
        return this._messageType;
    }
}
Class.register(MessageParsingError);
