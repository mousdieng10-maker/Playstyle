import webview
import bcrypt 
import checkfile 
import rewrite as re
from pathlib import Path

abs_path = Path(__file__).resolve().parent
#path to where the accounts are stored 
config_file = abs_path/"config"/"accounts.json"
#path to where the account currently signed in is stored
current_config_file = abs_path/"config"/"currentAcc.json"

def make_path(target):
    return abs_path/"config"/target
class Api():
    def login(self,username,password):
        exists = False
        data = checkfile.read(config_file)
        for account in data:
            if account.get("username").lower() == username.lower(): 
                exists = True
                account_to_sign = account
        if exists == False:
            return "This account does not exist"
        else:
            if bcrypt.checkpw(password.encode(), account_to_sign.get("password").encode()):
                re.write(current_config_file, account_to_sign)
                return True
            else:
                return "Incorrect Password, Please try again!"


    def signup(self, username, password):
        exists = False 
        data = checkfile.read(config_file)
        for account in data:
            if account.get("username") == username:
                exists = True
        if exists:
            return "This account already exists, please try again!"
        else:
            hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt() )
            account_dict = {
                "username":username, 
                "password":hashed_password.decode(),
                "age":20,
                "pace":50,
                "meta":50,
                "acceleration":50,
                "physical":50,
                "vision":50,
                "playstyle":"",
            }
            re.write(current_config_file, account_dict)
            data.append(account_dict)
            re.write(config_file, data)
            return True
    def greetSelf(self):
            import random
            data = checkfile.read(current_config_file)
            random_phrases = checkfile.read(make_path("greetList.json"))
            
            username = data.get("username")
            return random_phrases.get(str(random.randint(1,31))).format(username)
    def get_user_obj(self):
        from manageAcc import Account
        user = checkfile.read(current_config_file)  
        user_object = Account(user.get("username"), user.get("meta"),user.get("pace"), user.get("acceleration"), user.get("physical"), user.get("vision"), user.get("playstyle"))    
        return user_object

    def getStats(self):

        user_object = self.get_user_obj()
        return user_object.giveStatsDict() 
    def setPlaystyle(self, playstyle):
        data = checkfile.read(current_config_file)
        data["playstyle"] = playstyle
        account_data = checkfile.read(config_file)
        for account in account_data:
            if account.get("username") == data.get("username"):
                account["playstyle"] = playstyle
                re.write(config_file, account_data)
        re.write(current_config_file,data)
        return True 
    def showQuests(self):
        user = self.get_user_obj()
        return user.assignPlaystyle()
    
    def save_log(self, log_to_save):
        data = checkfile.read(make_path("log.json"))
        data[f"log num {len(data)+1}"] = log_to_save
        re.write(make_path("log.json"), data)
        return("Houbini Boubini! Job done, upgrade time!")
    def rid_task(self, task_to_remove):
        found = False 
        def search_list(list_to_search, quest_level):
            for task in list_to_search:
                if task.get("quest_name") == task_to_remove:
                    point_playstyle.get(quest_level).remove(task)
                    return True            

        data = checkfile.read(make_path("quests.json"))
        user = checkfile.read(make_path("currentAcc.json"))
        point_playstyle = data.get(user.get("playstyle"))
        
        while found != True:
            found = search_list(point_playstyle.get("lower_quests"), "lower_quests")
            if found == True:
                break
            found = search_list(point_playstyle.get("medium_quests"), "medium_quests")
            if found == True:
                break
            found = search_list(point_playstyle.get("higher_quest"), "higher_quest")
            if found == True:
                break
            found = search_list(point_playstyle.get("exceptional_quests"), "exceptional_quests")
            if found == True:
                break
            if found != True:
                break 
        re.write(make_path("quests.json"), data)
            
        

api = Api()
webview.create_window("Playstyle", "app/index.html", js_api=api)

webview.start()