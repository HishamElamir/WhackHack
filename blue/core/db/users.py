import datetime
import random
from flask_bcrypt import bcrypt

class Users:
    def __init__(self, db=None):
        self._users = db.users
        pass
    
    # ID
    def get_user_id_by_email(self, user_email):
        """
        Get `user_id` given his/her `email`
        
        Params: `user_email`
        Returns: `user_id`
        
        """
        return self._users.find_one({"email": user_email})['_id']
    def get_user_id_by_username(self, username):
        """
        Get `user_id` given his/her username
        
        Params: `user_name`
        Returns: `user_id`
        
        """
        return self._users.find_one({"username": username})['_id']
    def check_user_id(self, user_id):
        pass
    
    # USER
    def get_user_by_username(self, user_name):
        """
        Get user given his/her username
        
        Params: user_name
        Returns: `user` object
        
        """
        return self._users.find_one({"username": user_name})
    def get_user_by_email(self, email):
        """
        Get `user` given his/her `email`
        
        Params: `user_email`
        Returns: `user` object
        
        """
        return self._users.find_one({"email": email})
    def get_user_by_id(self, user_id):
        """
        Get `user` given his/her `id`
        
        Params: `user_id`
        Returns: `user` object
        
        """
        return self._users.find_one({"_id": user_id})
    
    # PASSWORD
    def get_password_by_user_id(self, user_id):
        """
        Get `password` given his/her `id`
        
        Params: `user_id`
        Returns: `password`
        
        """
        return self._users.find_one({"_id": user_id})['password']
    def check_user_password(self, user_id, password):
        """
        Check if `password` is correct given his/her `id`
        
        Params: `user_id` and `password`
        Returns: `boolean`
        
        """
        u = self._users.find_one({"_id": user_id})
        if u is not None:
            return bcrypt.checkpw(password.encode('utf8'), u['password']) or False
        else:
            return False
    
    def get_fullname__id(self, user_id):
        return self._users.find_one({"_id": user_id})['full_name']

    def insert_user(self, user_name, user_email, user_password):
        import datetime
        import random
        user = {
            "_id": "{}--{}".format(
                user_name.replace(" ", "-").lower(),
                random.randint(10000, 100000000)),
            # "full_name": user_fname,
            "username": user_name,
            "email": user_email,
            "role": "developer",
            "password": bcrypt.hashpw(user_password.encode('utf8'), bcrypt.gensalt()),
            "creation_date": datetime.datetime.utcnow()
        }
        self._users.insert_one(user)
        pass
    
    def update_user(self,):
        pass
    def delete_user(self,):
        pass

    def get_user_list(self):
        return self._users.find()
    def get_user__role(self, user_role):
        return self._users.find({"role": user_role})
    def get__count__role(self, user_role):
        return self._users.find({"role": user_role}).count()
