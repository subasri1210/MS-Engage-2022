const attendanceModel = require('../models/attendance.model');
const orgModel = require('../models/organisation.model');
const userModel = require('../models/user.model');

// check if current user is admin or not
const isAdmin = async (req, res) => {
    const { orgId } = req.body;
    const organisation = await orgModel.findById({ orgId });
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    if (isAdmin) {
        return res.status(200).json({
            message: 'true'
        });
    }
    return res.status(200).json({
        message: 'false'
    });
};

// create new organisation
const createOrg = async (req, res) => {
    try {
        const { name, description, inTime, outTime } = req.body;

        if (!(name && description && inTime && outTime)) {
            return res.status(400).json({
                error: 'Please provide all required fields'
            });
        }

        if (name.length === 0) {
            return res.status(400).json({ error: 'Organisation name cannot be empty' });
        } else if (description.length === 0) {
            return res.status(400).json({ error: 'Organisation description cannot be empty' });
        } else if (inTime.start === '' || inTime.end === ''
            || outTime.start === '' || outTime.end === ''
            || inTime.start > inTime.end || outTime.start > outTime.end
            || inTime.start > outTime.start || inTime.end > outTime.end
        ) {
            return res.status(400).json({ error: 'Please provide a valid time range' });
        }

        const org = await new orgModel({ name, description, inTime, outTime });
        await org.admins.push(req.user._id);
        await org.save();

        const user = req.user;
        user.organisations.push(org._id);
        await user.save();

        console.log(org);

        return res.status(200).json({
            message: 'Organisation created successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

// get all organisations of an user
const getUserOrgs = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('organisations');
        const orgs = user.organisations;

        const orgData = orgs.map((data) => {
            return {
                orgId: data._id,
                name: data.name,
                description: data.description,
                inTime: data.inTime,
                outTime: data.outTime,
                location: data.location
            };
        });

        return res.status(200).json({
            message: 'Organisations fetched successfully',
            data: orgData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            err: 'Something went wrong'
        });
    }
};

// add a member to an organisation
const addMember = async (req, res) => {
    try {
        const { orgId, email } = req.body;

        if (!(orgId && email)) {
            return res.status(400).json({
                error: 'Please provide all required fields'
            });
        }

        const org = await orgModel.findById(orgId);
        const user = await userModel.findOne({ email });

        if (!org) {
            return res.status(404).json({
                error: 'Organisation or user not found'
            });
        }

        if (!user) {
            return res.status(404).json({
                error: 'User with this email not found!'
            });
        }

        if (org.admins.indexOf(req.user._id) === -1) {
            return res.status(403).json({
                error: 'You are not an admin of this organisation'
            });
        }

        if (org.members.indexOf(user._id) !== -1) {
            return res.status(409).json({
                error: 'User with this email is already a member of this organisation'
            });
        }

        await org.members.push(user._id);
        await org.save();

        user.organisations.push(org._id);
        await user.save();

        return res.status(200).json({
            message: 'User added successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong'
        });
    }
};

// get data of all members of an organisation
const getAllMembers = async (req, res) => {
    const { orgId } = req.body;
    const org = await orgModel.findById(orgId);
    const organisation = await orgModel.findById(orgId).populate({
        path: 'members',
        select: ['name', 'email']
    }).populate({
        path: 'admins',
        select: ['name', 'email']
    });
    const currentUser = req.user;
    const isAdmin = org.admins.includes(currentUser._id);

    const membersData = organisation.members.map((data) => {
        return {
            userid: data._id,
            name: data.name,
            email: data.email
        };
    });

    const adminsData = organisation.admins.map((data) => {
        return {
            userid: data._id,
            name: data.name,
            email: data.email
        };
    });

    return res.status(200).json({
        isAdmin,
        membersData,
        adminsData
    });
};

// make member to admin
const makeAdmin = async (req, res) => {
    const { orgId, userId } = req.body;
    const organisation = await orgModel.findById({ orgId });
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    if (!isAdmin) {
        return res.status(403).json({
            message: 'You are not an authorised to perform this ation'
        });
    }

    if (organisation.admins.indexOf(userId) !== -1) {
        return res.status(409).json({
            message: 'User is already an admin of this organisation'
        });
    }

    await organisation.admins.push(userId);
    await organisation.save();

    return res.status(200).json({
        message: 'User made admin successfully'
    });
};

// remove member from organisation
const removeMember = async (req, res) => {
    const { orgId, userId } = req.body;
    const organisation = await orgModel.findById({ orgId });
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    if (!isAdmin) {
        return res.status(403).json({
            message: 'You are not an authorised to perform this ation'
        });
    }

    if (organisation.members.indexOf(userId) === -1) {
        return res.status(404).json({
            message: 'User is not a member of this organisation'
        });
    }

    await organisation.members.pull(userId);
    await organisation.save();

    const user = await req.userModel.findById(userId);
    await user.organisations.pull(orgId);
    await user.save();

    await attendanceModel.deleteMany({ user: userId, organisation: orgId });
    await attendanceModel.save();

    return res.status(200).json({
        message: 'User removed successfully'
    });
};

module.exports = {
    createOrg,
    addMember,
    getUserOrgs,
    isAdmin,
    getAllMembers,
    makeAdmin,
    removeMember
};
