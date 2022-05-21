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
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        inTime: {
            start: {
                type: String
            },
            end: {
                type: String
            }
        },
        outTime: {
            start: {
                type: String
            },
            end: {
                type: String
            }
        },
        location: {
            latitude: {
                type: String,
                trim: true
            },
            longitude: {
                type: String,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('organisation', organisationSchema);
