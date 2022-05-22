const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');
const mongoose = require('mongoose');

const orgModel = require('../models/organisation.model');
const attendanceModel = require('../models/attendance.model');
const faceController = require('../controllers/faceapi.controller');
const userModel = require('../models/user.model');

const getDashboardData = async (req, res) => {
    const { orgId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orgId)) {
        return res.status(402).json({
            error: 'Organisation not found'
        });
    }

    const organisation = await orgModel.findById(orgId);
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    if (!organisation) {
        return res.status(402).json({
            error: 'Organisation not found'
        });
    }

    if (!isAdmin && !organisation.members.includes(currentUser._id)) {
        return res.status(400).json({
            error: 'You are not authorized to view this page'
        });
    }

    if (isAdmin) {
        // admin dashboard data

        const totalEmployees = organisation.members.length;
        const totalIns = await attendanceModel.find({
            organisation: orgId,
            date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
            intime: { $exists: true }
        });
        const totalOuts = await attendanceModel.find({
            organisation: orgId,
            date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
            outime: { $exists: true }
        });

        const attendanceLogInfo = organisation.members.map(async (member) => {
            let attendance = await attendanceModel.findOne({
                organisation: orgId,
                user: member,
                date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }
            }).populate('user', 'name');
            if (!attendance) {
                let user = await userModel.findById(member);
                return {
                    name: user.name,
                    intime: '-',
                    outime: '-',
                    status: 'Not marked in'
                };
            }
            else {
                let intime = '-', outime = '-';
                if (attendance.intime) {
                    intime = new Date(attendance.intime);
                    intime = intime.getHours() + ':' + intime.getMinutes();
                }
                if (attendance.outime) {
                    outime = new Date(attendance.outime);
                    outime = outime.getHours() + ':' + outime.getMinutes();
                }
                return {
                    name: attendance.user.name,
                    intime,
                    outime,
                    status: attendance.status
                };
            }
        });

        const attendanceLog = await Promise.all(attendanceLogInfo);

        return res.status(200).json({
            orgName: organisation.name,
            isAdmin,
            totalEmployees,
            totalIns,
            totalOuts,
            organisationInTime: organisation.inTime,
            organisationOutTime: organisation.outTime,
            attendanceLog
        });
    } else {
        // member dashboard data

        const attendanceRecorded = await attendanceModel.findOne({
            organisation: orgId,
            user: currentUser._id,
            date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }
        });
        let attendanceResponse = '';

        //didn't registered intime
        if (!attendanceRecorded) {
            attendanceResponse = 'Not marked in';
        } else {
            //registered intime but not outtime
            if (attendanceRecorded.intime && !attendanceRecorded.outime) {
                attendanceResponse = 'In';
            } else if (attendanceRecorded.intime && attendanceRecorded.outime) {
                // registered outtime
                attendanceResponse = 'Out';
            }
        }

        return res.status(200).json({
            isAdmin,
            attendanceResponse,
            orgId: organisation._id,
            orgName: organisation.name,
            organisationInTime: organisation.inTime,
            organisationOutTime: organisation.outTime
        });
    }
};

// register attendance by employee
const registerAttendance = async (req, res) => {
    const { orgId, latitude, longitude } = req.body;
    const organisation = await orgModel.findById(orgId);
    const currentUser = req.user;

    if (!organisation.members.includes(currentUser._id)) {
        return res.status(400).json({
            message: 'You are not authorized to view this page'
        });
    }
    if (req.file == null || req.file == undefined) {
        res.status(400).json({ error: 'User Image not found' });
    }

    if (!(parseInt(organisation.location.latitude) <= parseInt(latitude) + 10
        && parseInt(organisation.location.latitude) >= parseInt(latitude) - 10)) {
        return res.status(400).json({ error: 'You are not located in the organisation location' });
    }

    if (!(parseInt(organisation.location.longitude) <= parseInt(longitude) + 10
        && parseInt(organisation.location.longitude) >= parseInt(longitude) - 10)) {
        return res.status(400).json({ error: 'You are not located in the organisation location' });
    }

    // detect face
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
    let personId = await currentUser.personId;

    // verify face
    let [verifyFaceResponse, verifyFaceErr] = await faceController.verifyFace(faceId, personId);
    if (verifyFaceErr) {
        return res.status(400).json({ error: verifyFaceErr.message });
    }
    if (!verifyFaceResponse.isIdentical) {
        return res.status(400).json({ error: 'Face not matched' });
    }
    if (verifyFaceResponse.isIdentical && verifyFaceResponse.confidence < 0.4) {
        return res.status(400).json({ error: 'Face not matched' });
    }

    // add attendance
    let attendance = await attendanceModel.findOne({
        organisation: orgId,
        user: currentUser._id,
        date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }
    });

    if (attendance) {
        if (attendance.intime && attendance.outime) {
            return res.status(400).json({ error: 'Already marked attendance' });
        } else if (attendance.intime && !attendance.outime) {
            attendance.outime = new Date();
            attendance.status = 'Out';
            await attendance.save();
            return res.status(200).json({ message: 'Out attendance marked' });
        }
    } else {
        attendance = await new attendanceModel({
            organisation: orgId,
            user: currentUser._id,
            date: new Date(),
            intime: new Date(),
            status: 'In'
        });
        await attendance.save();
    }
    res.status(200).json({ message: 'attendance marked' });
};

module.exports = {
    getDashboardData,
    registerAttendance
};
