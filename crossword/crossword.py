from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
browser.get("https://thewordsearch.org/")
action = ActionChains(browser)

def get_lines(board):
    max_row = len(board)
    max_col = len(board[0])

    rows = [[] for _ in range(max_row)]
    columns = [[] for _ in range(max_col)]
    forward_diagonals = [[] for _ in range(max_row + max_col - 1)]
    backward_diagonals = [[] for _ in range(len(forward_diagonals))]

    for x in range(max_col):
        for y in range(max_row):
            rows[y].append(board[y][x])
            columns[x].append(board[y][x])
            forward_diagonals[x + y].append(board[y][x])
            backward_diagonals[x - y - (- max_row + 1)].append(board[y][x])

    return rows, columns, forward_diagonals, backward_diagonals

def get_words_to_find():
    return list(map(lambda w: w.text,
        filter(lambda w: "wordFound" not in w.get_attribute("class"),
            browser.find_element(By.ID, "words").find_elements(By.TAG_NAME, "li"))
        )
    )

def check_if_exists(line, cells):
    line = "".join(line)

    for word in get_words_to_find():
        found = False

        if word in line:
            start, found = line.find(word), True
            end = start + len(word) - 1
            print(word, start, end)

        elif word in line[::-1]:
            start, found = -(line[::-1].find(word) + 1), True
            end = start - len(word) + 1
            print(word, start, end)

        if found:
            action.drag_and_drop(cells[start], cells[end])
            action.perform()

board = browser.find_element(By.ID, "wordsearchGrid").find_elements(By.CLASS_NAME, "row")
trows, tcolumns, tfrontd, tbackd = get_lines([ element.text.split("\n") for element in board])
rows, columns, frontd, backd = get_lines([ element.find_elements(By.CLASS_NAME, "cell") for element in board])

for dimension in [(trows, rows), (tcolumns, columns), (tfrontd, frontd), (tbackd, backd)]:
    text_lines, cells_lines = dimension

    [ check_if_exists(line, cells_lines[l]) for l, line in enumerate(text_lines) ]

browser.close()
