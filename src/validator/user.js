const {body, validationResult} = require('express-validator')
const {existsByEmail, existsByPhoneNumber} = require("../service/userService");

const userValidator = (method) => {
    switch (method) {
        case 'createUser':
        case 'updateUser': {
            return [
                body('name', 'name doesn`t exist').exists(),
                body('surname', 'surname doesn`t exist').exists(),
                body('middleName', 'middleName doesn`t exist').exists(),
                body('birthDate', 'birthdate doesn`t exist').exists(),
                body('sex', 'sex doesn`t exist').exists(),
                body('phoneNumber', 'no phone number entered').exists().isMobilePhone(),
                body('email', 'Invalid email').exists().isEmail(),
                body('password', 'Invalid password').exists().isStrongPassword(),
                body('role', 'role doesn`t exist').exists(),
                body('role', 'role doesn`t exist').exists(),
                body('clinic', 'clinic doesn`t exist').exists(),
                body('clinicAddress', 'clinicAddress doesn`t exist').exists()
            ]
        }
    }
}

const validateUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return false;
    }

    if (!['patient', 'doctor'].includes(req.body.role)) {
        res.status(400).send("role is incorrect. it should be equal to patient or doctor");
        return false;
    }

    return true;
}

module.exports = {userValidator, validateUser}

