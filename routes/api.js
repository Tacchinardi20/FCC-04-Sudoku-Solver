/*
*
*
*       Complete the API routing below
*       
*       
*/


'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      var digits = /^[1-9]$/;
      // var letters = /[A-I]/;

      var letterDigit = /^[A-I][1-9]$/;

      if (!req.body.hasOwnProperty("puzzle") || !req.body.hasOwnProperty("coordinate") || !req.body.hasOwnProperty("value")) {
        res.send({ error: "Required field(s) missing" });
        // console.log("here" + res.body);
      } else {  // we got our fields.
        var puzzleString = req.body.puzzle;
        var coordinates = req.body.coordinate;
        var row = coordinates[0];
        var column = coordinates[1];
        var value = req.body.value;

        if (puzzleString.length == 0 || coordinates.length == 0 || value.length == 0) {  // they are empty.
          // console.log("missing fields");

          res.send({ "error": "Required field(s) missing" });
        }

        if (puzzleString == undefined || coordinates == undefined || value == undefined) {  // they are empty.
          // console.log("missing fields");

          res.send({ "error": "Required field(s) missing" });
        } else if (letterDigit.test(coordinates)) {  // coords are ok. now we check the value.

          if (digits.test(value)) {  // the value is fine.
            // console.log("valid coordinates and value");
            // now we validate and call the checker.

            var validation = solver.validate(puzzleString);

            if (validation == "ok") {  // the string is fine.
              var response = {valid: true, conflict: []};
              var r, c, re;

              r = solver.checkRowPlacement(puzzleString, row.toUpperCase(), column, value);
              c = solver.checkColPlacement(puzzleString, row.toUpperCase(), column, value);
              re = solver.checkRegionPlacement(puzzleString, row.toUpperCase(), column, value);

              if (!r) {
                response.valid = false;
                response.conflict.push("row");
              }
              if (!c) {
                response.valid = false;
                response.conflict.push("column");
              }
              if (!re) {
                response.valid = false;
                response.conflict.push("region");
              }
              if (response.conflict.length == 0) {
                delete response.conflict;
              }

              res.send(response);
            } else {
              res.send(validation);
            }

          } else {  // the value is not fine.
            // console.log("valid coords and invalid value");

            res.send({ "error": "Invalid value" });
          }
            
        } else {
          // console.log({ "error": "Invalid coordinate" });

          res.send({ "error": "Invalid coordinate" });
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      // validate tells us if the string has the right form.
      // console.log(req.body);

      if (!req.body.hasOwnProperty('puzzle')) {  // we don't have a puzzle.

        res.send({ error: 'Required field missing' });
      } else {  // we have a puzzle.
        var puzzleString = req.body.puzzle;
        var validation = solver.validate(puzzleString);

        if (validation == "ok") {
          // var solution = solver.solve(puzzleString); // to be written yet
          // console.log("solution" + JSON.stringify(solution));

          res.send(solver.solve(puzzleString));
        } else {
          res.send(validation);
        }
      }    
    });

};