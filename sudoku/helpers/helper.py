from argparse import ArgumentParser
from itertools import combinations

class SudokuHelper:
    def __init__(self) -> None:
        self.__run()

    def __run(self) -> None:
        parser = ArgumentParser()

        parser.add_argument("--cannot-be", type=int, default=[0], nargs="+")
        parser.add_argument("--must-has", type=int, default=[], nargs="+")
        parser.add_argument("--count", type=int)
        parser.add_argument("--sum", type=int)
        self.params = parser.parse_args()

        for possibles in combinations([i for i in range(1, 10) if i not in self.params.cannot_be], self.params.count):
            if all([int(i) in possibles for i in self.params.must_has]):
                if sum(possibles) == self.params.sum:
                    print(possibles)

if "__main__" == __name__: SudokuHelper()