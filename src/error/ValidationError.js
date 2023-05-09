const ValidationError = (message)=>({
    error: new Error(message),
    code: 422
});

const TechnicalError = (message)=>({
    error: new Error(message),
    code: 500
});
module.exports = {ValidationError, TechnicalError}