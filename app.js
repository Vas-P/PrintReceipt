const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes/routesconfig');
const cors = require('cors');

app.use(cors());
app.use(express.json());

routes(app);
// require('./routes')(app);

app.use(cors(), function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
app.listen(port, () => 
    console.log(`Server has been started on port ${port}`)
);
