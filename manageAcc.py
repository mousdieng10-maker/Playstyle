from pathlib import Path
import checkfile
import random 


abs_path = Path(__file__).resolve().parent
#show where config files are located
current_config_file = abs_path/"config"/"currentAcc.json"
config_file = abs_path/"config"/"currentAcc.json"
quests_config = abs_path/"config"/"quests.json"
class Account:
    def __init__(self, name, meta,pace, acceleration, physical, vision, playstyle):
        self.name = name
        self.pace = pace
        self.meta = meta
        self.acceleration = acceleration
        self.physical = physical
        self.vision = vision
        self.playstyle = playstyle
    def calculate_ovr(self):
        # each stat will be given a certain weight, meta and physical will have the greatest weighs
        overall = round((self.pace*.24)+(self.meta*.24)+(self.vision*.20)+(self.physical*.20)+(self.acceleration*.11))
        return overall 
    def giveStatsDict(self):
        player_dict = {
            "username":self.name, 
            "pace":self.pace,
            "meta":self.meta,
            "acceleration":self.acceleration,
            "physical":self.physical,
            "vision":self.vision,
            "overall":self.calculate_ovr(),
            "playstyle":self.playstyle
        }
        return player_dict
    
    def assignPlaystyle(self):
        data = checkfile.read(quests_config)
        if self.playstyle == "defender":
            playstyle = data.get("defender")
        elif self.playstyle == "playmaker":
            playstyle = data.get("playmaker")
        elif self.playstyle == "all_rounder":
            playstyle = data.get("all_rounder")
        elif self.playstyle == "tekkers":
            playstyle = data.get("tekkers")
        return playstyle 
    def reward_quest(self):
        pass 
