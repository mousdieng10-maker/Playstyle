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
    def calculate_ovr(self):
        # each stat will be given a certain weight, meta and physical will have the greatest weighs
        overall = round((self.pace*.24)+(self.meta*.24)+(self.vision*.20)+(self.pace*.20)+(self.acceleration*.11))
        return overall 
    def giveStatsDict(self):
        player_dict = {
            "pace":self.pace,
            "meta":self.meta,
            "acceleration":self.acceleration,
            "physical":self.physical,
            "vision":self.vision,
            "overall":self.calculate_ovr()
        }
        return player_dict

