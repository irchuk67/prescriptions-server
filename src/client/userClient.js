const axios = require('axios');
const {ValidationError, TechnicalError} = require("../error/ValidationError");

const baseURL = 'http://localhost:8080';
const MiddlewareService = axios.create(
    {
        baseURL
    });

const createNewUser = async (userObj) => {
    let response;
    try {
        response = await MiddlewareService.post('/api/users', userObj);
    } catch (err) {
        console.log('error while creating user: ', err.response.data);
        if (err.response.status.toString().startsWith("4")){
            throw ValidationError(err.response.data);
        }else {
            throw TechnicalError(err.response.data);
        }
    }
    return response;



}

const authorize = async (authenticationObj) => {
    return await MiddlewareService.post('/api/auth', authenticationObj)
}

const updateUserData = async (token, userId, userObj) => {
    const user = await MiddlewareService.put(`/api/users/${userId}`, userObj, {headers: {
            Authorization: token
        }})
    return user.data;
}

module.exports = {
    createNewUser,
    authorize,
    updateUserData
}