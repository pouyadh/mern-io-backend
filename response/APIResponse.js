class APIResponse {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    static success(message) {
        return new APIResponse(200, message);
    }
    static created() {
        return new APIResponse(201, null);
    }
    static noContent() {
        return new APIResponse(204, null);
    }
    static badRequest(message) {
        return new APIResponse(400, message);
    }
    static unauthorized(message) {
        return new APIResponse(401, message);
    }
    static forbidden(message) {
        return new APIResponse(403, message);
    }
    static notFound(message) {
        return new APIResponse(404, message);
    }
    static conflict(message) {
        return new APIResponse(409, message);
    }
    static gone(message) {
        return new APIResponse(410, message);
    }
    static internalServerError(message) {
        return new APIResponse(500, message);
    }
}

module.exports = APIResponse;