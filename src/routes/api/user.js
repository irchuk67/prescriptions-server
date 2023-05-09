const express = require('express');
const {createUser, authenticateUser, updateUser} = require("../../service/userService");
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
    const token = await authenticateUser(req.body);
    if (!token) {
        res.status(404).json('user with such email and password wasn`t found');
        console.log(`request crashed. Prescription with email ${req.body.email} wasn't found`)
    }
    res.status(200).json(token);
    console.log(`request was successfully performed! user was successfully authenticated in system and token was sent to client`)
})

router.put('/:userId', verifyToken, userValidator('updateUser'), async (req, res) => {
    console.log(`received request to update user with id: ${req.user.userId}`)
    const isValid = await validateUser(req, res);
    if (!isValid) {
        return;
    }

    const updatedUser = await updateUser(req.headers.authorization, req.body, req.user.userId);
    const result = {
        userId: updatedUser.data,
        weight: updatedUser.weight,
        height: updatedUser.height,
        clinic: updatedUser.clinic,
        clinicAddress: updatedUser.clinicAddress,
        specialisation: updatedUser.specialisation,

    }
    res.status(201).json(updatedUser);
    console.log(`request was successfully performed! user with id = ${req.user.userId} was updated`)
})
module.exports = router;