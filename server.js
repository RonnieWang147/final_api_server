const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');
const db = require('./database/db');
const users = require('./controllers/users');
const apis = require('./util/api');
// const clients = require('./controllers/clients');
const bodyParser = require("body-parser");
const CheckAuth = require('./middle-ware/check-auth');
const normalizePort = require('normalize-port');
const port = normalizePort(process.env.PORT || '8080');

const app = express();



//prevent a sophisticated attacker from determining that an app is running Express
app.disable('x-powered-by');

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set static asset folder
// app.use('/public',express.static('public'));

//Setting SSL server
// var sslOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };

// https.createServer(sslOptions, app).listen(settings.SERVER_PORT);

//Endpoints
app.get('/test', users.user_test);
app.post("/register", users.user_register);
app.post('/login', users.user_login);
// app.get('/token', CheckAuth.renew_token);
app.get('/search', apis.search);

app.get('/api/my_info', CheckAuth.check_user, users.user_info);
// app.get('/api/get_user', CheckAuth.check_admin, users.get_user);
// app.get('/api/users', CheckAuth.check_admin, users.get_users);
// app.post('/api/edit_user', CheckAuth.check_admin, users.edit_user);
// app.get('/api/delete_asset', CheckAuth.check_admin, users.delete_asset);
// app.get('/api/delete_role', CheckAuth.check_admin, users.delete_role);
// app.get('/api/delete_user', CheckAuth.check_admin, users.delete_user);
// app.get('/api/get_role', CheckAuth.check_admin, clients.get_role);
// app.get('/api/get_roles', CheckAuth.check_admin, clients.get_roles);
// app.get('/api/get_asset', CheckAuth.check_admin, clients.get_asset);
// app.get('/api/get_assets', CheckAuth.check_admin, clients.get_assets);
// app.get('/api/get_assets_list', CheckAuth.check_admin, clients.get_assets_list);
// app.get('/api/get_roles_clients_list', CheckAuth.check_admin, clients.get_roles_clients_list);

// app.get('/api/clients', CheckAuth.check_user, clients.get_clients);
// app.get('/api/get_client', CheckAuth.check_user, clients.get_client);
// app.get('/api/get_assets_by_role', CheckAuth.check_user, clients.get_assets_by_role);
// app.get('/api/get_client_assets', CheckAuth.check_user, clients.get_client_assets);
// app.get('/api/delete_client', CheckAuth.check_admin, clients.delete_client);
// // app.post('/api/edit_game', CheckAuth.check_admin, upload.single('imagename'), clients.edit_game);
// app.post('/api/add_client', CheckAuth.check_admin, clients.add_client);
// app.post('/api/edit_asset', CheckAuth.check_admin, clients.edit_asset);
// app.post('/api/edit_role', CheckAuth.check_admin, clients.edit_role);
// app.post('/api/edit_client', CheckAuth.check_admin, clients.edit_client);
// app.post('/api/edit_client_assets', CheckAuth.check_admin, clients.edit_client_assets);
// app.get('/api/get_table_column_name', CheckAuth.check_admin, clients.get_table_column_name);
// app.post('/api/add_pic', CheckAuth.check_admin, upload.single('imagename'));
// app.post('/api/add_game', CheckAuth.check_admin, upload.single('imagename'));


// app.use(express.static(path.join(__dirname, 'build')));

db.connect( function(err) {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }
  });

app.get('/*', function (req, res) {
    return res.status(401).json({
        massage: 'Auth failed'
    });
});