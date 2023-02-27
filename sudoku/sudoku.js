class Sudoku {
	constructor(K) {
		this.N = 9
		this.K = K

        const SRNd = Math.sqrt(this.N)
		this.SRN = Math.floor(SRNd)

        this.solution = Array.from({ length: this.N }, () => Array.from({ length: this.N }, () => 0))
        this.clues = Array.from({ length: this.N }, () => Array.from({ length: this.N }, () => 0))
	}

	fillValues() {
		this.fillDiagonal()
		this.fillRemaining(0, this.SRN)
		this.removeKDigits() 
	}

	fillDiagonal() { for (let i = 0; i < this.N; i += this.SRN) this.fillBox(i, i) }

	unUsedInBox(rowStart, colStart, num) {
		for (let i = 0; i < this.SRN; i++) {
			for (let j = 0; j < this.SRN; j++) if (this.solution[rowStart + i][colStart + j] === num) return false
		}
		return true
	}

	fillBox(row, col) {
		let num = 0
		for (let i = 0; i < this.SRN; i++) {
			for (let j = 0; j < this.SRN; j++) {

				while (true) {
					num = this.randomGenerator(this.N)
					if (this.unUsedInBox(row, col, num)) break
				}

				this.solution[row + i][col + j] = num
				this.clues[row + i][col + j] = num
			}
		}
	}

	randomGenerator(num) { return Math.floor(Math.random() * num + 1) }

	checkIfSafe(i, j, num) {
		return (this.unUsedInRow(i, num) && this.unUsedInCol(j, num) &&
			this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num))
	}

	unUsedInRow(i, num) {
		for (let j = 0; j < this.N; j++) if (this.solution[i][j] === num) return false
		return true
	}

	unUsedInCol(j, num) {
		for (let i = 0; i < this.N; i++) if (this.solution[i][j] === num) return false
		return true
	}

	fillRemaining(i, j) {
		if (i === this.N - 1 && j === this.N) return true
		if (j === this.N) {
			i += 1
			j = 0
		}
		if (this.solution[i][j] !== 0) return this.fillRemaining(i, j + 1)

		for (let num = 1; num <= this.N; num++) {
			if (this.checkIfSafe(i, j, num)) {
				this.solution[i][j] = num
				this.clues[i][j] = num

				if (this.fillRemaining(i, j + 1)) return true
				this.solution[i][j] = 0
				this.clues[i][j] = 0
			}
		}
		return false
	}

    removeKDigits() {
		let count = this.K
		while (count !== 0) {

			let i = Math.floor(Math.random() * this.N)
			let j = Math.floor(Math.random() * this.N)
			if (this.clues[i][j] !== 0) {
                this.clues[i][j] = "-"
				count--
			}
		}
	}

	getSolution() { return this.solution }
	getClues() { return this.clues }
}

function setBlockRange(square, rowPosition, number, column) {
    if (rowPosition && (3 <= column && column < 6)) square.classList.add(`block${number + 1}`)
    if (rowPosition && 6 <= column) square.classList.add(`block${number + 2}`)
    if (rowPosition && column < 3) square.classList.add(`block${number}`)
}

let sudoku = new Sudoku(Math.floor(Math.random() * 100))
sudoku.fillValues()

let solution = sudoku.getSolution()
let clues = sudoku.getClues()
var numberSelected = null
var squareSelected = null

function setBlockRange(square, rowPosition, number, column) {
    if (rowPosition && (3 <= column && column < 6)) square.classList.add(`block${number + 1}`)
    if (rowPosition && 6 <= column) square.classList.add(`block${number + 2}`)
    if (rowPosition && column < 3) square.classList.add(`block${number}`)
}

window.onload = function() {
    const digits = document.getElementById("digits")
    const board = document.getElementById("board")
    
    for (let r = 0; r < 9; r++) {
        let number = document.createElement("div")

        number.addEventListener("click", function() {
            if (null != numberSelected) numberSelected.classList.remove("selected")

            numberSelected = this
            numberSelected.classList.add("selected")
        })

        number.classList.add("number")
        digits.appendChild(number)
        number.innerText = r + 1
        number.id = r + 1

        for (let c = 0; c < 9; c++) {
            let square = document.createElement("div")
            
            square.addEventListener("click", function() {
                if (numberSelected) {
                    if ("" != this.innerText && !this.classList.contains("wrong")) return
                    this.innerText = numberSelected.id
                }

                let coords = this.id.split("-")
                let isRight = solution[parseInt(coords[0])][parseInt(coords[1])] == numberSelected.id

                this.classList.remove(!isRight ? "right" : "wrong", "empty")
                this.classList.add(isRight ? "right" : "wrong")
            })

            square.classList.add("square", `row${r}`, `column${c}`)
            setBlockRange(square, (3 <= r && r < 6), 4, c)
            setBlockRange(square, 6 <= r, 7, c)
            setBlockRange(square, r < 3, 1, c)
            square.id = `${r}-${c}`

            if ("-" != clues[r][c]) {
                square.innerText = clues[r][c]
                square.classList.add("start")
            } else { square.classList.add("empty") }

            if (2 == r || 5 == r) square.classList.add("horizontal")
            if (2 == c || 5 == c) square.classList.add("vertical")
            board.appendChild(square)
        }
    }
}
