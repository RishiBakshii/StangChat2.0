from bson import ObjectId

def is_valid_email(mongo,email):
    if mongo.db.users.find_one({'email': email}):
        return False
    return True

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