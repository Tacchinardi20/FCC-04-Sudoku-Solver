class SudokuSolver {

  validate(puzzleString) {
    // console.log(puzzleString.length);

    var re = /[^1-9\.]/;  // we check for letters.

    if (puzzleString.length == 0 || puzzleString == undefined) {
      return({ error: "Required field missing" });
    } else if (puzzleString.length != 81) {  // we check the length and the presence of letters.
      // console.log("invalid string");

      return({ "error": "Expected puzzle to be 81 characters long" });
    } else if (re.test(puzzleString)) {
      // console.log("invalid string");

      return({ "error": "Invalid characters in puzzle" });
    } else {  // the string is valid.
      // console.log("ok");

      return "ok";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var rowNumber = rows.indexOf(row);
    var rowArray = puzzleString.slice(rowNumber*9, rowNumber*9 + 9);

    if (rowArray.indexOf(value) == -1 && rowArray[column-1] == ".") {
      return true;
    } else if (rowArray[column-1] == value) {  // we already have that value there.
      return true;
    } else {
      return false;
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var rowNumber = rows.indexOf(row);

    column = parseInt(column) - 1;

    var columnArray = "";  // it's actually a string.

    if (puzzleString[rowNumber*9 + column] == value) {  // we already have that value there.
      return true;
    }  // is the position free?
    else if (puzzleString[rowNumber*9 + column] != ".") {  // the place is already taken.
      return false;
    }
    for (var i = 0; i < 9; i++) {
      columnArray = columnArray + puzzleString[column + i*9];
    }
    if (columnArray.indexOf(value) == -1) {
      return true;
    } else {
      return false;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var rowNumber = rows.indexOf(row);

    column = column-1  // we subtract 1 so that it's better for navigation.

    var regionArray = "";  // it's actually a string.
    var regX = Math.floor(rowNumber/3)*3;
    var regY = Math.floor(column/3)*3;

    if (puzzleString[rowNumber*9 + column] == value) {  // we already have that value there.
      return true;
    } else if (puzzleString[rowNumber*9 + column] != ".") {  // the place is already taken.
      return false;
    }

    regionArray = regionArray + puzzleString[ 9*regX + regY ] + puzzleString[ 9*regX + regY + 1 ] + puzzleString[ 9*regX + regY + 2 ]
    regionArray = regionArray + puzzleString[ 9*(regX + 1) + regY ] + puzzleString[ 9*(regX+1) + regY + 1 ] + puzzleString[ 9*(regX+1) + regY + 2 ]
    regionArray = regionArray + puzzleString[ 9*(regX + 2) + regY ] + puzzleString[ 9*(regX+2) + regY + 1 ] + puzzleString[ 9*(regX+2) + regY + 2 ]

    if (regionArray.indexOf(value) == -1 && puzzleString[rowNumber*9+column] == ".") {
      return true;
    } else {
      return false;
    }
  }

  solve(puzzleString) {
    // console.log("now we solve");

    if (this.checkBoard(puzzleString)) {
      var order = this.compileOrder(puzzleString);  // these are the missing cells.
      var i = 0;  // counter to navigate the missing cells
      var val = 1;  // the initial value, we will put it in the empty cell.
      var partial = [];  // it does not contain the numbers that are already present in the puzzle.

      return this.backtracking(puzzleString, order[i][0], order[i][1], val, i, order, partial);
    } else {
      return ({ error: "Puzzle cannot be solved" });
    }
  }

  compileOrder(puzzleString) {
    var order = [];
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    for (var i = 0; i < 81; i++) {
      if (puzzleString[i] == ".") {
        order.push(rows[Math.floor(i/9)] + (i%9 + 1));
      }
    }

    return order;
  }

  validPlacement(puzzleString, row, column, value) {
    // console.log("chiamata");

    if (this.checkRowPlacement(puzzleString, row, column, value)) {

      if (this.checkColPlacement(puzzleString, row, column, value)) {
        if (this.checkRegionPlacement(puzzleString, row, column, value)) {
          return true;
        } else {
          return false;
        }
      }

      else return false;
    }

    else return false;
  }

  backtracking(puzzleString, row, column, value, i, order, partialSolution) {
    // partial solution contains ONLY the missing values. it is used to navigate.

    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    if (i >= 0 && i < order.length && value < 10) {  // we still can place numbers.

      if (this.checkRowPlacement(puzzleString, row, column, value) && this.checkColPlacement(puzzleString, row, column, value) && this.checkRegionPlacement(puzzleString, row, column, value)) {
        partialSolution.push(value);
        i = i + 1;

        let index = puzzleString.indexOf(".");
        let puzzleString2 = puzzleString.slice(0, index);

        puzzleString2 = puzzleString2 + value.toString() + puzzleString.slice(index+1);

        if (i == order.length) {
          return { "solution": puzzleString2 };
        } else {
          return (this.backtracking(puzzleString2, order[i][0], order[i][1], 1, i, order, partialSolution));
        } 
      } else {
        return (this.backtracking(puzzleString, row, column, value + 1, i, order, partialSolution));
      }

    } else if (i > 0 && i < order.length && value == 10) { 
 // none of the values is ok. we need to get back a step.

      i = i - 1;  // we take a step back.
      value = parseInt(partialSolution[i]) + 1;  // we increment the last placed value.
      partialSolution.pop();  // we remove the last value of the solution.

      let lastIndex = (rows.indexOf(order[i][0]))*9 + order[i][1]*1 - 1;
      // we have to get back and modify the puzzle string.

      let puzzleString2 = puzzleString.slice(0, lastIndex);

      puzzleString2 = puzzleString2 + "." + puzzleString.slice(lastIndex+1);

      return this.backtracking(puzzleString2, order[i][0], order[i][1], value, i, order, partialSolution);
    } else {
      // console.log("invalid puzzle");

      return ({ error: 'Puzzle cannot be solved' });
    }
  }

    checkBoard(puzzleString) {
      var regions = this.getRegions(puzzleString);
      var valid = true;
      var i = 0;

      while (i < regions.length && valid) {
        regions[i] = regions[i].replace(/\./g, "");
        valid = this.checkRegion(regions[i]);
        i=i+1;
      }
      // console.log(valid);

      return valid;
    }

    checkRegion(string) {
      var i = 0;
      var valid = true;

      while (i < string.length && valid) {
        if (string.indexOf(string[i]) != string.lastIndexOf(string[i])) {
          valid = false;
        }

        i = i + 1;
      }

      return valid;
    }

    getRegions(puzzleString) {
      var region = [];
      var column = [];
      var row = [];

      for (var i = 0; i < 9; i++) {
        row.push(puzzleString.slice(i*9, i*9 + 9));
        column.push("");

        for (var j = 0; j < 9; j++) {
          column[i] = column[i] + puzzleString[(j*9) + i];
        }
      }

      for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
          var string = "";

          string = string + puzzleString.slice((9*k)*3 + 3 *l, (9*k)*3 + 3 *l + 3);
          string = string + puzzleString.slice((9*k)*3 + 3 *l + 9, (9*k)*3 + 3 *l + 3 + 9);
          string = string + puzzleString.slice((9*k)*3 + 3 *l + 18, (9*k)*3 + 3 *l + 3 + 18);

          region.push(string);
        }
      }

      return row.concat(column).concat(region);
    }

}

module.exports = SudokuSolver;