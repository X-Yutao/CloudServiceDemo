const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
 var params = {
 TableName : "Parts"
 };
 docClient.scan(params, function(err, data){
 callback(err, data);
 });
};