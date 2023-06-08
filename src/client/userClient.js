const axios = require('axios');
const {ValidationError, TechnicalError} = require("../error/ValidationError");
const {log} = require("debug");
const {token} = require("morgan");

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
        if (err.response.status.toString().startsWith("4")) {
            throw ValidationError(err.response.data);
        } else {
            throw TechnicalError(err.response.data);
        }
    }
    return response;


}

const authorize = async (authenticationObj) => {
    try {
        return await MiddlewareService.post('/api/auth', authenticationObj)
    } catch (err) {
        console.log('error while user log in: ', err.response.data);
        if (err.response.status.toString().startsWith("4")) {
            throw ValidationError(err.response.data);
        } else {
            throw TechnicalError(err.response.data);
        }
    }
}

const updateUserData = async (token, userId, userObj) => {
    const user = await MiddlewareService.put(`/api/users/${userId}`, userObj, {
        headers: {
            Authorization: token
        }
    })
    return user.data;
}

const fetchUser = async (token) => {
    const user = await MiddlewareService.get('/api/users/user', {
        headers: {
            Authorization: token
        }
    });
    return user.data
}

const fetchUsersByIds = async (token, ids, role) => {
    const idsStr = ids.join(',');
    const users =await MiddlewareService.get(`/api/users/`, {
        headers: {
            Authorization: token
        },
        params: {
            ids: idsStr,
            role: role
        }
    });
    return users.data
}

const fetchUserDataById = async (token, id) => {
    const user = await MiddlewareService(`/api/users/${id}`, {
        headers: {
            Authorization: token
        }}
    )
    return user.data
}

module.exports = {
    createNewUser,
    authorize,
    updateUserData,
    fetchUser,
    fetchUsersByIds,
    fetchUserDataById
}