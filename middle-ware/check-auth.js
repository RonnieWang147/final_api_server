const jwt = require('jsonwebtoken');
const userdbtier = require('../database/userdbtier');
const SECRET = require('../Global').SECRET;


exports.check_user = (req, res, next) => {
    
    try{
    const decode = jwt.verify(req.headers.authorization.split(' ')[1],SECRET);
    req.user = decode.username;
    req.role = decode.role;
    req.assets = decode.assets;
    next();
    // userdbtier.getUserById(decode.id,function(err,result){
    //     if(err) throw err;
    //     if(!result.length) //Can't find this user by the given token
    //         return res.status(401).json({
    //             massage: 'Auth failed'
    //         });
    //     if(req.query.user_info === "999"){
    //         delete result[0].Password;
    //         delete result[0].iduser;
    //         return res.json(result[0]);
    //     }
    //     else
    //         next();
    // })
    }catch(err){
        return res.status(401).json({
            massage: 'Auth failed'
        })
    }
}

// exports.check_manager = (req, res, next) => {
    
//     try{
//     const decode = jwt.verify(req.headers.authorization.split(' ')[1],SECRET);    
//     // if(!(decode.assets && (decode.assets.indexOf('Admin') > -1 || decode.asset.indexOf('ConfigMgr') > -1)))
    
//     if(!(decode.assets && (decode.assets.indexOf('ConfigMgr') > -1 || decode.assets.indexOf('Admin') > -1)))
//         return res.status(401).json({
//             massage: 'Auth failed'
//         })
//     req.user = decode.username;
//     next();
//     }catch(err){
//         return res.status(401).json({
//             massage: 'Auth failed'
//         })
//     }
// }
exports.check_admin = (req, res, next) => {
    
    try{
    const decode = jwt.verify(req.headers.authorization.split(' ')[1],SECRET);    
    console.log(`check_admin decode.assets = ${decode.assets}`)
    // if(!(decode.assets && decode.assets.indexOf('Admin') > -1))
    if(decode.role != 'admin')
        return res.status(401).json({
            massage: 'Auth failed'
        })
    req.user = decode.username;
    req.asset = decode.asset;
    req.role = decode.role;
    next();
    }catch(err){
        return res.status(401).json({
            massage: 'Auth failed'
        })
    }
}

exports.renew_token = (req, res) => {
    try{
        var username = req.headers.refreshtoken.split(" ")[0];
        var refreshToken = req.headers.refreshtoken.split(" ")[1];
        console.log(`username${username}, refreshToken${refreshToken}`);
        userdbtier.verifyRToken(username, refreshToken, function(err, result){

            if(err) throw err;
            if(!result.length)
                return res.status(401).json({
                    massage: 'Auth failed'
                })
            userdbtier.getUserByUsername(username,function(err, result){

                if (err||!result) 
                    return res.status(401).json({
                        massage: 'Auth failed'
                    })
                else{
                    let assets = [];
                    result.assets.map((asset, curindex) => {
                        console.log(asset);
                        assets.push(asset.asset);
                    });
                    
                    var payload = {
                        username: result.user.username,
                        role: result.user.role,
                        assets: assets
                    };
                    var token = jwt.sign(payload, SECRET, { expiresIn: '1m' });
                    return res.json({
                        message: "access token refreshed", 
                        role: result.user.role,
                        assets: assets,
                        token: `JWT ${token}`
                    });
                }
            })
                
            }
        )
    }catch(err){
        console.log(err);
        return res.status(401).json({
            massage: 'Auth failed'
        })
    }
    
}