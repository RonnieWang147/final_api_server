const db = require('./db');

exports.getRulesbyId = function(id,done){

    let query = 'SELECT rules FROM role WHERE iduser=?';
    db.get().query(query, id, function(err,rows){
        //if(err) throw err;
        console.log('getRulesbyId success!');
        //console.log(rows);
        done(err,rows);
    });
};