const organisationRouter = require('express').Router();
const orgController = require('../controllers/organisation.controller');
const dashboardController = require('../controllers/dashboard.controller');
const utils = require('../utils/utils');

organisationRouter.post('/create', utils.checkAuth, orgController.createOrg);

organisationRouter.get('/userOrgs', utils.checkAuth, orgController.getUserOrgs);

organisationRouter.post('/addMember', utils.checkAuth, orgController.addMember);

organisationRouter.post('/getDashboardData', utils.checkAuth, dashboardController.getDashboardData);

organisationRouter.post(
    '/regsiterAttendance',
    utils.checkAuth,
    utils.handleMultiPart,
    dashboardController.registerAttendance
);

organisationRouter.post('/isAdmin', utils.checkAuth, orgController.isAdmin);

organisationRouter.post('/getAllMembers', utils.checkAuth, orgController.getAllMembers);

organisationRouter.post('/getAnalytics', utils.checkAuth, orgController.getAnalytics);

module.exports = organisationRouter;
