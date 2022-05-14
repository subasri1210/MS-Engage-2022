const organisationRouter = require('express').Router();
const orgController = require('../controllers/organisation.controller');
const utils = require('../utils/utils');

organisationRouter.post('/create',
    utils.checkAuth,
    orgController.createOrg

);

organisationRouter.get('/userOrgs',
    utils.checkAuth,
    orgController.getUserOrgs
);

organisationRouter.get('/orgMembers',
    utils.checkAuth,
    orgController.getOrgMembers
);

organisationRouter.post('/addMember',
    utils.checkAuth,
    orgController.addMember
);

module.exports = organisationRouter;
