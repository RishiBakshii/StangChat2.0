from bson import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
from werkzeug.utils import secure_filename
import os
from bson.json_util import dumps
from utils.common import upload_profile_picture,update_profile_data,format_user_data,handle_follow,handle_unfollow
from utils.validation import is_existing_username,is_existing_userid

users=Blueprint('users',__name__)

@users.route('/get_user_info',methods=['POST'])
def get_user_info():
    if request.method=='POST':
        try:
            mongo=users.mongo
            data=request.json
            userID=data.get('userID')
            user_data=mongo.db.users.find_one({"_id":ObjectId(userID)})


            if user_data:
                return jsonify({"data":format_user_data(user_data)}),200
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
            logged_in_user_id=data.get('userid')
            user=is_existing_username(mongo,username)
    
            if user:
                is_following = logged_in_user_id in user['followers']
                user['isFollowing']=is_following
                return dumps(user),200
                
            return jsonify({"message":"user not found"}),404
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

            user=is_existing_userid(mongo,userid)

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

            user=is_existing_userid(mongo,userid)

            if not user:
                return jsonify({"message":"user does not exist"}),400
            
            target_user=is_existing_userid(mongo,target_user_id)

            if not target_user:
                return jsonify({"message":"target user does not exist"}),400
            
            if userid in target_user['followers']:
                updated_state=handle_unfollow(mongo,target_user_id,userid)

            if userid not in target_user['followers']:
                updated_state=handle_follow(mongo,target_user_id,userid)
            
            print(updated_state)
            return jsonify(updated_state),200
            
        
        except Exception as e:
            return jsonify({"message":str(e)}),500
        
@users.route("/getfollowers",methods=['POST'])
def getFollowers():
    if request.method=='POST':
        try:
            data=request.json
            mongo=users.mongo
            userid=data.get("userid")
            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":"user not found"}),400
            
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
            return followers_data, 200

        except Exception as e:
            print(e)
            return jsonify({"message":str(e)}),500

@users.route("/getfollowing", methods=['POST'])
def getFollowing():
    if request.method == 'POST':
        try:
            data = request.json
            mongo = users.mongo
            userid = data.get("userid")
            user = is_existing_userid(mongo, userid)
            
            if not user:
                return jsonify({"message": "user not found"}), 400
            
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


# @users.route("/searchuser", methods=['POST'])
# def usersearch():
#     try:
#         data = request.json
#         user_id = data.get("userid")
#         search_query = data.get("searchquery")
       
#         search_results = []
#         for profile in user_profiles:
#             similarity_score = fuzz.partial_ratio(search_query, profile["username"])
#             if similarity_score > 50:  # Adjust the threshold as needed
#                 search_results.append(profile)

#         return jsonify(search_results), 200

#     except Exception as e:
#         print(e)
#         return jsonify({"message": str(e)}), 500

