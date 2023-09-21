from bson import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
from werkzeug.utils import secure_filename
import os
from bson.json_util import dumps
from utils.common import upload_profile_picture,update_profile_data,format_user_data,handle_follow,handle_unfollow
from utils.validation import is_existing_username,is_existing_userid,is_existing_email
from botocore.exceptions import NoCredentialsError
import uuid
from io import BytesIO

users=Blueprint('users',__name__)

# ✅
@users.route('/get_user_info',methods=['POST'])
def get_user_info():
    if request.method=='POST':
        try:
            mongo=users.mongo
            data=request.json
            userID=data.get('userID')
            user_data=is_existing_userid(mongo,userID)

            if user_data:
                return jsonify({"data":format_user_data(user_data)}),200
            else:
                return jsonify({"message":"User Not Found"}),404

        except Exception as e:
            return jsonify({'message':str(e)}),500

# ✅
@users.route("/profile/<username>",methods=['POST'])
def fetch_user_profile(username):
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            logged_in_user_id=data.get('userid')
            user=is_existing_username(mongo,username)
    
            if user:
                is_following = logged_in_user_id in user['followers']
                user['isFollowing']=is_following
                return dumps(user),200
                
            return jsonify({"message":"user not found"}),404
        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@users.route('/updateprofile',methods=['POST'])
def updateProfile():
    if request.method=='POST':
        try:
            mongo=users.mongo
            data=request.json

            userid = data.get('userid')
            bio = data.get('bio')
            profilePath=data.get('profilePath')

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({'message':"User Does Not Exist"}),404
            
            mongo.db.users.update_one({"_id":ObjectId(userid)},{"$set": {"bio": bio,'profilePicture':profilePath}})
            return jsonify({'message':"Profile Updated"}),200

        except Exception as e:
            return jsonify({"message": str(e)}), 500
                
            # mongo.db.users.update_one({"_id":ObjectId(userid)},{"$set": {"bio": bio,'profilePicture':'default-profile-picture/defaultProfile.png'}})
            # return jsonify({'message':"Profile Updated"}),200

# ✅
@users.route("/followunfollow",methods=['POST'])
def handleFollowUnfollow():
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            userid=data.get('userid')
            target_user_id=data.get("target_user_id")

            user=is_existing_userid(mongo,userid)

            if not user:
                return jsonify({"message":"user does not exist"}),404
            
            target_user=is_existing_userid(mongo,target_user_id)

            if not target_user:
                return jsonify({"message":"User Profile Does not Exist"}),404
            
            if userid in target_user['followers']:
                updated_state=handle_unfollow(mongo,target_user_id,userid)

            if userid not in target_user['followers']:
                updated_state=handle_follow(mongo,target_user_id,userid)
            
            return jsonify(updated_state),200
            
        
        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@users.route("/getfollowers",methods=['POST'])
def getFollowers():
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            userid=data.get("userid")
            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":"user not found"}),404
            
            follower_ids=user['followers']
            followers_data=[]

            for follower_id in follower_ids:
                follower = is_existing_userid(mongo,follower_id)
                if follower:
                    followers_data.append({
                        "username": follower["username"],
                        "profile_picture": follower["profilePicture"],
                        "location": follower["location"],
                    })
            return jsonify(followers_data), 200

        except Exception as e:
            print(e)
            return jsonify({"message":str(e)}),500

# ✅
@users.route("/getfollowing", methods=['POST'])
def getFollowing():
    if request.method == 'POST':
        try:
            data = request.json
            mongo = users.mongo
            userid = data.get("userid")
            user = is_existing_userid(mongo, userid)
            
            if not user:
                return jsonify({"message": "user not found"}), 404
            
            following_ids = user['following']
            following_data = []
            
            for following_id in following_ids:
                following_user = is_existing_userid(mongo, following_id)
                if following_user:
                    following_data.append({
                        "username": following_user["username"],
                        "profile_picture": following_user["profilePicture"],
                        "location": following_user["location"],
                    })
            
            return jsonify(following_data), 200
        
        except Exception as e:
            print(e)
            return jsonify({"message": str(e)}), 500

# ✅
@users.route("/searchuser", methods=['POST'])
def usersearch():
    try:
        data = request.json
        mongo=users.mongo
        user_id = data.get('userid')
        search_query = data.get('query')

        user_exists = is_existing_userid(mongo,user_id)
        if not user_exists:
            return jsonify({"message": "User not found"}), 404

        if user_exists:
            regex_pattern = f'.*{search_query}.*'
            regex_query = {"username": {"$regex": regex_pattern, "$options": "i"}}

            search_results = mongo.db.users.find(regex_query)
            search_results_list = list(search_results)
            return dumps(search_results_list), 200


    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500

# ✅
@users.route('/randomusers', methods=['POST'])
def get_random_users():
    try:
        data=request.json
        mongo=users.mongo
        userid=data.get("userid")
        random_users =  mongo.db.users.aggregate([
            {"$match": {"_id": {"$ne": ObjectId(userid)}}},
            {"$sample": {"size": 10}}
        ])
        formatted_users = [{"id": str(user["_id"]),"username": user["username"],"profilePicture": user["profilePicture"],'location':user['location'],"bio":user['bio']}
            for user in random_users
        ]

        return jsonify(formatted_users),200
    except Exception as e:
        return jsonify({"message":str(e)}),500

# ✅
@users.route("/editprofile",methods=['POST'])
def edit_profile():
    try:
        mongo=users.mongo
        userid=request.form.get("userid")

        username=request.form.get("username")
        email=request.form.get("email")
        bio=request.form.get("bio")
        location=request.form.get("location")
        profilePicture=request.form.get("profilePath")
        print(f"profile picture data from frontend : {profilePicture}")

        updated_feilds={}
        
        user=is_existing_userid(mongo,userid)
        if not user:
            return jsonify({"message":"user does not exists"}),400
        
        if username is not None:
            if is_existing_username(mongo, username):
                return jsonify({"message": "username is already taken🤭"}), 400
            updated_feilds['username'] = username

        if email is not None:
            if is_existing_email(mongo, email):
                return jsonify({"message": "email is already taken"}), 400
            updated_feilds['email'] = email
        
        
        if bio is not None:
            updated_feilds['bio']=bio

        if location is not None:
            updated_feilds['location'] = location
        
        if profilePicture is not None:
            prev_profile_picture_key = user["profilePicture"]

            if prev_profile_picture_key is not current_app.config['DEFAULT_PROFILE_PICTURE']:

                print(f'prev profile picture : {prev_profile_picture_key}\ndefault profile pictue : {current_app.config["DEFAULT_PROFILE_PICTURE"]}')
                print(f'matches? : {prev_profile_picture_key==current_app.config["DEFAULT_PROFILE_PICTURE"]}')
                updated_feilds['profilePicture']=profilePicture
                            
        if updated_feilds:
            mongo.db.users.update_one({"_id":ObjectId(userid)},{'$set':updated_feilds})

        updated_user=is_existing_userid(mongo,userid)
        return format_user_data(updated_user),200

    except Exception as e:
        return jsonify({"message":str(e)}),500

# ✅
@users.route("/getfriends",methods=['POST'])
def get_friends():
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            userid=data.get("userid")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":'user does not exists'}),404
            
            following = user['following']
            followers = user['followers']

            common_friends_ids = list(set(following) & set(followers))

            common_friends_data = []

            for friend_id in common_friends_ids:
                friend = is_existing_userid(mongo,friend_id)
                if friend:
                    common_friends_data.append({
                        'userid':str(friend["_id"]),
                        "username": friend["username"],
                        "profilePicture": friend["profilePicture"],
                        'location':friend['location']
                    })

            return jsonify(common_friends_data),200


        except Exception as e:
            return jsonify({"message":str(e)}),500