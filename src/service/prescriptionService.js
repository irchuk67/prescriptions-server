const mongoose = require('mongoose');
const {createNewTask, fetchAllTasks, fetchTaskById, deleteTask, updateTask, getDailyTasks, changeTaskStatus} = require("../client/taskClient");
const Prescription = mongoose.model('Prescription');

async function fetchPrescriptions(token, user, assigneeId) {
    const {roles, userId} = user;
    let role;
    if (roles[0] === 'patient') {
        role = 'assignee'
    } else if (roles[0] === 'doctor') {
        role = 'creator'
    }

    const tasks = await fetchAllTasks(token, role, userId, assigneeId);
    let taskIds = tasks.data.map(task => task.id);
    const prescriptions = await Prescription.find({'taskId': {$in: taskIds}});

    return prescriptions.map(prescription => {
        const task = tasks.data.filter(task => task.id === prescription.taskId)[0];
        return {
            id: prescription.id,
            title: task.title,
            description: task.description,
            startDate: task.startDate,
            endDate: task.endDate,
            needToRepeat: task.needToRepeat,
            periodOfRepeat: task.periodOfRepeat,
            createdBy: task.createdBy,
            assignee: task.assignee,
            isReady: task.isReady,
            medicines: JSON.parse(task.neededInstruments[0])
        };
    })

}

async function fetchPrescriptionById(id, token) {
    let prescription = await Prescription.findById(id);
    if (!prescription) {
        return;
    }
    const task = await fetchTaskById(prescription.taskId, token);
    let taskData = task.data;

    return {
        id: prescription.id,
        title: taskData.title,
        description: taskData.description,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        needToRepeat: taskData.needToRepeat,
        periodOfRepeat: taskData.periodOfRepeat,
        assignee: taskData.assignee,
        isReady: taskData.isReady,
        medicine: JSON.parse(taskData.neededInstruments[0])
    };
}

async function fetchDailyPrescriptions(token){
    const dailyTasks = await getDailyTasks(token);
    let taskIds = dailyTasks.data.map(task => task.id);
    const prescriptions = await Prescription.find({'taskId': {$in: taskIds}});

    return prescriptions.map(prescription => {
        const task = dailyTasks.data.filter(task => task.id === prescription.taskId)[0];
        return {
            id: prescription.id,
            title: task.title,
            description: task.description,
            startDate: task.startDate,
            endDate: task.endDate,
            needToRepeat: task.needToRepeat,
            periodOfRepeat: task.periodOfRepeat,
            createdBy: task.createdBy,
            assignee: task.assignee,
            isReady: task.isReady,
            medicines: JSON.parse(task.neededInstruments[0])
        };
    })

}

async function changePrescriptionStatus(token, prescriptionId){
    const prescription = await Prescription.findById(prescriptionId);
    const changed =  await changeTaskStatus(token, prescription.taskId);
    console.log(changed)
    return {
        id: prescription._id,
        title: changed.title,
        description: changed.description,
        startDate: changed.startDate,
        endDate: changed.endDate,
        needToRepeat: changed.needToRepeat,
        periodOfRepeat: changed.periodOfRepeat,
        createdBy: changed.createdBy,
        assignee: changed.assignee,
        isReady: changed.isReady,
        medicines: JSON.parse(changed.neededInstruments[0])
    }
}
async function deletePrescription(id, token) {
    return Prescription.findById(id)
        .then(prescription => {
            if (!prescription) return;
            deleteTask(prescription.taskId, token)
                .then(response => response)
                .catch(err => {
                    if (err.status === 404) {
                        console.log("task was already deleted")
                        return;
                    }
                    console.log("Error", err);
                })
            return Prescription.deleteOne(prescription)
                .catch(err => console.log(err))
        });
}

async function createPrescription(prescription, token) {
    console.log(prescription)
    const taskToCreate = {
        title: prescription.title,
        description: prescription.description,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        needToRepeat: prescription.needToRepeat,
        periodOfRepeat: prescription.periodOfRepeat,
        assignee: prescription.assignee,
        isReady: prescription.isReady,
        neededInstruments: [JSON.stringify(prescription.medicines)]
    }

    const created = await createNewTask(taskToCreate, token);
    if (!created) return;
    const newPrescription = new Prescription({
        taskId: created.data.id
    })
    return newPrescription.save();
}

async function updatePrescription(id, updatedPrescription, token) {
    const prescriptionToUpdate = await Prescription.findById(id);
    if (!prescriptionToUpdate) return;

    const taskToUpdate = {
        title: updatedPrescription.title,
        description: updatedPrescription.description,
        startDate: updatedPrescription.startDate,
        endDate: updatedPrescription.endDate,
        needToRepeat: updatedPrescription.needToRepeat,
        periodOfRepeat: updatedPrescription.periodOfRepeat,
        assignee: updatedPrescription.assignee,
        isReady: updatedPrescription.isReady,
        neededInstruments: [JSON.stringify(updatedPrescription.medicine)]
    }
    const updatedTask = await updateTask(prescriptionToUpdate.taskId, taskToUpdate, token);
    const updatedTaskData = updatedTask.data;
    return {
        id: prescriptionToUpdate._id,
        title: updatedTaskData.title,
        description: updatedTaskData.description,
        startDate: updatedTaskData.startDate,
        endDate: updatedTaskData.endDate,
        needToRepeat: updatedTaskData.needToRepeat,
        periodOfRepeat: updatedTaskData.periodOfRepeat,
        assignee: updatedTaskData.assignee,
        isReady: updatedTaskData.isReady,
        medicine: JSON.parse(updatedTaskData.neededInstruments[0])
    };
}

module.exports = {
    updatePrescription,
    fetchPrescriptions,
    fetchPrescriptionById,
    deletePrescription,
    createPrescription,
    fetchDailyPrescriptions,
    changePrescriptionStatus
}