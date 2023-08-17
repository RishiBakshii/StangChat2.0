from flask import Flask,jsonify,make_response,request
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
import bcrypt
import jwt
import datetime
from bson import ObjectId
from werkzeug.utils import secure_filename
load_dotenv()



app=Flask(__name__)
app.config['MONGO_URI']=os.environ.get('DATABASE_URI')
UPLOAD_FOLDER='uploads'
POST_FOLDER='post'
PROFILE_FOLDER='profile'
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
app.config['POST_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],POST_FOLDER)
app.config['PROFILE_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],PROFILE_FOLDER)

profile_photos=os.path.join(app.config['UPLOAD_FOLDER'],'profile')
post_photos = os.path.join(app.config['UPLOAD_FOLDER'], 'postphotos')


mongo=PyMongo(app)
CORS(app)


@app.route("/",methods=['POST'])
def home():
    return jsonify({"success":"true"})


@app.route("/login",methods=['POST'])
def login():
    if request.method=='POST':
        try:
            data=request.json
            user=mongo.db.users.find_one({'email':data.get("email")})

            if user and bcrypt.checkpw(data.get("password").encode("utf-8"),user['password']):
                payload={
                    'user_id':str(user['_id']),
                    'email':str(user['email']),
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)

                }
                token=jwt.encode(payload,os.environ.get('SECRET_KEY'),algorithm='HS256')
                return make_response(jsonify({"message":"Login Successful","authToken":f'{token}'}),200)
            else:
                return make_response(jsonify({'message':"Invalid username or password"}),400)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@app.route("/signup",methods=['POST'])
def signup():
    if request.method == 'POST':
        try:
            data=request.json
            existing_user = mongo.db.users.find_one({'email': data.get("email")})

            if existing_user:
                return jsonify({'message': 'oops!😞 looks like Email is taken'}),400

            hashed_password=bcrypt.hashpw(data.get("password").encode("utf-8"),bcrypt.gensalt())

            new_user={
                'username':data.get("username"),
                'email':data.get("email"),
                'password':hashed_password,
                'location':data.get('location'),
                'bio':"",
                'linkedinProfile':"",
                'profilePicture':""
            }

            created_user=mongo.db.users.insert_one(new_user)

            return make_response(jsonify({"message":f"Welcome on board {data.get('username')}🎉",'userid':str(created_user.inserted_id)}),200)

        except Exception as e:
            return make_response(jsonify({"signup":str(e)}),400)

@app.route("/decode_token",methods=['POST'])
def decode_token():
    if request.method=='POST':
        try:
            data=request.json
            token=data.get("authToken")
            decoded_token=jwt.decode(token,os.environ.get('SECRET_KEY'),algorithms='HS256')
            return make_response(jsonify({"message":"token decoded","decoded_token":decoded_token}),200)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),400)

@app.route('/get_user_info',methods=['POST'])
def get_user_info():
    if request.method=='POST':
        try:
            data=request.json
            userID=data.get('userID')
            user_data=mongo.db.users.find_one({"_id":ObjectId(userID)})

            if user_data:
                all_details={
                    "username":user_data['username'],
                    "email":user_data['email']
                }
                return make_response(jsonify({'message':"user fetched succefully",'data':all_details}),200)
            else:
                return make_response(jsonify({"message":"user not found"}),400)

        except Exception as e:
            return make_response(jsonify({'message':str(e)}),400)

@app.route("/profile/<username>")
def profile(username):
    return f'profile page of {username}'

@app.route('/updateprofile',methods=['POST'])
def updateProfile():
    if request.method=='POST':

        try:
            userid = request.form.get('userid')
            bio = request.form.get('bio')
            profile_picture = request.files.get("profilepicture")

            userData=mongo.db.users.find_one({'_id':ObjectId(userid)})

            if userData:
                secureFilename=secure_filename(profile_picture.filename)
                profile_picture_path=os.path.join(app.config['PROFILE_FOLDER'],secureFilename)
                profile_picture.save(profile_picture_path)
                mongo.db.users.update_one({"_id":ObjectId(userid)},{"$set": {"bio": bio,'profilePicture':profile_picture_path}})
                return make_response(jsonify({'message':"profile updated"}),200)
            
            return make_response(jsonify({'message':f"user id is incorrect"}),400)

        except Exception as e:
            return make_response(jsonify({"message":str(e)}),400)

    return 'updaetd profile'

if __name__=='__main__':
    app.run(debug=True)