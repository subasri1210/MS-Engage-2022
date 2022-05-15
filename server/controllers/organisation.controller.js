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

        if (!(name && inTime && outTime)) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        const org = await new orgModel({ name, description, inTime, outTime });
        await org.admins.push(req.user._id);
        await org.save();

        const user = req.user;
        user.organisations.push(org._id);
        await user.save();

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

        return res.status(200).json({
            message: 'Organisations fetched successfully',
            data: orgs
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

// add a member to an organisation
const addMember = async (req, res) => {
    try {
        const { orgId, email } = req.body;

        if (!(orgId && email)) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        const org = await orgModel.findById(orgId);
        const user = await req.userModel.findOne({ email });

        if (!org || !user) {
            return res.status(404).json({
                message: 'Organisation or user not found'
            });
        }

        if (org.admins.indexOf(req.user._id) === -1) {
            return res.status(403).json({
                message: 'You are not an admin of this organisation'
            });
        }

        if (org.members.indexOf(user._id) !== -1) {
            return res.status(409).json({
                message: 'User is already a member of this organisation'
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
            message: 'Something went wrong'
        });
    }
};

// get data of all members of an organisation
const getAllMembers = async (req, res) => {
    const { orgId } = req.body;
    const organisation = await orgModel.findById({ orgId }).populate({
        path: 'members',
        select: ['name', 'email']
    });
    const currentUser = req.user;
    const isAdmin = organisation.admins.includes(currentUser._id);

    let user;
    if (isAdmin) {
        user = 'admin';
    } else {
        user = 'member';
    }

    const members = organisation.members;
    const memberData = members.map((data) => {
        return {
            currentUser: user,
            userid: data._id,
            name: data.name,
            email: data.email
        };
    });
    return res.status(200).json({
        message: 'Members fetched successfully',
        data: memberData
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
