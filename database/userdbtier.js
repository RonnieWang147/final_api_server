const db = require('./db');
var bcrypt = require('bcrypt');

exports.AddNewUser = function(body,done){
    body.password_hash = bcrypt.hashSync(body.password_hash, 10);
    let createtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    // console.log(body.creattime);

    let query = 'INSERT INTO t_user SET ?';
    db.get().query(query, body, function(err,result){
        //if(err) throw err;
        if(!err)
            console.log('AddNewUser success!');
        if(err)
            return done(err,null);
        query = 'INSERT INTO t_user_role SET ?';
        db.get().query(query,{
            username: body.username,
            created_at: createtime,
            updated_at: createtime
        }, function(err, result){
            if(!err)
                console.log('Adduserrole success');
            done(err,result);
        })
    })
};

exports.getUsers = function(query,done){
    
    db.get().query(`SELECT * FROM t_user LEFT JOIN t_user_role ON t_user.username=t_user_role.username`, function(err,rows){
        //if(err) throw err;
        console.log('select user success!');
        //console.log(rows);
        done(err,rows);
    });
};
exports.getUserByUsername = function(username,done){

    let query = 'SELECT * FROM t_user LEFT JOIN t_user_role ON t_user.username=t_user_role.username WHERE t_user.username=?';
    db.get().query(query, username).then( function(user){
        return user;
    }).then(function(user){
        console.log(`show me the user222: ${JSON.stringify(user)}`)
        let query1 = `SELECT asset FROM t_role_asset where role=?`;
        db.get().query(query1,user[0].role).then(function(assets){
            console.log(`show me the assets: ${JSON.stringify(assets)}`)
            let query2 = `SELECT client FROM t_user_group WHERE username=?`
            db.get().query(query2,user[0].username).then(function(clients){
                return done(null, {user: user[0], assets: assets, clients: clients});
            })
        });
    }).catch( function(err){
        return done(err,null);
    });

    
    // db.get().query(query, username, function(err,users){
    //     //if(err) throw err;
    //     console.log('getUserByUsername success!');
    //     //console.log(users);
    //     done(err,users);
    // });
};
exports.getUserByUsername1 = function(username,done){

    console.log("getUserByUsername1 "+username);
    let query = 'SELECT * FROM t_user WHERE t_user.username=?';
    db.get().query(query, username).then( function(user){
        return done(null,user[0]);
    }).catch( function(err){
        return done(err,null);
    });

    
    // db.get().query(query, username, function(err,users){
    //     //if(err) throw err;
    //     console.log('getUserByUsername success!');
    //     //console.log(users);
    //     done(err,users);
    // });
};

exports.editUser = function(req,done){

    let username = req.body.user.username;
    let time_now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let t_role = {
        role: req.body.user.role,
        updated_at: time_now
    }

    delete req.body.user.role;
    delete req.body.user.username;

    let query = 'UPDATE t_user SET ? WHERE username= ? ';
    db.get().query(query, [req.body.user, username], function(err,result){
        //if(err) throw err;
        if(err) console.log(err);
        if(err) return done(err,null);
        console.log('update t_user success!');
        //console.log(result);
        let query1 = `UPDATE t_user_role SET ? WHERE username=?`
        db.get().query(query1, [t_role,username],function(err,result){
            if(err) console.log(err);
            if(err) return done(err,null);
            console.log('update t_user_role success!');
            let query2 = `DELETE FROM t_user_group WHERE username=?`
            db.get().query(query2,username).then(result=>{
                let query3 = `INSERT INTO t_user_group (username, client, created_at, updated_at) VALUES ?`
                let insert_value = [];
                for(let client of req.body.clients){
                    if(client)
                    insert_value.push([username, client, time_now, time_now]);
                }
                if(insert_value.length){
                    db.get().query(query3,[insert_value]).then(result=>{
                        console.log('update t_user_group success!');
                        done(err,result);
                    }).catch(err=>{
                        if(err) console.log(err);
                        done(err,null);
                    })
                }
                else
                    done(err,result);
            })
        })
    });
};
exports.deleteAssetbyName = function(asset,done){

    // let query = 'DELETE FROM t_asset WHERE asset=?';
    // db.get().query(query, asset, function(err,result){
    //     //if(err) throw err;
    //     let query1 = 'DELETE FROM t_role_asset WHERE asset=?';
    //     db.get().query(query1, asset, function(err,result){
            
    //         let query2 = 'DELETE FROM t_client_asset WHERE asset=?';
    //         db.get().query(query2, asset, function(err,result){
                
    //             done(err,result);
    //         })
    //     })
    // });

    let query = 'DELETE `t_asset`, `t_role_asset`, `t_client_asset` FROM `t_asset`, '+
    '`t_role_asset`, `t_client_asset` WHERE `t_asset`.`asset`=`t_role_asset`.`asset` '+
    'AND `t_role_asset`.`asset`=`t_client_asset`.`asset` AND `t_asset`.`asset` = ?';
    db.get().query(query, asset, function(err,result){
        return done(err, result);
    })
};
exports.deleteRolebyName = function(role,done){

    let query = 'DELETE FROM t_role WHERE role=?';
    db.get().query(query, role, function(err,result){
        //if(err) throw err;
        console.log('deleteUserbyId success!');
        let query1 = 'DELETE FROM t_role_asset WHERE role=?';
        db.get().query(query1, role, function(err,result){
            
            done(err,result);
        })
        //console.log(result);
    });
};
exports.deleteUserbyId = function(id,done){

    let query = 'DELETE FROM user WHERE iduser=?';
    db.get().query(query, id, function(err,result){
        //if(err) throw err;
        console.log('deleteUserbyId success!');
        //console.log(result);
        done(err,result);
    });
};
exports.addRefreshToken = function(rftkbody, done){

    let query = `INSERT INTO refresh_token SET ?`;
    db.get().query(query, rftkbody, function(err,result){
        //if(err) throw err;
        console.log('addRefreshToken success!');
        //console.log(result);
        done(err,result);
    });
};

exports.verifyRToken = function(username, refreshToken, done){

    let query = `SELECT * FROM refresh_token WHERE username=? AND rtoken=?`;
    db.get().query(query, [username, refreshToken], function(err,result){
        done(err,result);
    });
};