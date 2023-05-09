const { body, validationResult} = require('express-validator')

const prescriptionValidator = (method) => {
    switch (method) {
        case 'createPrescription':
        case 'updatePrescription': {
            return [
                body('title', 'title doesn`t exists').exists(),
                body('description', 'description doesn`t exists').exists(),
                body('startDate', 'startDate doesn`t exists').exists(),
                body('endDate', 'endDate doesn`t exists').exists(),
                body('needToRepeat', 'needToRepeat doesn`t exists').exists()
            ]
        }
    }
}

const validatePrescription = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    }
    let task = req.body;
    if(new Date(task.startDate) > new Date(task.endDate)) {
        res.status(422).json("Start date can not be after end date");
        return false;
    }
    if(task.needToRepeat && !task.periodOfRepeat) {
        res.status(400).json("If task repeat is needed, period of repeat is required");
        return false;
    }
    return true;
}

module.exports = {
    prescriptionValidator,
    validatePrescription
}