from pathlib import Path
import checkfile
import random 


abs_path = Path(__file__).resolve().parent
#show where config files are located
current_config_file = abs_path/"config"/"currentAcc.json"
config_file = abs_path/"config"/"currentAcc.json"

class Account:
    def __init__(self, name, meta,pace, acceleration, physical, vision):
        self.name = name
        self.pace = pace
        self.meta = meta
        self.acceleration = acceleration
        self.physical = physical
        self.vision = vision
    

