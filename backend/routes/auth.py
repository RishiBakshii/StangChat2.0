from flask import Blueprint, request, make_response, jsonify
import jwt
import os
import bcrypt
from bson.json_util import dumps

auth = Blueprint('auth', __name__)


@auth.route("/login", methods=['POST'])
def login():
    if request.method=='POST':
        try:
            data=request.json
            mongo=auth.mongo
            user=mongo.db.users.find_one({'email':data.get("email")})

            if user and bcrypt.checkpw(data.get("password").encode("utf-8"),user['password']):
                payload={
                    'user_id':str(user['_id']),
                    'email':str(user['email']),
                }
                token=jwt.encode(payload,os.environ.get('SECRET_KEY'),algorithm='HS256')


                formatted_user_data={
                'userid':str(user['_id']),
                'username':user['username'],
                'email':user['email'],
                'location':user['location'],
                'bio':user['bio'],
                'linkedinProfile':"",
                'profilePicture':user['profilePicture'],
                'followers':[],
                'following':[],
                'post':[],
            }
                return make_response(jsonify({"message":"Login Successful","authToken":f'{token}','userdata':formatted_user_data}),200)
            else:
                return make_response(jsonify({'message':"Invalid username or password"}),400)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@auth.route("/signup",methods=['POST'])
def signup():
    if request.method == 'POST':
        try:
            data=request.json
            mongo=auth.mongo
            existing_user = mongo.db.users.find_one({'email': data.get("email")})

            if existing_user:
                return jsonify({'message': 'Email is already taken😭'}),400

            hashed_password=bcrypt.hashpw(data.get("password").encode("utf-8"),bcrypt.gensalt())

            new_user={
                'username':data.get("username"),
                'email':data.get("email"),
                'password':hashed_password,
                'location':data.get('location'),
                'bio':"",
                'linkedinProfile':"",
                'profilePicture':"",
                'followers':[],
                'following':[],
                'postCount':0,
                'followerCount':0,
                'followingCount':0
            }
            created_user=mongo.db.users.insert_one(new_user)

            return make_response(jsonify({"message":f"Welcome on Board {data.get('username')}🎉",'userid':str(created_user.inserted_id)}),200)

        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@auth.route("/decode_token",methods=['POST'])
def decode_token():
    if request.method=='POST':
        try:
            data=request.json
            token=data.get("authToken")
            decoded_token=jwt.decode(token,os.environ.get('SECRET_KEY'),algorithms='HS256')
            return make_response(jsonify({"message":"token decoded","decoded_token":decoded_token}),200)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),400)
