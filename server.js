const express = require('express');

const Sequelize = require("sequelize");
const {Op} = require('sequelize');

const sequelize = new Sequelize(
 'apiTest',
 'myuser',
 'mypassword',
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);
const app = express();

app.use(express.json()); // to parse JSON bodies

// model our database tables
const FishTotal = sequelize.define('fishtotal', {
  pit: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hex: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  lastCaught: {
    type: Sequelize.DATE,
    allowNull: false
  },
  species: {
    type: Sequelize.STRING,
    allowNull: false
  },
  length: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  riverMile: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
}, {tableName: 'fishtotal', timestamps: false});

// Might end up using but for now not needed
FishTotal.removeAttribute('id');

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

// API ROUTES
// Get All Fish Data
app.get('/fish', (req, res) => {
  FishTotal.findAll()
    .then(fish => {
      res.json(fish);
    })
    .catch(err => {
      res.status(500).send('Error retrieving fish data: ' + err);
    });
});

// Get Fish Data for specific hex
app.get('/fish/:hex', (req, res) => {
  FishTotal.findAll({
    where: {
      hex: req.params.hex
    }
  })
    .then(fish => {
      res.json(fish);
    })
    .catch(err => {
      res.status(500).send('Error retrieving fish data: ' + err);
    });
});

// Get Fish Data for specific hex and date
app.get('/fish/:hex/:date', (req, res) => {
    const date = req.params.date;
  FishTotal.findAll({
    where: {
      lastCaught: {
        [Op.lt]: date
     },
     hex: req.params.hex
    }
  })
    .then(fish => {
      res.json(fish);
    })
    .catch(err => {
      res.status(500).send('Error retrieving fish data: ' + err);
    });
});

// Push data
app.post('/fish', (req, res) => {
  FishTotal.create(req.body)
    .then(fish => {
      res.json(fish);
    })
    .catch(err => {
      res.status(500).send('Error inserting fish data: ' + err);
    });
});



app.get('/test', (req, res) => {
  console.log("Hello guys, this is an example api call");
  res.send("Hello guys, this is an example api call");
});

app.listen(3000, () => console.log('Server started on port 3000'));
