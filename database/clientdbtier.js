const db = require('./db');

exports.getClientbyName = function(client,done){

    let query = 'SELECT * FROM t_client WHERE client=?';
    db.get().query(query, client, function(err,rows){
        //if(err) throw err;
        console.log('getProjectbyName success!');
        //console.log(rows);
        done(err,rows);
    });
};
exports.getAssetsbyRole = function(role, done){

    let query = 'SELECT * FROM t_role_asset WHERE role=?';
    db.get().query(query, role, function(err,rows){
        //if(err) throw err;
        console.log('getAssetsbyRole success!');
        console.log(rows);
        done(err,rows);
    });
};
exports.getClientAssetsbyName = function(client, role, assets, done){

    console.log(assets);
    let query = '';
    if (role == 'admin')
        query = 'SELECT * FROM t_client_asset WHERE client=?';
    else 
        query = 'SELECT * FROM t_client_asset WHERE client=? AND asset IN (?)';
    db.get().query(query, [client, assets], function(err,rows){
        //if(err) throw err;
        console.log('getProjectbyName success!');
        console.log(rows);
        done(err,rows);
    });
};
exports.deleteClientbyName = function(client,done){

    let query = "DELETE `t_client`, `t_user_group`, `t_client_asset` FROM `t_client`, `t_user_group`, `t_client_asset` WHERE `t_user_group`.`client` = `t_client`.`client` AND `t_client`.`client`=`t_client_asset`.`client` AND `t_client`.`client` = ?"
    db.get().query(query, client, function(err,result){
        //if(err) throw err;
        console.log('deleteClientbyName success!');
        //console.log(result);
        done(err,result);
    });
};
exports.editAsset = function(body,done){

    let updatetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let objasset = {
        asset: body.asset,
        description: body.description,
        created_at: updatetime,
        updated_at: updatetime
    }
    console.log(JSON.stringify(objasset));
    let query = 'REPLACE INTO t_asset SET ?';
    db.get().query(query, objasset, function(err,result){
        if(err) done(err,null);
        done(null,result)
    });
};
exports.editRole = function(body,done){

    let updatetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let objrole = {
        role: body.role,
        description: body.description,
        created_at: updatetime,
        updated_at: updatetime
    }
    console.log(JSON.stringify(objrole));
    let query = 'REPLACE INTO t_role SET ?';
    db.get().query(query, objrole, function(err,result){
        if(err) done(err,null);
        let query1 = 'DELETE FROM t_role_asset WHERE role=?';
        db.get().query(query1,body.role, function(err,result){
            if(err) done(err,null)
            body.assets.map(asset => {
                let query2 = 'INSERT INTO t_role_asset SET ?';
                db.get().query(query2,
                    {
                        role: body.role,
                        asset: asset,
                        created_at: updatetime,
                        updated_at: updatetime
                    },function(err,result){
                    if(err) done(err,null);
                })
            })
            
            done(err,result);
           
        })
    });
};
exports.editClient = function(body,done){

    let client = body.client;
    delete body.client;
    let query = 'UPDATE t_client SET ? where client= ? ';
    db.get().query(query, [body, client], function(err,result){
        //if(err) throw err;
        console.log('editClient success!');
        console.log(err + JSON.stringify(result));
        done(err,result);
    });
};
exports.editClientAssets = function(body,done){

    console.log('editClientAssets BODY : ' + JSON.stringify(body));
    let updatetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const client = body.client;
    Object.keys(body.assets).map((key,index) =>{
    // body.map(element => {
        // console.log(`element = ${JSON.stringify(element)}`);
        const url = body.assets[key];
        const asset = key;
        let t_client_asset = {
            client: client,
            asset: asset,
            url: url?url:"",
            created_at: updatetime,
            updated_at: updatetime
        }
        console.log(`t_client_asset: ${JSON.stringify(t_client_asset)}`)
        let query = 'REPLACE INTO t_client_asset SET ?'
        
        db.get().query(query, t_client_asset, function(err,result){
        if(err){
            done(err, null);
            console.log(err);
            return;
        }
        // console.log('editClientAssets success!');
        // console.log(err + JSON.stringify(result));
    });
    })
        done(null, true);
    // let client = body.client;
    // delete body.client;
    // let query = 'UPDATE t_client SET ? where client= ? ';
    // db.get().query(query, [body, client], function(err,result){
    //     //if(err) throw err;
    //     console.log('editClientAssets success!');
    //     console.log(err + JSON.stringify(result));
    //     done(err,result);
    // });
};

exports.add_client = function(req,done){

    let query = `INSERT INTO t_client SET ?`;
    db.get().query(query, req.body, function(err,result){
        //if(err) throw err;
        let createtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        console.log('add_client success!');
        let new_pair = {
            username: req.user,
            client: req.body.client,
            created_at: createtime,
            updated_at: createtime
        }
        db.get().query(`INSERT INTO t_user_group SET ?`, new_pair, function(err,result){
            
        done(err,result);
        })
        //console.log(result);
    });
};
exports.getClients = function(req,done){
    let order = "";
    let condition = "";

    if(req.query&&(req.query.sortby != null)){
        order = " ORDER BY "
        if(req.query.sortby == 0){ //name A-Z
            order += "client"
        }else if(req.query.sortby == 1){   //name Z-A
            order += "client DESC"
        }else{
            order = "";
        }
    }
    let query = '';
    if(req.role == 'admin')
        query = `SELECT * FROM t_client${order}`;
    else
        query = `SELECT t_client.* FROM t_client RIGHT JOIN t_user_group ON t_client.client = t_user_group.client WHERE t_user_group.username=?${order};`;
    db.get().query(query, req.user, function(err,rows){
        //if(err) throw err;
        console.log('getProjects success!');
        done(err,rows);
    });
};
exports.getAsset = function(asset, done){
    let query = "SELECT * FROM t_asset WHERE asset=?"
    db.get().query(query, asset).then(function(roleinfo){
        done(null, roleinfo);
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getRole = function(role, done){
    let query = "SELECT * FROM t_role WHERE role=?"
    db.get().query(query, role).then(function(roleinfo){
        done(null, roleinfo);
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getRoles = function(req, done){
    let query = "SELECT * FROM t_role"
    db.get().query(query).then(function(roles){
        done(null, roles);
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getAssets = function(req, done){
    let query = "SELECT * FROM t_asset"
    db.get().query(query).then(function(assets){
       done(null, assets);
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getAssetsList = function(req, done){
    let query = "SELECT asset FROM t_asset"
    db.get().query(query).then(function(assets){
       done(null, assets);
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getRolesClientsList = function(req, done){
    let query = "SELECT role FROM t_role"
    db.get().query(query).then(function(roles){
        let query1 = 'SELECT client FROM t_client'
        db.get().query(query1).then(function(clients){
            done(null,{roles:roles, clients:clients});
        })
    }).catch(function(err){
        console.log(err);
        done(err, null);
    })
}
exports.getTableColumnName = function(table, done){

    let query = 'SELECT column_name,column_type ' +
        'FROM information_schema.columns ' +
        'WHERE table_name=?';
    db.get().query(query, table, function(err,rows){
        //if(err) throw err;
        console.log('getTableColumnName success!');
        console.log(err + JSON.stringify(rows));
        done(err,rows);
    });
};

exports.getAssetByUsername = function(username, done){
    let query = 'SELECT t_role_asset.asset FROM t_role_asset LEFT JOIN t_user_role ON t_role_asset.role=t_user_role.role WHERE t_user_role.username=?;';
    db.get().query(query, username, function(err,rows){
        //if(err) throw err;
        console.log('getAssetByUsername success!');
        done(err,rows);
    });
}