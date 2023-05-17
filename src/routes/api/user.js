const express = require('express');
const {createUser, authenticateUser, updateUser, getUserDataByToken, getClinicDoctors, updateAssignedDoctors,
    getDoctorPatients
} = require("../../service/userService");
const {userValidator, validateUser} = require("../../validator/user");
const verifyToken = require("../../middleware/tokenValidator");
const router = express.Router();

router.post('/register', userValidator('createUser'), async (req, res) => {
    console.log(`received request to create new user`)
    const isValid = await validateUser(req, res);
    if (!isValid) {
        return;
    }

    try {
        const newUser = await createUser(req.body)
        res.status(201).json(newUser._id);
        console.log(`request was successfully performed! user with id = ${newUser._id} was created`)
    } catch (err) {
        res.status(err.code).send(err.error.message)
    }

})

router.post('/auth', async (req, res) => {
    console.log(`received request to authenticate user`)
    console.log(req.body)
    try{
        const token = await authenticateUser(req.body);
        res.status(200).json(token);
        console.log(`request was successfully performed! user was successfully authenticated in system and token was sent to client`)
    }catch (err){
        res.status(err.code).send(err.error.message)
    }


})

router.put('/:userId', verifyToken, userValidator('updateUser'), async (req, res) => {
    console.log(`received request to update user with id: ${req.params.userId}`)
    const isValid = await validateUser(req, res);
    if (!isValid) {
        return;
    }

    const updatedUser = await updateUser(req.headers.authorization, req.body, req.params.userId);
    const result = {
        userId: updatedUser.data,
        weight: updatedUser.weight,
        height: updatedUser.height,
        clinic: updatedUser.clinic,
        clinicAddress: updatedUser.clinicAddress,
        specialisation: updatedUser.specialisation,

    }
    res.status(201).json(updatedUser);
    console.log(`request was successfully performed! user with id = ${req.params.userId} was updated`)
})

router.get('/user', verifyToken, async (req, res) => {
  if(!req.user){
      return;
  }
    console.log(req.user)

    const user = await getUserDataByToken(req.user.userId, req.headers.authorization)
    res.status(200).json(user)
})

router.get('/doctors', verifyToken, async  (req, res) => {
    try{
        const doctors = await getClinicDoctors(req.query.clinic, req.headers.authorization, req.query.searchField, req.query.sortField);
        res.status(200).json(doctors)
        console.log(`request was successfully performed! user was successfully authenticated in system and token was sent to client`)
    }catch (err){
        res.status(err.code).send(err.error.message)
    }

})

router.get('/patients', verifyToken, async  (req, res) => {
    try{
        const patients = await getDoctorPatients(req.headers.authorization, req.user, req.query.searchField, req.query.sortField)
        res.status(200).json(patients)
        console.log(`request was successfully performed! user was successfully authenticated in system and token was sent to client`)
    }catch (err){
        res.status(err.code).send(err.error.message)
    }

})

router.patch('/:userId', verifyToken, async (req, res) => {
    const assignedDoctors = await updateAssignedDoctors(req.params.userId, req.body.doctorId);
    res.status(200).json(assignedDoctors)
});


module.exports = router;