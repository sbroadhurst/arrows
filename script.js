var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
var nameBox = document.getElementById('nameBox')
nameBox.style.display = 'none'
nameBox.maxLength = '3'
var goalImage = new Image()
goalImage.src = './images/goal.png'
var upImage = new Image()
upImage.src = './images/upArrow.png'
var downImage = new Image()
downImage.src = './images/downArrow.png'
var leftImage = new Image()
leftImage.src = './images/leftArrow.png'
var rightImage = new Image()
rightImage.src = './images/rightArrow.png'
var music = new Audio('./music/Fantasia.mp3')

const modes = document.getElementById('modes')
var easy = document.getElementById('easy')
var medium = document.getElementById('medium')
var hard = document.getElementById('hard')
var all = document.getElementById('all')
var dx = 3
var length = 151
var difficulty = 'Easy'

//add event listener
function startGame() {
  let localTime = Math.round(time / 60)
  let speed
  easy.addEventListener('click', function(event) {
    difficulty = 'Easy'
    paused = false
    music = new Audio('./music/Fantasia.mp3')
    speed = 1000
    setInterval(addArrow, speed)
    dx = 3
    length = 151
  })
  medium.addEventListener('click', function(event) {
    difficulty = 'medium'
    paused = false
    music = new Audio('./music/Cadmium.mp3')
    speed = 500
    setInterval(addArrow, speed)
    dx = 4
    length = 193
  })
  hard.addEventListener('click', function(event) {
    difficulty = 'Hard'
    paused = false
    music = new Audio('./music/WhyWeLose.mp3')
    speed = 300
    setInterval(addArrow, speed)
    dx = 5
    length = 213
  })
  all.addEventListener('click', function(event) {
    // if (localTime < 151) {
    //   paused = false
    //   music = new Audio('./music/Fantasia.mp3')
    //   speed = 1000
    //   setInterval(addArrow, speed)
    //   dx = 3
    // } else if (localTime >= 151 && localTime < 193 + 151) {
    //   paused = false
    //   music = new Audio('./music/Cadmium.mp3')
    //   speed = 500
    //   setInterval(addArrow, speed)
    //   dx = 4
    // } else {
    //   paused = false
    //   music = new Audio('./music/WhyWeLose.mp3')
    //   speed = 300
    //   setInterval(addArrow, speed)
    //   dx = 5
    //   length = 151 + 193 + 213
    // }
    difficulty = 'All'
    paused = false
    music = new Audio('./music/mix.mp3')
    speed = 450
    setInterval(addArrow, speed)
    dx = 3.5
    length = 549
  })
}

startGame()

const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']
var min = 0
var max = keys.length - 1
var keydown = false

var x = canvas.width
var y = canvas.height

const arrowRadius = 50

var arrows = []
const goals = [{ x: x - 150, y: y * 0.25 }, { x: x - 150, y: y * 0.5 }, { x: x - 150, y: y * 0.75 }]

var keyPressed = ''
var score = 0
var time = 0
var chain = 0
var highestChain = 0
var paused = true
var gameEnd = false
var count = 0
var countDown = 20 * 60
let scoreBoard = []
var database = firebase.database()
var ref = database
  .ref('arrows')
  .orderByChild('score')
  .limitToFirst(10)

// ref.on(
//   'value',
//   data => {
//     scoreBoard = sortData(data.val(), 'order')
//     console.log(scoreBoard)
//   },
//   err => {}
// )

function sortData(data, attr) {
  var arr = []
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var obj = {}
      obj[prop] = data[prop]
      obj.tempSortName = data[prop][attr]
      arr.push(obj)
    }
  }

  arr.sort(function(a, b) {
    var at = a.tempSortName,
      bt = b.tempSortName
    return at > bt ? 1 : at < bt ? -1 : 0
  })

  var result = []
  for (var i = 0, l = arr.length; i < l; i++) {
    var obj = arr[i]
    delete obj.tempSortName
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var id = prop
      }
    }
    var item = obj[id]
    result.push(item)
  }
  return result
}

function gotData(data) {
  scoreBoard = sortData(data.val(), 'order')
}

function errData(err) {
  console.log('Error: ' + err)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min
}

document.addEventListener('keydown', keyDownHandler)
//document.addEventListener('keyup', keyUpHandler)
window.addEventListener(
  'keydown',
  function(e) {
    // space and arrow keys
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault()
    }
  },
  false
)

function addArrow() {
  if (!paused) {
    arrow = { x: 100, row: getRandomInt(min, 2), keyIndex: getRandomInt(min, max) }

    arrows.push(arrow)
  }
}

function drawArrows() {
  arrows.forEach(arrow => {
    let row
    if (arrow.row === 0) row = y * 0.25
    if (arrow.row === 1) row = y * 0.5
    if (arrow.row === 2) row = y * 0.75

    if (arrow.keyIndex === 0) void ctx.drawImage(leftImage, arrow.x, row, arrowRadius, arrowRadius)
    if (arrow.keyIndex === 1) void ctx.drawImage(rightImage, arrow.x, row, arrowRadius, arrowRadius)
    if (arrow.keyIndex === 2) void ctx.drawImage(downImage, arrow.x, row, arrowRadius, arrowRadius)
    if (arrow.keyIndex === 3) void ctx.drawImage(upImage, arrow.x, row, arrowRadius, arrowRadius)
  })
}

function keyDownHandler(e) {
  // if (e.code == 'Enter' && gameEnd === false) {
  //   paused = !paused
  //   keydown = false
  // } else {
  keyPressed = e.key
  keydown = true
  // }
}

// function keyUpHandler(e) {
//   if (e.key == 'ArrowRight' || e.key == 'd') {
//     rightPressed = false
//   } else if (e.key == 'ArrowLeft' || e.key == 'a') {
//     leftPressed = false
//   }
// }

function drawGoal() {
  goals.forEach(goal => {
    void ctx.drawImage(goalImage, goal.x, goal.y, arrowRadius, arrowRadius)
  })
}

function collisionDetection() {
  if (arrows.length > 0) {
    goals.forEach(goal => {
      if (arrows[0].x > goal.x + arrowRadius + 10) {
        console.log('over')
        arrows.shift()
        if (chain > highestChain) {
          highestChain = chain
        }
        chain = 0
        keyPressed = ''
      }
      if (arrows[0].x + arrowRadius < goal.x && keydown === true) {
        console.log('under')
        keyPressed = ''
        keydown = false
      }
      if (
        arrows[0].x + arrowRadius > goal.x &&
        keyPressed != keys[arrows[0].keyIndex] &&
        arrows[0].x < goal.x + arrowRadius &&
        keydown === true
      ) {
        console.log('chain broke')
        if (chain > highestChain) {
          highestChain = chain
        }
        chain = 0
      } else if (keyPressed === keys[arrows[0].keyIndex]) {
        console.log('hit')
        arrows.shift()
        score++
        chain++
        keyPressed = ''
      }
    })
  }
}

function drawScore() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 10, 20)
}

function drawTime(time) {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Time: ' + Math.round(time) + 's', x / 2 - 170, 20)
}

function drawChain() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Chain: ' + chain, x / 2, 20)
}

function drawLevel() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Level: ' + difficulty, 790, 20)
}

function drawStartScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '80px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Musical Arrows!', 200, 100)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Click   on   a   difficulty   to   start   the   game!', 290, 150)
  drawScoreBoard()
}

function drawScoreBoard() {
  ref.on('value', gotData, errData)

  let y = 290
  let position = 1
  var keys = Object.keys(scoreBoard)
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i]
    var name = scoreBoard[k].name
    var score = scoreBoard[k].score
    ctx.fillStyle = 'white'
    ctx.font = '30px ArcadeClassic'

    ctx.fillText('Leaderboard Scores:', 340, 220)
    ctx.font = '24px ArcadeClassic'

    ctx.fillText(position + '.  ' + name, 420, y)
    ctx.fillText(score, 530, y)
    y += 30
    position++
  }
}

function drawCountDown() {
  ctx.fillStyle = 'white'
  ctx.font = '40px ArcadeClassic'
  ctx.fillText(Math.round(countDown / 60), 700, 120)
  countDown--
}

function drawGameEndScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '50px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Game End', 400, 100)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Final Score = ' + score, 430, 150)
  ctx.fillText('Enter name: ', 430, 180)
  nameBox.style.display = 'block'
  modes.style.display = 'none'

  drawScoreBoard()
  drawCountDown()

  //// will be used for when we enter a name
  document.addEventListener('keydown', function(evt) {
    if (event.code == 'Enter') {
      countDown = 1
    }
    if ((evt.keyCode < 65 && evt.keyCode !== 8) || evt.keyCode > 90) {
      evt.preventDefault()
    }
  })

  if (countDown === 0) {
    var data = {
      name: nameBox.value,
      score: score + highestChain,
      order: -1 * (score + highestChain)
    }

    database
      .ref()
      .child('arrows')
      .push(data)

    document.location.reload()
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (paused) {
    if (music) music.pause()
    drawStartScreen()
  } else if (gameEnd) {
    drawGameEndScreen()
  } else {
    //draw input area
    modes.style.display = 'none'

    music.play()
    drawGoal()

    collisionDetection()
    drawScore()
    drawLevel()
    drawArrows()
    drawChain()

    time++
    drawTime(time / 60)
  }

  if (time / 60 === length) {
    gameEnd = true
  }

  arrows.forEach(arrow => {
    arrow.x += dx
  })

  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
