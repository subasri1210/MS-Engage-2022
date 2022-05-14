require('../utils/database');
const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        inTime: {
            start: {
                type: Date
            },
            end: {
                type: Date
            }
        },
        outTime: {
            start: {
                type: Date
            },
            end: {
                type: Date
            }
        },
        location: {
            latitude: {
                type: Number,
                trim: true
            },
            longitude: {
                type: Number,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('organisation', organisationSchema);
