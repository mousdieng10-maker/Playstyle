import random
from pathlib import Path
import checkfile
import rewrite as re

abs_path = Path(__file__).resolve().parent


class Player:
    def __init__(self, name, tier, pace, acceleration, vision, meta,physical):
        self.name = name
        self.tier = tier
        self.pace = pace
        self.acceleration =  acceleration
        self.vision = vision
        self.meta = meta
        self.physical = physical
    def calculate_play_ovr(self):
        ovr = round((self.pace + self.acceleration + self.vision + self.meta + self.physical) / 5)
        self.ovr = ovr
    
            
        
        



def set_up_user():
    import checkfile
    from manageAcc import Account
    data = checkfile.read(abs_path/"config"/"currentAcc.json")
    user = Account(data.get("username"), data.get("meta"), data.get("pace"), data.get("acceleration"), data.get("physical"), data.get("vision"), data.get("playstyle"))
    user_ovr = user.calculate_ovr()
    if 50 <= user_ovr < 58:
        return "low"
    elif 58 <= user_ovr < 66:
        return "shallow"
    elif 66 <= user_ovr < 74:
        return "mid"
    elif 74 <= user_ovr < 82:
        return "great"
    elif 82 <= user_ovr < 90:
        return "high"
    elif 90 <= user_ovr <= 99:
        return "world_class"
    
rank = set_up_user()


def define_opp_rank():
    data = checkfile.read(abs_path/"config"/"opponents.json")
    object_list = []
    low_tier = []
    shallow_tier = []
    mid_tier = []
    great_tier = []
    high_tier = []
    world_class_tier = []
    for opp in data:
        user = Player(opp.get("name"), opp.get("tier"), opp.get("pace"), opp.get("acceleration"), opp.get("vision"), opp.get("meta"), opp.get("physical"))
        object_list.append(user)
    for obj in object_list:
        if obj.tier == "low":
            low_tier.append(obj)
        elif obj.tier == "shallow":
            shallow_tier.append(obj)
        elif obj.tier == "mid":
            mid_tier.append(obj)
        elif obj.tier == "great":
            great_tier.append(obj)
        elif obj.tier == "high":
            high_tier.append(obj)
        elif obj.tier == "world_class":
            world_class_tier.append(obj)
    tier_dict = {
        "low":low_tier,
        "shallow":shallow_tier,
        "mid":mid_tier,
        "great":great_tier,
        "high":high_tier,
        "world_class":world_class_tier
    }
    return tier_dict
    
def choose_opponent():
    tier_players = define_opp_rank()
    opponent = random.choice(tier_players.get(rank))
    opponent.calculate_play_ovr()
    return opponent

