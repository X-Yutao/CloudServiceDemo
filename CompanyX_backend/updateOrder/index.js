const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "PartOrders";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);

 var partId = bd.partId;
 var jobName = bd.jobName;
 var qty = bd.qty;
 var userId = bd.userId;
 
 var params = {
 TableName : tableName,
 Key: {
    partId:{
        N : partId
    },
    jobName:{
        S : jobName  
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
   ConditionExpression: 'attribute_exists(jobName) AND attribute_exists(userId) AND attribute_exists(partId)',
   

 };
docClient.updateItem(params, function(err, data) {
 callback(err, data);
 });
};