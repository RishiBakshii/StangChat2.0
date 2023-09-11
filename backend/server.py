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

import boto3


load_dotenv()

app=Flask(__name__)
app.config['SECRET_KEY']='secret!'

# CORS AND SOCKET
# CORS(app,resources={r"/*":{"origins":"http://localhost:3000"}},supports_credentials=True)
socketio=SocketIO(app,cors_allowed_origins='http://localhost:3000')

# S3 BUCKET CONFIG
S3_BUCKET_NAME=os.environ.get("S3_BUCKET_NAME")
s3 = boto3.client('s3', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"), aws_secret_access_key=os.environ.get("AWS_SECRET_KEY"), region_name=os.environ.get("AWS_REGION"))

app.config['MONGO_URI']=os.environ.get('DATABASE_URI')
app.config['DEFAULT_PROFILE_PICTURE']='default-profile-picture/defaultProfile.png'

mongo=PyMongo(app)

# CROSS -ORIGIN REQUESTS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": "http://192.168.1.3:3000"}}, supports_credentials=True)


# MIDDLEWARE
@app.before_request
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


connected_users={}

@socketio.on('connect')
def handle_connect():
    print("✅✅✅✅✅")

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on("join-room")
def handle_join_room(data):
    username=data['username']
    connected_users[username]=request.sid
    # emit("data",f'{username} has joined',broadcast=True)

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
app.register_blueprint(auth)
app.register_blueprint(posts)
app.register_blueprint(users)
app.register_blueprint(comments)

@app.route("/")
def default():
    return jsonify({"running":True}),200

if __name__=='__main__':
    # app.run(host="192.168.1.3",debug=True)
    # app.run(debug=True)
    socketio.run(app,debug=True,port=5000)