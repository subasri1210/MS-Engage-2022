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
        ins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        outs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }]
    }
);

module.exports = mongoose.model('attendance', attendanceSchema);
