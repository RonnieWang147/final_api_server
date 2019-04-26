const clientdbtier = require('../database/clientdbtier');
const ruledbtier = require('../database/ruledbtier');

exports.get_clients = function(req, res){
    clientdbtier.getClients(req,function(err, clients){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(clients);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_role = function(req, res){
    clientdbtier.getRole(req.query.role,function(err, roleinfo){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json([roleinfo[0].role, roleinfo[0].description]);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_roles = function(req, res){
    clientdbtier.getRoles(req,function(err, list){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(list);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_asset = function(req, res){
    clientdbtier.getAsset(req.query.asset,function(err, list){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(list);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_assets = function(req, res){
    clientdbtier.getAssets(req,function(err, list){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(list);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_assets_list = function(req, res){
    clientdbtier.getAssetsList(req,function(err, list){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(list);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_roles_clients_list = function(req, res){
    clientdbtier.getRolesClientsList(req,function(err, list){
        if (err) return res.status(400).json('Can\'t access the database right now!' + err);
            return res.json(list);
        //return res.status(400).json('Can\'t access the database right now!');
    })
    
    
}
exports.get_client = function(req, res){
    
    console.log(`get_project${req.query.client}`);
    clientdbtier.getClientbyName(req.query.client,function(err, rows){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(rows[0]);
    })
}

exports.get_assets_by_role = function(req, res){
    
    console.log(`get_assets_by_role${req.query.role}`);
    clientdbtier.getAssetsbyRole(req.query.role, function(err, rows){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(rows);
    })
}
exports.get_client_assets = function(req, res){
    
    console.log(`get_project${req.query.client}`);
    clientdbtier.getClientAssetsbyName(req.query.client, req.role, req.assets, function(err, rows){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(rows);
    })
}
exports.delete_client = function(req, res){
    
    console.log(`delete_client${req.query.client}`);
    clientdbtier.deleteClientbyName(req.query.client,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}

exports.edit_asset = function(req, res){
    
    console.log(`edit_asset${JSON.stringify(req.body)}`);
    clientdbtier.editAsset(req.body,function(err, result){
        console.log(err);
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.edit_role = function(req, res){
    
    console.log(`edit_role${JSON.stringify(req.body)}`);
    clientdbtier.editRole(req.body,function(err, result){
        console.log(err);
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.edit_client = function(req, res){
    
    console.log(`edit_client${JSON.stringify(req.body)}`);
    clientdbtier.editClient(req.body,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.edit_client_assets = function(req, res){
    
    console.log(`edit_client_assets${JSON.stringify(req.body)}`);
    clientdbtier.editClientAssets(req.body,function(err, result){
        console.log('final result' + JSON.stringify(result));
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}

exports.add_client = function(req, res){
    
    console.log(`add_client${JSON.stringify(req.body)}`);
    clientdbtier.add_client(req,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}

exports.get_table_column_name = function(req, res){
    
    console.log(`get_table_column_name req.tb=${req.query.tb}`)
    clientdbtier.getTableColumnName(req.query.tb,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}
exports.add_game = function(req, res){
    console.log(req.file);
    console.log(`add_game${JSON.stringify(req.body)}`);
    if(req.file)
        req.body.imagename = req.file.filename;
    gamedbtier.addGame(req.body,function(err, result){
        if (err) return res.status(400).json('Can\'t access the database right now!');
        return res.json(result);
    })
}