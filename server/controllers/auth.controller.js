const userModel = require('../models/user.model');
const faceController = require('./faceapi.controller');
const personGroupModel = require('../models/persongroup.model');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            console.log('Please provide all required fields!');
            return res.status(400).json({ error: 'Please provide all required fields!' });
        }
        const user = await userModel.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: 'User not found' });
        }
        const token = await user.generateAuthToken();
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const faceLogin = async (req, res) => {
    try {
        if (req.file.filename == null || req.file.filename == undefined) {
            res.status(400).json({ error: 'User Image not found' });
        }
        let [detectFaceResponse, detectFaceErr] = await faceController.detectFace(req.file.filename);
        if (detectFaceErr) {
            return res.status(400).json({ error: detectFaceErr.message });
        }
        if (detectFaceResponse.length == 0) {
            return res.status(400).json({ error: 'No face detected' });
        }
        if (detectFaceResponse.length > 1) {
            return res.status(400).json({ error: 'More than one face detected' });
        }
        let faceId = detectFaceResponse[0].faceId;

        let [identifiedPersonResponse, identifyErr] = await faceController.identifyPerson(faceId);
        if (identifyErr) {
            console.log('identify error');
            return res.status(400).json({ error: identifyErr.message });
        }
        console.log(identifiedPersonResponse);
        if (identifiedPersonResponse == null) {
            return res.status(400).json({ error: 'Something went wrong! Please try again later' });
        }
        if (identifiedPersonResponse.length == 0) {
            return res.status(400).json({ error: 'No person identified' });
        }
        if (identifiedPersonResponse[0].candidates.length == 0) {
            return res.status(400).json({ error: 'No person identified' });
        }

        let personId = identifiedPersonResponse[0].candidates[0].personId;
        const user = await userModel.findOne({ personId });
        const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({ token });
        await user.save();
    
        console.log(user);
        res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Unable to login' });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!(email && password && name)) {
            return res.status(400).json({ error: 'Please provide all required fields!' });
        }

        const findUser = await userModel.findOne({ email });
        if (findUser) {
            return res.status(400).json({ error: 'User with this email already exists!' });
        }
        if (req.file == null || req.file == undefined) {
            res.status(400).json({ error: 'Error while uploading the file' });
        }

        if ((await personGroupModel.estimatedDocumentCount()) == 0) {
            console.log('inside create person group');
            let err = await faceController.createPersonGroup();
            if (err != null) {
                return res.status(400).json({ error: err.message });
            }
        }

        let [personId, createPersonErr] = await faceController.createPerson(email);
        if (createPersonErr) {
            return res.status(400).json({ error: 'Something went wrong! Please try again later!' });
        }

        let [persistedFaceId, addFaceErr] = await faceController.createFace(personId, req.file.filename);
        if (addFaceErr) {
            console.log('add face error');
            return res.status(400).json({ error: 'Please upload an image with a single face!' });
        }

        let trainErr = await faceController.trainPersonGroup();
        if (trainErr) {
            return res.status(400).json({ error: 'Error while training the faces! Please try again later!' });
        }

        const user = new userModel({ email, password, name, personId, persistedFaceId });
        await user.save();

        res.status(201).json({ message: 'Successfully signed up!' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Something went wrong! Please try again later!' });
    }
};

module.exports = {
    login,
    register,
    faceLogin
};
