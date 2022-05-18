const startOfDay = require('date-fns/startOfDay');
const endOfDay = require('date-fns/endOfDay');

const orgModel = require('../models/organisation.model');
const attendanceModel = require('../models/attendance.model');
const faceController = require('../controllers/faceapi.controller');

const getDashboardData = async (req, res) => {
    const { orgId } = req.body;
    const organisation = await orgModel.findById(orgId);
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    if (!isAdmin && !organisation.members.includes(currentUser._id)) {
        return res.status(401).json({
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
        const attendanceRecorded = await attendanceModel
            .find({
                organisation: orgId,
                date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }
            })
            .populate('user', 'name');

        const attendanceLog = attendanceRecorded.map((data) => {
            return {
                name: data.user.name,
                intime: data.intime,
                outime: data.outime,
                status: data.status
            };
        });
        return res.status(200).json({
            isAdmin,
            totalEmployees,
            totalIns,
            totalOuts,
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
        if (!(attendanceRecorded.intime && attendanceRecorded.outime)) {
            attendanceResponse = 'nointime';
        } else {
            //registered intime but not outtime
            if (attendanceRecorded.intime && !attendanceRecorded.outime) {
                attendanceResponse = 'in';
            } else if (attendanceRecorded.intime && attendanceRecorded.outime) {
                // registered outtime
                attendanceResponse = 'out';
            }
        }
        // handle whether user is marking attendance in proper intime or outime in frontend
        return res.status(200).json({
            isAdmin,
            attendanceResponse,
            actualInTime: organisation.intime,
            actualOutTime: organisation.outtime
        });
    }
};

const registerAttendance = async (req, res) => {
    const { orgId } = req.body;
    const organisation = orgModel.findById({ orgId });
    const currentUser = req.user;

    if (!organisation.members.includes(currentUser._id)) {
        return res.status(401).json({
            message: 'You are not authorized to view this page'
        });
    }
    if (req.file.filename == null || req.file.filename == undefined) {
        res.status(400).json({ error: 'User Image not found' });
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
    let attendance = attendanceModel.findOne({
        organisation: orgId,
        user: currentUser._id,
        date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }
    });

    if (attendance) {
        if (attendance.intime && attendance.outime) {
            return res.status(400).json({ error: 'Already marked attendance' });
        } else if (attendance.intime && !attendance.outime) {
            attendance.outime = new Date();
            attendance.status = 'out';
            await attendance.save();
            return res.status(200).json({ message: 'Out attendance marked' });
        }
    } else {
        attendance = new attendanceModel({
            organisation: orgId,
            user: currentUser._id,
            date: new Date(),
            intime: new Date(),
            status: 'in'
        });
    }
};

module.exports = {
    getDashboardData,
    registerAttendance
};
