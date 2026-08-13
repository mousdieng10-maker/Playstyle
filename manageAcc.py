from pathlib import Path
import checkfile
import random 
import rewrite as re

abs_path = Path(__file__).resolve().parent
#show where config files are located
current_config_file = abs_path/"config"/"currentAcc.json"
config_file = abs_path/"config"/"accounts.json"
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
        playstyle = data.get(self.playstyle)
        return playstyle 
    def reward_quest(self):
        upgrade_list = ["pace","meta","acceleration","vision","physical"]
        defender_list = ["pace","pace","pace", "physical","physical","physical","physical", "acceleration","meta"]
        tekkers_list = ["pace","pace","pace", "vision", "vision", "meta"]
        all_rounder_list = upgrade_list
        playmaker_list = ["pace","meta","meta","meta","acceleration","vision","vision","vision","physical"]
        assign_dict  = {
            "defender":defender_list,
            "tekkers":tekkers_list, 
            "all_rounder":all_rounder_list, 
            "playmaker":playmaker_list
        }
        while True:
            stat_to_upg = random.choice(assign_dict.get(self.playstyle))
            if getattr(self, stat_to_upg) <= 95:
                setattr(self, stat_to_upg, getattr(self,stat_to_upg)+4)
                break 

    def update_json(self):
        self.reward_quest()
        data = checkfile.read(current_config_file)
        root_data = checkfile.read(config_file)
        data["pace"]= self.pace
        data["acceleration"]= self.acceleration
        data["meta"]= self.meta
        data["vision"]= self.vision
        data["physical"]= self.physical
        for account in root_data:
            if account.get("username") == self.name:
                account["pace"] = self.physical
                account["acceleration"]= self.acceleration
                account["meta"]= self.meta
                account["vision"]= self.vision
                account["physical"]= self.physical
        re.write(current_config_file,data)
        re.write(config_file, root_data)

