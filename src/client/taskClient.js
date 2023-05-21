const axios = require('axios');

const baseURL = 'http://localhost:8080';
const MiddlewareService = axios.create(
    {
        baseURL
    });

const createNewTask = async (taskObj, token) => {
    return await MiddlewareService.post('/api/tasks', taskObj, {
        headers: {
            Authorization: token
        }
    });
}

const fetchAllTasks = async (token, role, userId, assigneeId) => {
    return await MiddlewareService.get(`/api/tasks/` + role + "/" + userId, {
        headers: {
            Authorization: token
        },
        params: {
            assigneeId: assigneeId
        }
    })
}

const fetchTaskById = async (taskId, token) => {
    return await MiddlewareService.get(`/api/tasks/${taskId}`, {
        headers: {
            Authorization: token
        }
    })
}

const updateTask = async (taskId, task, token) => {
    return await MiddlewareService.put(`/api/tasks/${taskId}`, task, {
        headers: {
            Authorization: token
        }
    });
}

const deleteTask = async (taskId, token) => {
    return await MiddlewareService.delete(`/api/tasks/${taskId}`, {
        headers: {
            Authorization: token
        }
    });
}

const fetchDailyTasks = async (token, assigneeId) => {
    return await MiddlewareService.get("")
}

const changeTaskStatus = async (token, taskId) => {
    const response =  await MiddlewareService.patch(`/api/tasks/${taskId}`, {},
        {
                headers: {
                    Authorization: token
                }
        })
    return response.data
}

const getDailyTasks = async (token) => {
    return await MiddlewareService.get('/api/tasks/daily', {
        headers:{
            Authorization: token
        }
    })
}

module.exports = {
    createNewTask,
    fetchAllTasks,
    fetchTaskById,
    updateTask,
    deleteTask,
    changeTaskStatus,
    getDailyTasks
}