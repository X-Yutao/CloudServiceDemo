const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "CompanyX";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);

 var partId = bd.partId;
 var jobName = bd.jobName;
 var qty = bd.qty;
 
 var params = {
 TableName : tableName,
 Key: {
    jobName:{
        S : jobName
    },
    partId:{
        N : partId
    }
 },
 ExpressionAttributeNames: {
   "#q": "qty" 
  }, 
  ExpressionAttributeValues: {
   ":q": {
     N: qty
    }
  }, 
  ReturnValues: "ALL_NEW", 
  UpdateExpression: "SET #q = :q",
   ConditionExpression: 'attribute_exists(partId) AND attribute_exists(jobName)'

 };
docClient.updateItem(params, function(err, data) {
 callback(err, data);
 });
};