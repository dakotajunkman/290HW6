const express = require('express');
const mysql = require('./dbcon.js');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const getAllQuery = 'SELECT * FROM workout';
const insertQuery = 'INSERT INTO workout (`name`, `reps`, `weight`, `units`, `date`) VALUES (?, ?, ?, ?, ?)';
const updateQuery = 'UPDATE workout SET name = ?, reps = ?, weight = ?, units = ?, date = ?, WHERE id = ?';
const deleteQuery = 'DELETE FROM workout WHERE id = ?';
const dropTableQuery = 'DROP TABLE IF EXISTS workout';
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        units VARCHAR(255), 
                        date DATE)`;

function getAllData(res, next) {
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ "rows": rows });
  });
}

// get current state of the table
app.get('/', (req, res, next) => {
  getAllData(res, next);
});

// insert in to the table
app.post('/', (req, res, next) => {
  let { name, reps, weight, units, date } = req.body;
  mysql.pool.query(insertQuery,
    [name, reps, weight, units, date],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      getAllData(res);
    });
});

// delete row from the table
app.delete('/', (req, res, next) => {
  let { id } = req.body;
  mysql.pool.query(deleteQuery, [id], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    getAllData(res);
  });
});


// update a row in the table
app.put('/', (req, res, next) => {
  var context = {};
  mysql.pool.query(updateQuery,
    [req.query.name, req.query.reps, req.query.weight, req.query.units],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      context.results = "Updated " + result.changedRows + " rows.";
      res.send(context);
    });
});

// empty the table
app.get('/reset-table', (req, res, next) => {
  var context = {};
  mysql.pool.query(dropTableQuery, (err) => {
    mysql.pool.query(makeTableQuery, (err) => {
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('404-Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.send('500-Server Error');
});

app.listen(3000, function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
