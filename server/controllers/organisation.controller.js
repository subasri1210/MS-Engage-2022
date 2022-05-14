const orgModel = require('../models/organisation.model');
const userModel = require('../models/user.model');

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

const getUserOrgs = async(req,res) => {
    try {
        const user  = await userModel.findById(req.user._id).populate('organisations');
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

const getOrgMembers = async (req, res) => {
    try{

        const org = await orgModel.findById(req.body.orgId).populate('members').populate('admins');
        const members = org.members;
        const admins = org.admins;

        return res.status(200).json({
            message: 'Members and admins fetched successfully',
            data: {
                members : members,
                admins: admins
            }
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const addMember = async(req,res) => {
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



module.exports = {
    createOrg,
    addMember,
    getUserOrgs,
    getOrgMembers
};
