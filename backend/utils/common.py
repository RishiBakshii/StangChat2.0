import jwt
import os
import bcrypt
from werkzeug.utils import secure_filename
from flask import current_app
from bson.json_util import dumps
from bson import ObjectId

def generate_jwt_token(payload):
    return jwt.encode(payload,os.environ.get('SECRET_KEY'),algorithm='HS256')

def format_user_data(user):
    return {
        'userid':str(user['_id']),
        'username':user['username'],
        'email':user['email'],
        'location':user['location'],
        'bio':user['bio'],
        'profilePicture':user['profilePicture'],
        'followers':[],
        'following':[],
        'post':[],
        'followerCount':user['followerCount'],
        'followingCount':user['followingCount'],
        'postCount':user['postCount']
    }

def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())

def upload_profile_picture(file,target_folder):
    if file!=None:
        secureFilename=secure_filename(file.filename)
        profile_picture_path=os.path.join(target_folder,secureFilename).replace("\\","/")
        file.save(profile_picture_path)
    else:
        profile_picture_path=os.path.join(target_folder,'defaultProfile.png').replace("\\","/")
    return profile_picture_path

def update_profile_data(mongo,userid,username,bio,profile_picture_path,location):
    try:
        mongo.db.users.update_one({"_id":ObjectId(userid)},
                                  {"$set": {"bio": bio,
                                            'profilePicture':profile_picture_path,
                                            'username':username,
                                            'location':location}})
        return True
    except Exception as e:
        print(e)
        return None