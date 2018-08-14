"use strict";

var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;
// 設寬高滿版
window.addEventListener("resize", function () {
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
});

// 定義球的類別
var Ball = function Ball() {
  // 位置
  this.p = {
    x: ww / 2,
    y: wh / 2
    // 速度
  };this.v = {
    x: 10,
    y: 5
    // 加速度
  };this.a = {
    x: 0,
    y: 0.8
    // 大小
  };this.r = 50;
  // 有無被拖曳
  this.dragging = false;
};

// 畫球
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.save();
  // 移動到這顆球的座標在畫圓
  ctx.translate(this.p.x, this.p.y);
  ctx.arc(0, 0, this.r, 0, Math.PI * 2);
  ctx.fillStyle = controls.color;
  ctx.fill();
  ctx.restore();

  this.drawV();
};

// 球的速度線
Ball.prototype.drawV = function () {
  ctx.beginPath();
  ctx.save();
  ctx.translate(this.p.x, this.p.y);
  ctx.scale(3, 3);
  ctx.moveTo(0, 0);
  ctx.lineTo(this.v.x, this.v.y);
  ctx.strokeStyle = "blue";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(this.v.x, 0);
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, this.v.y);
  ctx.strokeStyle = "green";
  ctx.stroke();

  ctx.restore();
};

// 球的更新
Ball.prototype.update = function () {
  if (this.dragging == false) {
    this.p.x += this.v.x;
    this.p.y += this.v.y;

    this.v.x += this.a.x;
    this.v.y += this.a.y;

    // 摩擦力
    this.v.x *= controls.fade;
    this.v.y *= controls.fade;

    // 新數值更新在控制項上
    controls.vx = this.v.x;
    controls.vy = this.v.y;
    controls.ay = this.a.y;

    this.checkBoundary();
  }
};

// 邊界碰撞
Ball.prototype.checkBoundary = function () {
  // 往右的速度+球半徑>視窗寬度(abs=絕對值)
  if (this.p.x + this.r > ww) {
    this.v.x = -Math.abs(this.v.x);
  }
  // 往右的速度-球半徑<0
  if (this.p.x - this.r < 0) {
    this.v.x = Math.abs(this.v.x);
  }
  if (this.p.y + this.r > wh) {
    this.v.y = -Math.abs(this.v.y);
  }
  if (this.p.y - this.r < 0) {
    this.v.y = Math.abs(this.v.y);
  }
};

// 設控制項
var controls = {
  vx: 0,
  vy: 0,
  ay: 0.6,
  fade: 0.99,
  update: true,
  color: "#fff",
  step: function step() {
    ball.update();
  },
  FPS: 60
  // 控制介面dat.gui
};var gui = new dat.GUI();
gui.add(controls, "vx", -50, 50).listen().onChange(function (value) {
  ball.v.x = value;
});
gui.add(controls, "vy", -50, 50).listen().onChange(function (value) {
  ball.v.y = value;
});
gui.add(controls, "ay", -1, 1).step(0.01).listen().onChange(function (value) {
  ball.a.y = value;
});
gui.add(controls, "fade", 0, 1).step(0.01).listen();
gui.add(controls, "update");
gui.addColor(controls, "color");
gui.add(controls, "step");
gui.add(controls, "FPS", 1, 120);

// 初始化
var ball;
function init() {
  ball = new Ball();
}
init();
// 更新速度
function update() {
  if (controls.update) {
    ball.update();
  }
}
setInterval(update, 1000 / 30);

// 繪圖
function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, ww, wh);
  ball.draw();
  // requestAnimationFrame(draw)
  setTimeout(draw, 1000 / controls.FPS);
}
// requestAnimationFrame(draw)
draw();

function getDistance(p1, p2) {
  // pow 平方 | sqrt 開根號
  var temp1 = p1.x - p2.x;
  var temp2 = p1.y - p2.y;
  var dist = Math.pow(temp1, 2) + Math.pow(temp2, 2);
  return Math.sqrt(dist);
}

console.clear();
var mousePos = { x: 0, y: 0 };
canvas.addEventListener("mousedown", function (evt) {
  mousePos = { x: evt.x, y: evt.y };
  var dist = getDistance(mousePos, ball.p);
  console.log(dist);
  if (dist < ball.r) {
    console.log("click ball");
    ball.dragging = true;
  }
});
canvas.addEventListener("mousemove", function (evt) {
  var nowPos = { x: evt.x, y: evt.y };
  if (ball.dragging) {
    var dx = nowPos.x - mousePos.x;
    var dy = nowPos.y - mousePos.y;

    ball.p.x += dx;
    ball.p.y += dy;

    ball.v.x = dx;
    ball.v.y = dy;
  }
  var dist = getDistance(mousePos, ball.p);
  if (dist < ball.r) {
    canvas.style.cursor = "move";
  } else {
    canvas.style.cursor = "initial";
  }
  mousePos = nowPos;
});
canvas.addEventListener("mouseup", function (evt) {
  ball.dragging = false;
});
//# sourceMappingURL=main.js.map
