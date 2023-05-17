const express = require('express');
const {createPrescription, fetchPrescriptions, fetchPrescriptionById, updatePrescription, deletePrescription} = require("../../service/prescriptionService");
const {CREATED, NOT_FOUND, OK} = require("../../constants/HTTPCodes");
const verifyToken = require("../../middleware/tokenValidator");
const {validatePrescription, prescriptionValidator} = require("../../validator/prescription");
const {validateUser} = require("../../validator/user");
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    console.log("received request to get all prescriptions")
    console.log(req.user)
    if(!req.user) {
        return;
    }
    let prescriptions = await fetchPrescriptions(req.headers.authorization, req.user);
    res.status(200).json(prescriptions)
    console.log("request successfully performed. Prescriptions were send to user")
});

router.get('/:userId', verifyToken, async (req, res) => {
    console.log("received request to get all prescriptions for user with id: ", req.params.userId)
    if(!req.user) {
        return;
    }
    let prescriptions = await fetchPrescriptions(req.headers.authorization, req.user, req.params.userId);
    res.status(200).json(prescriptions)
    console.log("request successfully performed. Prescriptions were send to user")
});

router.get('/:prescriptionId', verifyToken, async (req, res) => {
    console.log("received request to get prescription with id: ", req.params.prescriptionId)

    let prescription = await fetchPrescriptionById(req.params.prescriptionId, req.headers.authorization);
    if(!prescription){
        res.status(NOT_FOUND).send('no prescription found');
        console.log(`request crashed. Prescription with id = ${req.params.prescriptionId} wasn't found`)
        return;
    }
    res.status(200).json(prescription);
    console.log(`request successfully performed. Prescription with id = ${req.params.prescriptionId} - send to user`)
});

router.post('/',  verifyToken, prescriptionValidator('createPrescription'), async (req, res, next) => {
    const isValid = validatePrescription(req, res);
    if (!isValid) {
        return;
    }
    console.log("received request to create new prescription with body: ", req.body)

       const prescription = await createPrescription(req.body,req.headers.authorization);
       res.status(CREATED).json(prescription);
       console.log(`request successfully performed. Prescription with id = ${prescription._id} - was created and id was sent to user`)/* catch (err){
        next(err)
   }*/

});

router.put('/:prescriptionId', prescriptionValidator('updatePrescription'), verifyToken, async (req, res) => {
    const isValid = validatePrescription(req, res);
    if (!isValid) {
        return;
    }
    console.log("received request to update prescription with id: ", req.params.prescriptionId, ". And with body: ", req.body)
    const prescription = await updatePrescription(req.params.prescriptionId, req.body, req.headers.authorization);
    if(!prescription){
        res.status(404).send("no prescriptions found");
        console.log(`request crashed. Prescription with id = ${req.params.prescriptionId} wasn't found`)
        return;
    }
    res.status(OK).json(prescription);
    console.log(`request successfully performed. Prescription with body = ${prescription} - was updated and sent to user`)
});

router.delete('/:prescriptionId', verifyToken, async (req, res) => {
    console.log("received request to delete prescription with id: ", req.params.prescriptionId)
    let deleted = await deletePrescription(req.params.prescriptionId, req.headers.authorization);
    if(!deleted) {
        res.status(404).send("no prescriptions found");
        console.log(`request crashed. Prescription with id = ${req.params.prescriptionId} wasn't found`)
        return;
    }

    res.status(204).send("Successfully deleted");
    console.log(`request successfully performed. Prescription with id = ${req.params.prescriptionId} - was successfully deleted`)
});

module.exports = router;