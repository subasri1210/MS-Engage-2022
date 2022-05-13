require('../utils/database');
const mongoose = require('mongoose');

const personGroupSchema = new mongoose.Schema(
    {
        isExists : {
            type: Boolean,
            trim: true,
            default: false
        },
        groupId : {
            type: String,
            trim: true,
            default: process.env.PERSON_GROUP_ID
        }
    }
);

module.exports = mongoose.model('admin', personGroupSchema);
