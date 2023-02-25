var numberSelected = null
var squareSelected = null

var clues = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

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