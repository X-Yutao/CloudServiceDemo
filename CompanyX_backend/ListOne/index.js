const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var tableName = "CompanyX";
exports.handler = (event, context, callback) => {
 var params = {
 TableName : tableName,
 Key : {
 "jobName" : event.jobName,
 "partId" : parseInt(event.partId)
 }
 };
 docClient.get(params, function(err, data){
 callback(err, data);
 });
};