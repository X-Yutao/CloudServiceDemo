const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB;
var tableName = "CompanyX";
exports.handler = (event, context, callback) => {
 var bd = JSON.parse(event.body);
 console.log(typeof bd);
 var partId = bd.partId;
 var jobName = bd.jobName;
 var qty = bd.qty;
 var params = {
 TableName : tableName,
 Item:{
    jobName :{
        S: jobName
    },
    partId :{
        N: partId
    },
    qty :{
        N: qty
    }
    },
    ConditionExpression: 'attribute_not_exists(partId)'
 };
docClient.putItem(params, function(err, data) {
    data = "Successful added "
    if(err){
        data = "Data you entered already in db";
    }
    
 callback(err, data);
 });
};