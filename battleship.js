var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");// 获取元素
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit"); // 将单元格的class特性改为hit
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");// 如上  作用可以使未打中 引用miss图片
  }
}

var model = {
  boardSize: 7,//网格大小
  numShips: 3,//战舰数量
  shipLength: 3,//占格
  shipsSunk: 0,//击沉数

  ships: [  // 战舰位置  击中检测位置
  { locations: [0, 0, 0], hits: ["", "", ""] },
  { locations: [0, 0, 0], hits: ["", "", ""] },
  { locations: [0, 0, 0], hits: ["", "", ""] }],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) { //遍历每艘战舰
      var ship = this.ships[i];
      // locations = ship.locations;
      // var index = locations.indexOf(guess) 用indexOf查找给与guess这一参数的值
      var index = ship.locations.indexOf(guess);
      if (index >= 0) { //如果输入大于0 进入if 击中替换成hit  当三个都换成hit时 输出 You sank my battleship
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("击中!");
        if (this.isSunk(ship)) {
          view.displayMessage("你击中了我的一艘战舰!");
          this.shipsSunk++; //  击沉数加1
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("你没有击中.");
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") { 
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {  //do while 循环
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);// 生成一个0~1的随机数
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);// row为起始行号  col起始列号
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));// 水平
      } else {
        newShipLocations.push((row + i) + "" + col);// 垂直
      }
    }
    return newShipLocations;
  },
  collision: function (locations) { // 判断战舰位置是否一样
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

function parseGuess(guess) {
  var alphabet = ["0", "1", "2", "3", "4", "5", "6"];
  if (guess === null || guess.length !== 2) {
    alert("噢，请在框中输入两个数字。");
  } else {
    firstChar = guess.charAt(0);//返回指定位置
    var row = alphabet.indexOf(firstChar);// 获取 guess的第一个字符
    var column = guess.charAt(1);//  获取 第二个字符

    if (isNaN(row) || isNaN(column)) { // isNaN() 判断是否为非数字
      alert("噢, 在框中输入了错误的内容.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("噢, 在框中输入两个数字!");
    } else {
      return row + column; // row数字  column为字符串
    }
  }
  return null;
}

var controller = {  // 判断是否击沉数与战舰所有数相同
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++ ;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("你击中了我所有的战舰, 使用了 " + this.guesses + " 发炮弹");
      }
    }
  }
};

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");// 用于处理html输入字段的按键事件
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");//获取猜测存储到value中
  var guess = guessInput.value;
  controller.processGuess(guess); // 猜测交给控制器
  guessInput.value = "";//将表框输入的值重置为空
}

function handleKeyPress(e) { //浏览器想事件处理程序传递信息
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;