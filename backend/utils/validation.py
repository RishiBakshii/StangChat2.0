from bson import ObjectId
import bcrypt



def is_valid_password(user,password):
    return bcrypt.checkpw(password.encode("utf-8"),user['password'])

def is_existing_email(mongo,email):
    USER=mongo.db.users.find_one({"email":email})
    if USER:
        return USER
    return False

def is_existing_username(mongo,username):
    USER=mongo.db.users.find_one({'username': username})
    if USER:
        return USER
    return False

def is_existing_userid(mongo,userid):
    USER=mongo.db.users.find_one({'_id':ObjectId(userid)})
    if USER:
        return USER
    return False
    
def is_existing_postid(mongo,postid):
    POST=mongo.db.post.find_one({"_id":ObjectId(postid)})
    if POST:
        return POST
    return False