import webview
import bcrypt 
import checkfile 
import rewrite as re
from pathlib import Path

abs_path = Path(__file__).resolve().parent
config_file = abs_path/"config"/"accounts.json"
print(config_file)
class Api():
    def login(self,username,password):
        exists = False
        data = checkfile.read(config_file)
        for account in data:
            if account.get("username") == username: 
                exists = True
        if exists == False:
            return "This account does not exist"
        else:
            for account in data:
                if bcrypt.checkpw(password.encode(), account.get("password").encode()):
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
                "password":hashed_password.decode() 
            }
            data.append(account_dict)
            re.write(config_file, data)
            return True


api = Api()
webview.create_window("Playstyle", "app/index.html", js_api=api)

webview.start()