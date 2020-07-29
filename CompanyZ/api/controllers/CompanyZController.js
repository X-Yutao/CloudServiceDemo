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
        //console.log(partId);
        var options = {
            method: 'GET',
            uri: 'https://a6grop6x.azurewebsites.net/job/listone/?jobName='+ jobName +'&partId='+partId,
            json: true
        };

        rp(options)
            .then((response) => {
                //console.log(response);
                const $ = cheerio.load(response);
                //console.log(options);
                //console.log($('body > div > table > tbody > tr > td:nth-child(1)').text());
                //console.log($('body > div > table > tbody > tr > td:nth-child(2)').text());
                //console.log($('body > div > table > tbody > tr > td:nth-child(3)').text());
                var jobName = $('body > div > table > tbody > tr > td:nth-child(1)').text();
                var partId = $('body > div > table > tbody > tr > td:nth-child(2)').text();
                var qty = $('body > div > table > tbody > tr > td:nth-child(3)').text();
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
                
                
            })
            .catch((err) => {
                console.log(err);
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
        var options = {
            method: 'GET',
            uri: 'https://a6grop6x.azurewebsites.net/job/listone/?jobName='+ jobName +'&partID='+partId,
            json: true
        };

        rp(options)
            .then((response) => {
                //console.log(response);
                const $ = cheerio.load(response);
                
                console.log($('body > div > table > tbody > tr > td:nth-child(1)').text());
                console.log($('body > div > table > tbody > tr > td:nth-child(2)').text());
                console.log($('body > div > table > tbody > tr > td:nth-child(3)').text());
                var jobName = $('body > div > table > tbody > tr > td:nth-child(1)').text();
                var partId = $('body > div > table > tbody > tr > td:nth-child(2)').text();
                var qty = $('body > div > table > tbody > tr > td:nth-child(3)').text();
                
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
                                                    method: 'POST',
                                                    uri: 'https://a6grop6x.azurewebsites.net/job/update/'+jobName+'/'+partId,
                                                    form:{
                                                        qty: changedqty
                                                    },
                                                    jason: true
                                                };
                                                console.log('https://a6grop6x.azurewebsites.net/job/update/'+jobName+'/'+partId);
                                                console.log(changedqty);
                                                optX491.simple = false;

                                                rp(optX491)
                                                    .then((response)=>{
                                                        console.log(response);
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err);
                                                    });
                                            
                                                var optX941 = {
                                                    uri: 'https://a6grop6x.azurewebsites.net/job/addjp',
                                                    method: 'POST',
                                                    json: {
                                                        "jobName" : jobName,
                                                        "partId" : partId,
                                                        "userId" : userId,
                                                        "qty" : order_num
                                                    }
                                                };

                                                request941(optX941, function(err, res, body){
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    else{
                                                        if(res.statusCode == 200){
                                                            console.log(body.id);
                                                        }
                                                        else{
                                                            console.log("ERR! HTTP Status: " + res.statusCode);
                                                        }
                                                    }
                                                })

                                                //给Y发Order
                                                var options1 = {
                                                    method: 'GET',
                                                    uri: 'https://a6parts.azurewebsites.net/listone/?partID='+partId,
                                                    json: true
                                                };

                                                rp(options1)
                                                    .then((response)=>{
                                                        const $ = cheerio.load(response);
                                                        var qtyinstock = $('body > div > table > tbody > tr > td:nth-child(3)').text();
                                                        var instock = (parseInt(qtyinstock)-parseInt(order_num));
                                                        var partName =$('body > div > table > tbody > tr > td:nth-child(2)').text();
                                                        var optY491 ={
                                                            method: 'POST',
                                                            uri: 'https://a6parts.azurewebsites.net/update/'+partId+'/'+partName,
                                                            form:{
                                                                qoh: instock
                                                            },
                                                            jason: true
                                                        };
        
                                                        optY491.simple = false;
        
                                                        rp(optY491)
                                                            .then((response)=>{
                                                                console.log(response);
                                                            })
                                                            .catch((err)=>{
                                                                console.log(err);
                                                            });

                                                            var optY941 = {
                                                                uri: 'https://a6parts.azurewebsites.net/addOrder',
                                                                method: 'POST',
                                                                json: {
                                                                    "jobName" : jobName,
                                                                    "partId" : partId,
                                                                    "userId" : userId,
                                                                    "qty" : order_num
                                                                }
                                                            };
                                                            request941(optY941, function(err, res, body){
                                                                if(err){
                                                                    console.log(err);
                                                                }
                                                                else{
                                                                    if(res.statusCode == 200){
                                                                        console.log(body.id);
                                                                    }
                                                                    else{
                                                                        console.log("ERR! HTTP Status: " + res.statusCode);
                                                                    }
                                                                }
                                                            })
        
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err);
                                                    });
                                            }
                        }
                        else{
                            res.send(400,{error:'qty you ordered cannot larger than max qty'});
                        }
                    }
                })
                
            })
            .catch((err) => {
                console.log(err);
            });

    }
  
};
