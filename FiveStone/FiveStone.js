var Stone = require('Stone');


export default class FiveStone {
  constructor(cellNumber, scaleRatio) {
    let self = this
    this.boardMatrix = Array.from(Array(cellNumber), () => {
      return Array(cellNumber).fill(Stone.none)
    })
    this.pieceMatrix = Array.from(Array(cellNumber + 1), () => {
      return Array(cellNumber + 1).fill(Stone.none)
    })
    this.nowStone = Stone.black
    this.history = []
    this.rowSize = cellNumber
    this._canStep = true
    this._winPiecePos
    wx.getSystemInfo({
      success: res => {
        this.boardWidthPx = res.windowWidth * scaleRatio
        this.cellSize = res.windowWidth * scaleRatio / cellNumber  
        this.halfCellSize = this.cellSize * 0.5
        this.offsetLeft = (res.windowWidth - this.boardWidthPx) /2
        this.offsetTop = 35
        console.log(res.windowWidth)
      }
    })
    console.log(this.boardWidthPx)
  }
  /**
   * @param e 触控事件
   * @return pos.x, pos.y 返回的是触控的坐标
   */
  getCellPos(e) {
    let x = e.touches[0].pageX
    let y = e.touches[0].pageY
    let offsetX = e.currentTarget["offsetLeft"];
    let offsetY = e.currentTarget["offsetTop"];
    this.pos = {
      x: Math.floor((x - 21 + this.halfCellSize) / this.cellSize),
      y: Math.floor((y - 35 + this.halfCellSize) / this.cellSize),
    }

    if (this.pos.x < 0 || this.pos.x > this.rowSize ||
      this.pos.y < 0 || this.pos.y > this.rowSize)
      return null

    else return this.pos
  }
  /**
   * @param e 触控事件
   * @return pos.top, pos.left 返回矫正后的在棋子的绝对坐标
   */
  getAbsPosPx(e) {
    let pos = this.getCellPos(e);

    if (!pos) return null;

    let absLeftPx = this.cellSize * pos.x + this.offsetLeft - this.halfCellSize - 1;
    let absTopPx = this.cellSize * pos.y + this.offsetTop - this.halfCellSize - 1;

    return {
      absLeft: absLeftPx,
      absTop: absTopPx,
    }
  }

  step(cellPos, absPosPx) {
    if (this.canStep() && this.pieceMatrix[cellPos.x][cellPos.y] == 0) {
      this.pieceMatrix[cellPos.x][cellPos.y] = this.nowStone;
      this.history.push({
        absLeft: absPosPx.absLeft,
        absTop: absPosPx.absTop,
        type: this.nowStone,
        x: cellPos.x,
        y: cellPos.y
      })
      if (this.judge()) {
        this._canStep = false
        //show animation
      }
      this.nowStone = -this.nowStone
    }
  }

  aiStep(cellPos) {
    if (this.canStep() && this.pieceMatrix[cellPos.x][cellPos.y] == 0) {
      this.pieceMatrix[cellPos.x][cellPos.y] = this.nowStone
      let absLeft = cellPos.x * this.cellSize + this.offsetLeft - this.halfCellSize - 1
      let absTop = cellPos.y * this.cellSize + this.offsetTop - this.halfCellSize - 1
      this.history.push({
        absLeft: absLeft,
        absTop: absTop,
        type: this.nowStone,
        x: cellPos.x,
        y: cellPos.y
      })
      if(this.judge()){
        this._canStep = false
      }
      this.nowStone = -this.nowStone
    }

  }

  canStep() {
    return this._canStep
  }

  /**
   * 判断是否五子连在一起
   * return 
   */
  judge() {
    let directions = [
      [1, 1],
      [1, -1],
      [0, 1],
      [1, 0]
    ];

    for (let i = 0; i <= this.rowSize; i++) {
      for (let j = 0; j <= this.rowSize; j++) {
        for (let direct of directions) {
          if (this.judgeFiveInLine(i, j, direct)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  judgeFiveInLine(i, j, direction) {
    let sum = 0,
      count = 0;
    while (count < 5) {
      if (count * direction[0] + i <= this.rowSize && count * direction[1] + j <= this.rowSize) {
        sum += this.pieceMatrix[count * direction[0] + i][count * direction[1] + j]
      }
      count++
    }
    if (sum == 5 || sum == -5) {
      return true
    } else {
      return false
    }
  }
  backMove() {
    if (this.canStep()) {
      if(this.history.length == 0) return
      let last = this.history.pop()
      this.nowStone = -1 * this.nowStone
      this.pieceMatrix[last.x][last.y] = 0
      
    }
  }
  getLastPos() {
      let n = this.history.length
      return this.history[n - 1].x
  }

  isLast(piece) {
      let n = this.history.length
      console.log('xxx')
      return this.history[n - 1].x == piece.x && this.history[n - 1].y == piece.y
  }

  takeBack(){
    let lastStone = this.history.pop()
    this.nowStone = -this.nowStone
    this.pieceMatrix[lastStone.x][lastStone.y] = Stone.none
    return {
      x: lastStone.x,
      y: lastStone.y
    }
  }
}