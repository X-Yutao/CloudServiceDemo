/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  '/': { view: 'pages/homepage' },
  "/login": {view: "pages/login"},
  "POST /login": "UsersController.login",
  "POST /logout": "UsersController.logout",
  "GET /listOrder": "CompanyZController.listOrder",
  "POST /listone": "CompanyZController.listOne491",
  "POST /order": "CompanyZController.makeOrder205",
  "GET /search_history": "CompanyZController.getSearchHist205",

};
