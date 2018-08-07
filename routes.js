const routes = require('next-routes')();

/**
 * routes.js
 * -handles all the pages that requires dynamic routing
 * -other pages next handles by default
 * -after colon comes 'wildcard' (dynamic) part
 * 
 * -add() method:
 *      -defines new route mapping
 *      -first argument is the pattern we want to look for in the URL
 *      -second argument indicates what component we want to show from the pages directory
 *          -new route for /charities/new must be added 'address' mapping because now it thinks 'new' is an address
 *      
 */
routes
    .add('/charities/new', 'charities/new') // this must be first
    .add('/charities/:address', '/charities/show') // only then this can come
    .add('/charities/:address/milestones', '/charities/milestone/index') 
    .add('/charities/:address/milestones/new', '/charities/milestone/new')
    .add('/charities/:address/feedback', '/charities/feedback');



module.exports = routes;