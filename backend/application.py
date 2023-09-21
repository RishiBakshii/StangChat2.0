from flask import Flask,jsonify,request,make_response
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_socketio import SocketIO,emit
from dotenv import load_dotenv
import os
import jwt
from utils.common import decode_jwt_token
from utils.validation import is_existing_userid



from routes.auth import auth
from routes.posts import posts
from routes.users import users
from routes.comments import comments

import firebase_admin
from firebase_admin import credentials,messaging
from utils.firebaseconfig import fire_base_config_dict

cred = credentials.Certificate(fire_base_config_dict)
firebase_admin.initialize_app(cred)

import boto3


load_dotenv()

application=Flask(__name__)
application.config['SECRET_KEY']='secret!'


allowed_ip=['https://www.stangchat.com','https://stangchat.com','http://localhost:3000']

# CORS AND SOCKET
CORS(application, resources={r"/*": {"origins": allowed_ip}}, supports_credentials=True)
socketio=SocketIO(application,cors_allowed_origins=allowed_ip)

# S3 BUCKET CONFIG
S3_BUCKET_NAME=os.environ.get("S3_BUCKET_NAME")
s3 = boto3.client('s3', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"), aws_secret_access_key=os.environ.get("AWS_SECRET_KEY"), region_name=os.environ.get("AWS_REGIONS"))

application.config['MONGO_URI']=os.environ.get('DATABASE_URI')
application.config['DEFAULT_PROFILE_PICTURE']='default-profile-picture/defaultProfile.png'

mongo=PyMongo(application)

# MIDDLEWARE
@application.before_request
def check_token_and_user():
    if request.endpoint not in ['auth.login', 'auth.signup', 'users.updateProfile']:
        try:
            authToken = request.cookies.get('authToken')
            mongo = auth.mongo

            if authToken:
                decoded_token = decode_jwt_token(authToken)
                user_id = decoded_token['user_id']
                if is_existing_userid(mongo, user_id):
                    print("🚀🚀")
                else:
                    print("❌")
                    response= make_response(jsonify({"message":"Your session has expired please Login again to re-authenticate"}))
                    response.delete_cookie("authToken",samesite="None", secure=True,httponly=True),401
                    return response

        except jwt.ExpiredSignatureError:
            response=make_response(jsonify({"message":"Your token has expired..you need to login again to reauthenticate"}),401)
            response.delete_cookie("authToken",samesite="None", secure=True,httponly=True)
            return response

        except jwt.InvalidTokenError:
            response=make_response(jsonify({'message':'Your token is invalid!\nPLease login again'}),401)
            response.delete_cookie("authToken",samesite="None", secure=True,httponly=True)
            return response

@application.route("/send-notification",methods=['POST'])
def send_push_notification():
    if request.method=='POST':
        try:
            data=request.json

            token=data.get("fcmToken")
            title=data.get("title")
            body=data.get("body")

            message = messaging.Message(notification=messaging.Notification(title=title,body=body,image='https://stangchat-user-data.s3.ap-south-1.amazonaws.com/1.png'),token=token,)

            response = messaging.send(message)

            return jsonify({"message":"notification Sent"}),200
        
        except Exception as e:
            return jsonify({"message":str(e)}),500

connected_users={}

@socketio.on('connect')
def handle_connect():
    userid = request.sid
    connected_users[userid] = True
    print("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅")
    emit("user-count", {"count": len(connected_users)}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in connected_users:
        del connected_users[request.sid]
        emit("user-count", {"count": len(connected_users)}, broadcast=True)
        print("disconnectedddddd❌❌❌❌❌❌❌")

@socketio.on("join-room")
def handle_join_room(data):
    emit("data",data,broadcast=True)

@socketio.on("user-left")
def handle_leave_room(data):
    with open("test.txt",'w') as f:
        f.write(data)
    emit("data",data,broadcast=True)

@socketio.on('chat-message')
def handle_chat_message(data):
    emit("data",data,broadcast=True)



# BLUEPRINT VARIABLES
auth.mongo=mongo

posts.mongo=mongo
posts.s3=s3
posts.s3_bucket_name=S3_BUCKET_NAME

users.mongo=mongo
users.s3=s3
users.s3_bucket_name=S3_BUCKET_NAME


comments.mongo = mongo


# BLUEPRINT REGISTERED
application.register_blueprint(auth)
application.register_blueprint(posts)
application.register_blueprint(users)
application.register_blueprint(comments)

@application.route("/")
def default():
    return jsonify({"running":True}),200

if __name__=='__main__':
    socketio.run(application,port=5000,debug=True)