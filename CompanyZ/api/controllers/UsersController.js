/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: function(req, res){
        var username941 = req.body.username;
        var password941 = req.body.password;
        console.log(username941+"\t"+password941);

        Users.find({userName: username941, password: password941}).exec(function(err,result){
            if(err){
                res.send(500, 'database error');
            }
            console.log(result);
            if(result.length == 1){
                req.session.Users = result;
                req.session.login = true;
                res.redirect("/");
            }
            else{
                res.view('pages/login', {err: "Username or Password Incorrect!"});
            }

            console.log(req.session);
            //return res.json(req.session);
            
        });

    },

    logout: function(req, res){
        req.session.destroy(function(err){
            res.redirect("/");
        })
        
    }

};

