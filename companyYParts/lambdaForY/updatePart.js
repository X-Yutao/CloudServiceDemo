const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "Parts";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);

 var partId = bd.partId;
 var partName = bd.partName;
 var qoh = bd.qoh;

 var params = {
 TableName : tableName,
 Key: {partId:{
    S : partId}
 },
 ExpressionAttributeNames: {
   "#q": "qoh"
  },
  ExpressionAttributeValues: {
   ":q": {
     N: qoh
    }
  },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "SET #q = :q",
   ConditionExpression: 'attribute_exists(partId)'

 };
docClient.updateItem(params, function(err, data) {
 callback(err, data);
 });
};