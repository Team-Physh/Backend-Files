const express = require('express');

const Sequelize = require("sequelize");
const {Op} = require('sequelize');

const sequelize = new Sequelize(
 'removed',
 'removed',
 'removed',
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);
const app = express();

app.use(express.json({ limit: '500mb' })); // to parse JSON bodies

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
    allowNull: true
  },
  species: {
    type: Sequelize.STRING,
    allowNull: true
  },
  length: {
    type: Sequelize.DOUBLE,
    allowNull: true
  },
  riverMile: {
    type: Sequelize.DOUBLE,
    allowNull: true
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
        [Op.gt]: date
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
app.post('/fish/data', async (req, res) => {
  const fishData = req.body;
  console.log(fishData);
  try {
    for (let i = 0; i < fishData.length; i++) {
      const { pit, hex, lastCaught, species, length, riverMile } = fishData[i];
      await FishTotal.create({
        pit,
        hex,
        lastCaught,
        species,
        length,
        riverMile
      });
    }
    res.status(200).send('Data successfully inserted into database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data into database');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
