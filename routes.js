const routes = require('next-routes')();

routes
    .add('/charities/new', 'charities/new')
    .add('/charities/:address', '/charities/show')
    .add('/charities/:address/milestones', '/charities/milestone/index') 
    .add('/charities/:address/milestones/new', '/charities/milestone/new')
    .add('/charities/:address/feedback', '/charities/feedback');

module.exports = routes;