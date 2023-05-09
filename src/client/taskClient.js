const axios = require('axios');

const baseURL = 'http://localhost:8080';
const MiddlewareService = axios.create(
    {
        baseURL
    });

const createNewTask = async (taskObj, token) => {
    return await MiddlewareService.post('/api/tasks', taskObj, {headers: {
            Authorization: token
        }});
}

const fetchAllTasks = async (token, role, userId) => {
    const tasks = await MiddlewareService.get(`/api/tasks/` + role + "/" + userId,  {headers: {
        Authorization: token
        }})
    return tasks
}

const fetchTaskById = async (taskId, token) => {
    return await MiddlewareService.get(`/api/tasks/${taskId}`, {headers: {
            Authorization: token
        }})
}

const updateTask = async (taskId, task, token) => {
    return await MiddlewareService.put(`/api/tasks/${taskId}`, task, {headers: {
            Authorization: token
        }});
}

const deleteTask = async (taskId, token) => {
    return await MiddlewareService.delete(`/api/tasks/${taskId}`, {headers: {
        Authorization: token
    }});
}

module.exports = {
    createNewTask,
    fetchAllTasks,
    fetchTaskById,
    updateTask,
    deleteTask
}