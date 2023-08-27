from bson import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
from werkzeug.utils import secure_filename
import os
from bson.json_util import dumps
from utils.common import upload_profile_picture,update_profile_data
from utils.validation import is_valid_userid

users=Blueprint('users',__name__)

@users.route('/get_user_info',methods=['POST'])
def get_user_info():
    if request.method=='POST':
        try:
            mongo=users.mongo
            data=request.json
            userID=data.get('userID')
            user_data=mongo.db.users.find_one({"_id":ObjectId(userID)})

            formatted_user_data={
                'userid':str(user_data['_id']),
                'username':user_data['username'],
                'email':user_data['email'],
                'location':user_data['location'],
                'bio':user_data['bio'],
                'linkedinProfile':"",
                'profilePicture':user_data['profilePicture'],
                'followers':[],
                'following':[],
                'post':[],
            }

            if user_data:
                return jsonify({"data":formatted_user_data}),200
            else:
                return make_response(jsonify({"message":"user not found"}),400)

        except Exception as e:
            return make_response(jsonify({'message':str(e)}),500)

@users.route("/profile/<username>",methods=['POST'])
def fetch_user_profile(username):
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            user=mongo.db.users.find_one({'username':username})
            logged_in_user_id=data.get("userid")
            

            if user:
                is_following = logged_in_user_id in user['followers']
                user['isFollowing']=is_following
                print(dumps(user))
                return dumps(user),200
                
            return jsonify({"message":"user not found"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500
            

@users.route('/updateprofile',methods=['POST'])
def updateProfile():
    """
    Handle user profile update via POST request.

    This function handles the process of updating a user's profile information.

    Args:
        None

    Returns:
        Flask Response: A JSON response indicating the outcome of the profile update attempt.
            - If the user does not exist, returns a 404 status with an error message.
            - If the profile update is successful, returns a 200 status with a success message.
            - If an exception occurs, returns a 500 status with an error message.
    """
    if request.method=='POST':
        try:
            mongo=users.mongo
            userid = request.form.get('userid')
            bio = request.form.get('bio')
            profile_picture = request.files.get("profilepicture")
            location=request.form.get("location")
            username=request.form.get("username")

            user=is_valid_userid(mongo,userid)

            if not user:
                return jsonify({'message':"User Does Not Exist"}),404

            profile_picture_path=upload_profile_picture(profile_picture,current_app.config['PROFILE_FOLDER'])

            if update_profile_data(mongo,userid,username,bio,profile_picture_path,location):
                return jsonify({'message':"Profile Updated"}),200
        except Exception as e:
            return jsonify({"message":str(e)}),500

@users.route("/followunfollow",methods=['POST'])
def handleFollowUnfollow():
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo

            userid=data.get('userid')
            target_user_id=data.get("target_user_id")
            isFollowing=False

            user=mongo.db.users.find_one({"_id":ObjectId(userid)})

            if not user:
                return jsonify({"message":"user does not exist"}),400
            
            target_user=mongo.db.users.find_one({"_id":ObjectId(target_user_id)})

            if not target_user:
                return jsonify({"message":"target user does not exist"}),400
            
            if user['_id'] in target_user['followers']: #unfollow

                mongo.db.users.update_one({"_id": ObjectId(target_user_id)},{"$pull": {"followers": user['_id']},"$inc": {"followerCount": -1}})
                mongo.db.users.update_one({"_id": ObjectId(userid)},{"$pull": {"following": target_user['_id']},"$inc": {"followingCount": -1}})
                isFollowing=True
            if user['_id'] not in target_user['followers']: #follow

                mongo.db.users.update_one({"_id": ObjectId(target_user_id)},
                                          {"$push": {"followers": user['_id']},
                                           "$inc": {"followerCount": 1}}
                                           
                                           )
                mongo.db.users.update_one({"_id": ObjectId(userid)},{"$push": {"following": target_user['_id']},"$inc": {"followingCount": 1}})
                isFollowing=False

            return jsonify({"updatedFollowingCount":target_user['followingCount'],"updatedFollowerCount":target_user['followerCount'],'isFollowing':isFollowing}),200
            


        except Exception as e:
            return jsonify({"message":str(e)}),500
