const userdbtier = require('../database/userdbtier');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var randtoken = require('rand-token') 
const SECRET = require('../Global').SECRET;

exports.user_register = function (req, res) {
    //console.log(`registering`);
    userdbtier.AddNewUser(req.body,function(err, result){
        if (err) res.status(400).json(result);
        console.log(`register result: ${result}`);
        res.json(result);
    })
}

exports.user_login = function(req, res){
    console.log(`user_login ${JSON.stringify(req.body)}`);
    if(!(req.body.username && req.body.password)){
        return res.json({rc: -1, message:"Missing username or password", username: req.body.username, password: req.body.password});
      }
    var username = req.body.username;
    console.log("username!!!!!!: "+req.body.username);
    var password = req.body.password;
    console.log(bcrypt.hashSync(password, 10));
    userdbtier.getUserByUsername1(username,function(err, results){
        if (err) return res.json({rc: -1, message:"no such user found11"});
        
        if(!results) return res.json({rc: -1, message:"no such user found222"});
        else{
            if(bcrypt.compareSync(password, results.password_hash)){
                // from now on we'll identify the user by the id and 
                // the id is the only personalized value that goes into our token
                console.log("password correct");
                var payload = {
                    username: results.username
                };
                var username = results.username;
                var refreshToken = randtoken.uid(256);
                var rftkbody = {
                    username: username,
                    rtoken: refreshToken
                }
                var token = jwt.sign(payload, SECRET, { expiresIn: '30d' });
                return res.json({
                    rc: 1, 
                    message: "Login success", 
                    username: results.username,
                    token: `JWT ${token}`
                });
                // userdbtier.addRefreshToken(rftkbody,function(err,result){
                //     if(err)
                //         return res.json({rc: -1, message:"can't access database now."});

                //     var token = jwt.sign(payload, SECRET, { expiresIn: '60m' });
                //     return res.json({
                //         rc: 1, 
                //         message: "Login success", 
                //         username: results.username,
                //         token: `JWT ${token}`, 
                //         reftkn: refreshToken});
                // });
            }
            else return res.json({rc: -1, message:"Wrong password!"});
        }
    })
}
exports.user_test = (req, res) => {
    userdbtier.getUserByUsername1("test",function(err,result){
        if(err||!result) //Can't find this user by the given token or error occur
            return res.status(401).json({
                massage: 'Auth failed'
            });
        return res.json(result);
    })
}
exports.user_info = (req, res) => {
    userdbtier.getUserByUsername(req.user,function(err,result){
        if(err||!result) //Can't find this user by the given token or error occur
            return res.status(401).json({
                massage: 'Auth failed'
            });
        delete result.user.password_hash;
        return res.json(result.user);
    })
}
exports.get_users = function(req, res){
    //console.log(JSON.stringify(req.query));
    userdbtier.getUsers(req.query,function(err, rows){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        rows.map((row,index) =>{
            delete row.password_hash;
        });
        // for (row in rows)
        //     delete row.password_hash;
        return res.json(rows);
    })
}
exports.get_user = function(req, res){
    
    userdbtier.getUserByUsername(req.query.username,function(err,result){
        console.log(result);
        if(err||!result) //Can't find this user by the given token or error occur
            return res.status(401).json({
                massage: 'Auth failed'
            });
        delete result.user.password_hash;
        return res.json(result);
    })
}
exports.edit_user = function(req, res){
    
    userdbtier.editUser(req,function(err, result){
        console.log(JSON.stringify(result));
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}


exports.delete_asset = function(req, res){
    
    console.log(`delete_asset${req.query.asset}`);
    userdbtier.deleteAssetbyName(req.query.asset,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.delete_role = function(req, res){
    
    console.log(`delete_role${req.query.role}`);
    userdbtier.deleteRolebyName(req.query.role,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.delete_user = function(req, res){
    
    console.log(`delete_user${req.query.id}`);
    userdbtier.deleteUserbyId(req.query.id,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}