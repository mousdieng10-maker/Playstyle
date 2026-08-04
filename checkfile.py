import json
from json import JSONDecodeError

def read(file):
    while True:
        try:
            with open(file, "r") as f:
                data = json.load(f)
            return data
        except JSONDecodeError:
            with open(file, "w") as folder:
                json.dump([], folder, indent=4)
        except FileNotFoundError:
            open(file, "x")
