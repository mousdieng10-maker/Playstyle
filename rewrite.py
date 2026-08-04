import json
from json import JSONDecodeError

def write(file, data):
    while True:
        try:

            with open(file,"w") as f:
                json.dump(data, f, indent=4)
            break 
        except JSONDecodeError:
            with open(file, "w") as f:
                json.dump( [],f, indent=4)
        except FileNotFoundError:
            open(file, "x")