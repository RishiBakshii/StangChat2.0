import jwt
import os
import bcrypt
from werkzeug.utils import secure_filename
from flask import current_app
from bson.json_util import dumps
from bson import ObjectId
import datetime
from utils.validation import is_existing_userid

def generate_jwt_token(payload,expire_days=30):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(days=expire_days)
    payload['exp'] = expiration
    return jwt.encode(payload,os.environ.get('SECRET_KEY'),algorithm='HS256')

def decode_jwt_token(authToken):
    return jwt.decode(authToken, os.environ.get('SECRET_KEY'), algorithms=['HS256'])

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
    
def handle_follow(mongo,target_user_id,userid):
    mongo.db.users.update_one({"_id": ObjectId(target_user_id)},{"$push": {"followers": userid},"$inc": {"followerCount": 1}})
    mongo.db.users.update_one({"_id": ObjectId(userid)},{"$push": {"following": target_user_id},"$inc": {"followingCount": 1}})

    target_user=is_existing_userid(mongo,target_user_id)

    return {
        "updatedFollowingCount": target_user['followingCount'],
        "updatedFollowerCount": target_user['followerCount'],
        "isFollowing": True
    }

def handle_unfollow(mongo,target_user_id,userid):
    mongo.db.users.update_one({"_id": ObjectId(target_user_id)},{"$pull": {"followers": userid},"$inc": {"followerCount": -1}})
    mongo.db.users.update_one({"_id": ObjectId(userid)},{"$pull": {"following": target_user_id},"$inc": {"followingCount": -1}})

    target_user=is_existing_userid(mongo,target_user_id)

    return {
        "updatedFollowingCount": target_user['followingCount'],
        "updatedFollowerCount": target_user['followerCount'],
        "isFollowing": False
    }

def upload_post(user_post,target_folder):
    secureFilename=secure_filename(user_post.filename)
    user_post_path=os.path.join(target_folder,secureFilename).replace("\\","/")
    user_post.save(user_post_path)
    return user_post_path

def delete_post_and_related_comments(mongo,postid):
    mongo.db.post.delete_one({"_id": ObjectId(postid)})
    mongo.db.comments.delete_many({"post_id":postid})
    return True