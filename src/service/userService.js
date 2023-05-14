const {createNewUser, authorize, updateUserData, fetchUser, fetchUsersByIds} = require("../client/userClient");
const User = require('../models/User');

function createSearchField(userToCreate){
    return `${userToCreate.name} ${userToCreate.surname} ${userToCreate.specialisation}`
}

async function createUser(userToCreate) {
    const defaultUserView = {
        name: userToCreate.name,
        surname: userToCreate.surname,
        middleName: userToCreate.middleName,
        birthDate: userToCreate.birthDate,
        sex: userToCreate.sex,
        roles: [userToCreate.role],
        phoneNumber: userToCreate.phoneNumber,
        email: userToCreate.email,
        password: userToCreate.password,
    };
    const createdDefaultUser = await createNewUser(defaultUserView);

    const user = new User({
        userId: createdDefaultUser.data,
        weight: userToCreate.weight,
        height: userToCreate.height,
        clinic: userToCreate.clinic,
        clinicAddress: userToCreate.clinicAddress,
        specialisation: userToCreate.specialisation,
        searchField: createSearchField(userToCreate)
    })

    return user.save();
}

async function updateUser(token, userToUpdate, userId) {
    const userSaved = await User.findOne({userId: userId});
    if (!userSaved) return null;
    const defaultUserView = {
        name: userToUpdate.name,
        surname: userToUpdate.surname,
        middleName: userToUpdate.middleName,
        birthDate: userToUpdate.birthDate,
        sex: userToUpdate.sex,
        roles: [userToUpdate.role],
        phoneNumber: userToUpdate.phoneNumber,
        email: userToUpdate.email,
        password: userToUpdate.password,
    };
    const updatedDefaultUser = await updateUserData(token, userId, defaultUserView);
    console.log(updatedDefaultUser)

    if (!updatedDefaultUser) return null;
    userSaved.userId = userId;
    userSaved.weight = userToUpdate.weight;
    userSaved.height = userToUpdate.height;
    userSaved.clinic = userToUpdate.clinic;
    userSaved.clinicAddress = userToUpdate.clinicAddress;
    userSaved.specialisation = userToUpdate.specialisation;
    userSaved.searchField = createSearchField(userToUpdate);

    userSaved.save();
    return {
        userId: userId,
        weight: userSaved.weight,
        height: userSaved.height,
        clinic: userSaved.clinic,
        clinicAddress: userSaved.clinicAddress,
        specialisation: userSaved.specialisation,
        name: updatedDefaultUser.name,
        surname: updatedDefaultUser.surname,
        middleName: updatedDefaultUser.middleName,
        birthDate: updatedDefaultUser.birthDate,
        sex: updatedDefaultUser.sex,
        role: updatedDefaultUser.roles[0],
        phoneNumber: updatedDefaultUser.phoneNumber,
        email: updatedDefaultUser.email,
    }


}

async function authenticateUser(authenticationData) {
    const auth = await authorize(authenticationData);
    const token = auth.data;
    return token
}

async function getUserDataByToken(userId, token) {
    const userSaved = await User.findOne({userId: userId});
    const defaultUserData = await fetchUser(token);
    console.log(defaultUserData)
    return {
        userId: userId,
        weight: userSaved.weight,
        height: userSaved.height,
        clinic: userSaved.clinic,
        clinicAddress: userSaved.clinicAddress,
        specialisation: userSaved.specialisation,
        name: defaultUserData.name,
        surname: defaultUserData.surname,
        middleName: defaultUserData.middleName,
        birthDate: defaultUserData.birthDate,
        sex: defaultUserData.sex,
        role: defaultUserData.roles[0],
        phoneNumber: defaultUserData.phoneNumber,
        email: defaultUserData.email,
        assignedDoctors: userSaved.assignedDoctors
    }
}

function compareUsers (user1, user2, sortField) {
    if(sortField === 'name'){
        if(user1.name < user2.name) { return -1; }
        if(user1.name > user2.name) { return 1; }
        return 0;
    }else if(sortField === 'surname'){
        if(user1.surname < user2.surname) { return -1; }
        if(user1.surname > user2.surname) { return 1; }
        return 0;
    }else if(sortField === 'specialisation'){
        if(user1.specialisation < user2.specialisation) { return -1; }
        if(user1.specialisation > user2.specialisation) { return 1; }
        return 0;
    }
}
async function getClinicDoctors(clinic, token, searchField= '', sortField='name') {
    console.log(sortField)
    const users = await User.find({clinic: clinic, searchField: new RegExp(searchField, 'i')})
    console.log(users)
    if(users.length === 0){
        return []
    }
    const ids = users.map(user => user.userId)
    const defaultUsers = await fetchUsersByIds(token, ids, 'doctor');
    const response = users.map(internalUser => {
        const user = defaultUsers.filter(userData => userData.id === internalUser.userId)[0];
        return {
            name: user.name,
            surname: user.surname,
            middleName: user.middleName,
            specialisation: internalUser.specialisation,
            userId: user.id
        }
    }).sort((user1, user2) => compareUsers(user1, user2, sortField));

    console.log(response)
    return response;
}

async function updateAssignedDoctors(userId, doctorId) {
    return User.findOne({userId: userId}).then(
        async currentUser => {
            if (!currentUser.assignedDoctors || currentUser.assignedDoctors.length === 0) {
                currentUser.assignedDoctors = [doctorId];
            } else if (currentUser.assignedDoctors.includes(doctorId)) {
                currentUser.assignedDoctors = currentUser.assignedDoctors.filter(doctor => doctor !== doctorId);
            } else {
                currentUser.assignedDoctors = [...currentUser.assignedDoctors, doctorId];
            }
            await currentUser.save();
            return currentUser.assignedDoctors;

        }
    );

}


module.exports = {createUser, authenticateUser, updateUser, getUserDataByToken, getClinicDoctors, updateAssignedDoctors}