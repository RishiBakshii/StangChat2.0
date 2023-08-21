from bson import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
from werkzeug.utils import secure_filename
import os

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

@users.route("/profile/<username>")
def profile(username):
    return f'profile page of {username}'

@users.route('/updateprofile',methods=['POST'])
def updateProfile():
    if request.method=='POST':

        try:
            mongo=users.mongo
            userid = request.form.get('userid')
            bio = request.form.get('bio')
            profile_picture = request.files.get("profilepicture")

            userData=mongo.db.users.find_one({'_id':ObjectId(userid)})

            if userData:
                if profile_picture:
                    secureFilename=secure_filename(profile_picture.filename)
                    profile_picture_path=os.path.join(current_app.config['PROFILE_FOLDER'],secureFilename).replace("\\","/")
                    profile_picture.save(profile_picture_path)
                else:
                    profile_picture_path=os.path.join(current_app.config['PROFILE_FOLDER'],'defaultProfile.png').replace("\\","/")
                mongo.db.users.update_one({"_id":ObjectId(userid)},{"$set": {"bio": bio,'profilePicture':profile_picture_path}})
                return make_response(jsonify({'message':"Profile Updated"}),200)
            
            return make_response(jsonify({'message':"User Does Not Exist"}),400)

        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
