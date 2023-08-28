from bson import ObjectId
import bcrypt



def is_valid_password(user,password):
    return bcrypt.checkpw(password.encode("utf-8"),user['password'])

def is_existing_email(mongo,email):
    USER=mongo.db.users.find_one({"email":email})
    if USER:
        return USER
    return False

def is_valid_username(mongo,username):
    if mongo.db.users.find_one({'username': username}):
        return False
    return True

def is_valid_userid(mongo,userid):
    user=mongo.db.users.find_one({'_id':ObjectId(userid)})
    if user:
        return user
    else:
        return None