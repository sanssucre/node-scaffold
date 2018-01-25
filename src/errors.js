class InternalError extends Error {
  constructor(message, errorCode, httpStatus){
    super(message);
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
  }
}

class AuthError extends InternalError {
  constructor(message, errorCode) {
    super(message, errorCode, 401);
  }
}

class ResourceNotFoundError extends InternalError {
  constructor(message, errorCode) {
    super(message, errorCode, 404);
  }
}

class InvalidRequestContent extends InternalError {
  constructor(validationErrors) {
    super('mising and or malformed request parameters', 'InvalidRequestContent', 400);
    this.validationErrors = validationErrors;
  }
}

module.exports = {
  AuthError,
  ResourceNotFoundError,
  InvalidRequestContent,
};
