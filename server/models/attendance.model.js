require('../utils/database');
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        date: {
            type: Date
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        intime: {
            type: Date
        },
        outime: {
            type: Date
        },
        status: {
            type: String,
            trim: true
        },
        workHours: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('attendance', attendanceSchema);
