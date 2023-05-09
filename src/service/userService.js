const {createNewUser, authorize, updateUserData} = require( "../client/userClient");
const User = require('../models/User');

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
        specialisation: userToCreate.specialisation
    })

    return user.save();
}

async function updateUser(token, userToUpdate, userId){
    const userSaved = await User.findOne({userId: userId});
    if(!userSaved) return null;
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

    if(!updatedDefaultUser) return null;
    userSaved.userId = userId;
    userSaved.weight = userToUpdate.weight;
    userSaved.height = userToUpdate.height;
    userSaved.clinic = userToUpdate.clinic;
    userSaved.clinicAddress = userToUpdate.clinicAddress;
    userSaved.specialisation = userToUpdate.specialisation;

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
async function authenticateUser(authenticationData){
    const auth = await authorize(authenticationData);
    const token = auth.data;
    return token
}



module.exports = {createUser, authenticateUser, updateUser}