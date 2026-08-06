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
        

api = Api()
webview.create_window("Playstyle", "app/index.html", js_api=api)

webview.start()