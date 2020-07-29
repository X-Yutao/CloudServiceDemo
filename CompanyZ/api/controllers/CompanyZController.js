var rp = require('request-promise');
const cheerio = require('cheerio');
var request941 = require('request');



module.exports = {
    listOrder: function(req,res){
        JobParts.find().exec(function(err,orders){
            if(err){
                res.send(500, 'database error');
            }
            res.view('pages/listOrder', {orders:orders});

        });
        console.log(req.session);
    },
    listOne491:function(req, res){
        var jobName = req.body.jobName;
        var partId = req.body.partId;
        //console.log(jobName)
        //console.log(partId)
        var request = require('request');

        request.get({
          url: 'https://71lghtvx78.execute-api.us-east-1.amazonaws.com/wwg6/listone?jobName='+ jobName +'&partId='+partId
        }, function(error, response, body) {
          if (error) {
            sails.log.error(error);
          }
          else {    

            var data = JSON.parse(body);  
            var jobName = data.Item.jobName;
            var partId = data.Item.partId;
            var qty = data.Item.qty;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            console.log(jobName)
            console.log(partId)
            console.log(qty)
            if(jobName===""||partId===""){
                res.send({
                    code: "400",
                    message: "job not exist in database" }) ;  
            }
            else{
                search.create({jobName: jobName, date: dd, month: mm} ).exec(function(err){
                    if(err){
                        res.send(500,{error:'Database error'});
                    }
            
                }) 
                res.view('pages/search',{jobName:jobName,partId:partId,qty:qty});  
            }
          }
        });
    },
    getSearchHist205: function(req,res){
        search.find({}).exec(function(err,historys){
            if(err){
                res.send(500, 'database error');
            }
            res.view('pages/search_history', {historys:historys});

        });
        
    },

    makeOrder205:function(req, res){
        var jobName = req.body.jobName || req.params.jobName;
        var partId = req.body.partId ||req.params.partId;
        var order_num = req.body.order_qty ||req.params.order_qty;
        var request = require('request');

        request.get({
          url: 'https://71lghtvx78.execute-api.us-east-1.amazonaws.com/wwg6/listone?jobName='+ jobName +'&partId='+partId
        }, function(error, response, body) {
          if (error) {
            sails.log.error(error);
          }
          else {    

            var data = JSON.parse(body);  
            var jobName = data.Item.jobName;
            var partId = data.Item.partId;
            var qty = data.Item.qty;
            //console.log(jobName)
            //console.log(partId)
            //console.log(qty)
            var userId = -1;
            if(typeof req.session.Users[0] != 'undefined'){
                userId = req.session.Users[0].id;
            }
            var date = new Date().toDateString();
            var time = new Date().toTimeString()
            var result = -1;
            JobParts.find({userId: userId}).exec(function(err, result941){//查jobparts里有没有这个userId的记录, 用来判断result
                if(err){
                    res.send(500,{error:'Database error'});
                }
                else{
                    console.log(result941);
                    if(result941.length == 0){//无记录
                        result = 1;//result可
                    }
                    else{//有记录
                        result = 0;//result不可
                    }

                    console.log("partId: "+parseInt(partId));
                    console.log("jobName: "+jobName);
                    console.log("userId: "+userId);
                    console.log("max_qty: "+qty);
                    console.log("order_qty: "+parseInt(order_num));
                    console.log("date: "+date);
                    console.log("time: "+time);
                    console.log("result: "+result);

                    if(parseInt(qty) >= parseInt(order_num)){
                        JobParts.create({ 
    
                                        partId: parseInt(partId),
                                         jobName: jobName, 
                                         userId: userId, 
                                         qty: parseInt(order_num), 
                                         date: date, 
                                         time: time, 
                                         result: result
                                        
                                        }).exec(function(err){
                                            if(err){
                                                res.send(500,{error:'Database error'});
                                            }
                                            res.redirect("/listOrder");               
                                        })

                                        if(result == 1){//如果result可(order有效), 系统会把order发到X和Y
                                            //给X发Order
                                            var changedqty =(parseInt(qty)-parseInt(order_num));
                                            var optX491 ={
                                                method: 'PUT',
                                                uri: 'https://71lghtvx78.execute-api.us-east-1.amazonaws.com/wwg6/updatejob',
                                                json:{
                                                    "body": "{\"jobName\":\""+jobName+"\",\"partId\":\""+partId+"\", \"qty\" : \""+changedqty+"\"}"
                                                }
                                            };
                                            //console.log('https://a6grop6x.azurewebsites.net/job/update/'+jobName+'/'+partId);
                                            console.log("changedqty: "+changedqty);
                                            optX491.simple = false;

                                            rp(optX491)
                                                .then((response)=>{
                                                    //console.log(response);
                                                })
                                                .catch((err)=>{
                                                    console.log("update job"+err);
                                                });
                                        
                                            var optX941 = {
                                                uri: 'http://companyx.s3-website-us-east-1.amazonaws.com/companyX-addJob.html',
                                                method: 'POST',
                                                json:{
                                                    "body": "{\"jobName\":\""+jobName+"\",\"partId\":\""+partId+"\", \"qty\" : \""+order_num+"\",\"userId\":\""+userId+"\"}"
                                                }
                                            };

                                            request941(optX941, function(err, res, body){
                                                if(err){
                                                    console.log(err);
                                                }
                                                else{
                                                    if(res.statusCode == 200){
                                                        //console.log(body.id);
                                                    }
                                                    else{
                                                        console.log("ERR! HTTP Status: " + res.statusCode);
                                                    }
                                                }
                                            })
                                            var request1 = require('request');

                                            request1.get({
                                              url: 'https://zo05m564u0.execute-api.us-east-1.amazonaws.com/Dev/getonepart?partId='+partId
                                            }, function(error, response, body) {
                                              if (error) {
                                                sails.log.error(error);
                                              }
                                              else {    
                                                var data1 = JSON.parse(body);  
                                                var qtyinstock = data1.Item.qoh;
                                                var partName = data1.Item.partName;
                                                var partId = data1.Item.partId;
                                                var instock = (parseInt(qtyinstock)-parseInt(order_num));

                                                var optY491 ={
                                                    method: 'PUT',
                                                    uri: 'https://zo05m564u0.execute-api.us-east-1.amazonaws.com/Dev/updatepart',
                                                    json:{
                                                        "body": "{\"partName\":\""+partName+"\",\"partId\":\""+partId+"\", \"qoh\" : \""+instock+"\"}"
                                                    }
                                                };

                                                optY491.simple = false;

                                                rp(optY491)
                                                    .then((response)=>{
                                                        //console.log(response);
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err);
                                                    });

                                                    var optY941 = {
                                                        uri: 'https://24u44s77al.execute-api.us-east-1.amazonaws.com/DEV/addneworder',
                                                        method: 'POST',
                                                        json:{
                                                            "body": "{\"jobName\":\""+jobName+"\",\"partId\":\""+partId+"\", \"qty\" : \""+order_num+"\",\"userId\":\""+userId+"\"}"
                                                        }

                                                    };
                                                    request941(optY941, function(err, res, body){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                        else{
                                                            if(res.statusCode == 200){
                                                                //console.log(body.id);
                                                            }
                                                            else{
                                                                console.log("ERR! HTTP Status: " + res.statusCode);
                                                            }
                                                        }
                                                    })
                                    

                                              }
                                            });
                                        }
                    }
                    else{
                        res.send(400,{error:'qty you ordered cannot larger than max qty'});
                    }
                }
            })

          }
        });

    }
  
};
