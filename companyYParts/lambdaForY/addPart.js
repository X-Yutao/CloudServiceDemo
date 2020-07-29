const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "Parts";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);
 console.log(typeof bd);
 var partId = bd.partId;

 var partName = bd.partName;
 var qoh = bd.qoh;
 var params = {
 TableName : tableName,
 Item:{
    partId :{
        N: partId
    },
    partName :{
        S: partName
    },
    qoh :{
        N: qoh
    }
    },
    ConditionExpression: 'attribute_not_exists(partId)'
 };
docClient.putItem(params, function(err, data) {

 callback(err, data);
 });
};