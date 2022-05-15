const fs = require('fs');
const path = require('path');
const axios = require('axios');
const personGroupModel = require('../models/persongroup.model');

const api_base_url = process.env.AZURE_API_BASE_URL;
const personGroupId = process.env.PERSON_GROUP_ID;
const resourceKey = process.env.AZURE_OCM_KEY;

const detectFace = async (imageName) => {
    let detectFaceResponse = null,
        error = null;
    await axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/detect?`,
        params: {
            returnFaceId: true
        },
        headers: {
            'content-type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': resourceKey
        },
        data: fs.readFileSync(path.join(__dirname, '../public/images', imageName))
    })
        .then((response) => {
            detectFaceResponse = response.data;
            console.log('face detected successfully', detectFaceResponse);
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return [detectFaceResponse, error];
};

const createPersonGroup = async () => {
    let error = null;
    await axios({
        method: 'PUT',
        baseURL: `${api_base_url}/face/v1.0/persongroups/${personGroupId}`,
        headers: {
            'Ocp-Apim-Subscription-Key': resourceKey,
            'content-type': 'application/json'
        },
        data: JSON.stringify({
            name: 'Face First',
            userData: 'Admin person group for face first'
        })
    })
        .then(async () => {
            await new personGroupModel({ isExists: true }).save();
            console.log('person group successfully created');
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return error;
};

const createPerson = async (email) => {
    let error = null,
        personId = null;
    await axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/persongroups/${personGroupId}/persons`,
        headers: {
            'Ocp-Apim-Subscription-Key': resourceKey,
            'content-type': 'application/json'
        },
        data: JSON.stringify({
            name: email
        })
    })
        .then((response) => {
            console.log(response.data);
            personId = response.data.personId;
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });

    return [personId, error];
};

const createFace = async (personId, imageName) => {
    let createFaceResponse = null,
        error = null;
    await axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
        headers: {
            'content-type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': resourceKey
        },
        data: fs.readFileSync(path.join(__dirname, '../public/images', imageName))
    })
        .then((response) => {
            console.log('face detected successfully', response.data);
            createFaceResponse = response.data.persistedFaceId;
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return [createFaceResponse, error];
};

const trainPersonGroup = async () => {
    let error = null;
    await axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/persongroups/${personGroupId}/train`,
        headers: {
            'Ocp-Apim-Subscription-Key': resourceKey
        }
    })
        .then(() => {
            console.log('Training started');
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return error;
};

const identifyPerson = async (faceId) => {
    let identifyPersonResponse = null,
        error = null;
    await axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/identify`,
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': resourceKey
        },
        data: JSON.stringify({
            personGroupId: personGroupId,
            faceIds: [faceId],
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.5
        })
    })
        .then((response) => {
            console.log('face identified successfully', response.data);
            identifyPersonResponse = response.data;
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return [identifyPersonResponse, error];
};

const verifyFace = (faceId, personId) => {
    let verifyFaceResponse = null,
        error = null;
    axios({
        method: 'post',
        baseURL: `${api_base_url}/face/v1.0/verify`,
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': resourceKey
        },
        data: JSON.stringify({
            faceId: faceId,
            personId: personId,
            personGroupId: personGroupId
        })
    })
        .then((response) => {
            console.log('face verified successfully', response.data);
            verifyFaceResponse = response.data;
        })
        .catch((err) => {
            console.log(err);
            error = err;
        });
    return [verifyFaceResponse, error];
};

module.exports = {
    detectFace,
    createPersonGroup,
    createPerson,
    createFace,
    trainPersonGroup,
    identifyPerson,
    verifyFace
};
