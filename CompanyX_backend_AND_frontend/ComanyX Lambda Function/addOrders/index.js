const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "PartOrders";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);
 console.log(typeof bd);
 var partId = bd.partId;
 var jobName = bd.jobName;
 var userId = bd.userId;
 var qty = bd.qty;
 var params = {
 TableName : tableName,
 Item:{
    partId :{
        N: partId
    },
    jobName :{
        S: jobName
    },
    userId :{
        S: userId
    },
    qty :{
        N: qty
    }
    },
    ConditionExpression: 'attribute_not_exists(jobName) AND attribute_not_exists(userId) AND attribute_not_exists(partId)'
 };
docClient.putItem(params, function(err, data) {
    data = "Order successfully added!";
    if(err){
        data = "Already in db";
    }
 callback(err, data);
 });
};