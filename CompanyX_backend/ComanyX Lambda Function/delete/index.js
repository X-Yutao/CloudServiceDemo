const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "CompanyX";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);

 var partId = bd.partId;
 var jobName = bd.jobName;
 
 var params = {
 TableName : tableName,
 Key: {
    jobName:{
        S: jobName
    },
    partId:{
        N : partId
    }
 },
 ConditionExpression: 'attribute_exists(jobName) AND attribute_exists(partId)'
 };
docClient.deleteItem(params, function(err, data) {
 data = "Data deleted!";
 if(err){
     data = "The job informtion you want delete is not exist"
 }
 callback(err, data);
 });
};