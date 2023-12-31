from flask import Blueprint, request, make_response, jsonify
import jwt
import os
import bcrypt
from bson import ObjectId
from bson.json_util import dumps
from utils.common import generate_jwt_token,format_user_data,hash_password,decode_jwt_token
from schema.user import user_schema
from utils.validation import is_existing_email,is_existing_username,is_valid_password,is_existing_userid
from datetime import datetime
auth = Blueprint('auth', __name__)

# ✅
@auth.route("/login", methods=['POST'])
def login():
    if request.method=='POST':
        try:
            data=request.json
            mongo=auth.mongo
            email=data.get("email")
            password=data.get("password")

            user=is_existing_email(mongo,email)

            if user and is_valid_password(user,password):
                payload={'user_id':str(user['_id']),'email':str(user['email'])}
                token=generate_jwt_token(payload)
                response=make_response(jsonify({"message":"Login Successful",'data':format_user_data(user)}))
                response.set_cookie("authToken", token, samesite="None",secure=True,httponly=True)
                return response
            else:
                return jsonify({'message':"Invalid username or password"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@auth.route("/signup",methods=['POST'])
def signup():
    if request.method == 'POST':
        try:
            data=request.json
            mongo=auth.mongo
            username=data.get("username")
            email=data.get("email")
            password=data.get("password")
            location=data.get("location")

            if is_existing_email(mongo,email):
                return jsonify({'message': 'Email is already taken😭'}),400
            
            if is_existing_username(mongo,username):
                 return jsonify({'message': 'Username is already taken😭'}),400

            hashed_password=hash_password(password)

            new_user=user_schema.copy()
            new_user.update({
                'username': username,
                'email': email,
                'password': hashed_password,
                'location': location, 
                'createdAt':datetime.now().strftime("%B %d, %Y"),
                'exactTime':datetime.now(),
            })
            created_user=mongo.db.users.insert_one(new_user)

            return jsonify({'data':str(created_user.inserted_id)}),201

        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@auth.route("/storefcmtoken",methods=['POST'])
def storeFcmToken():
    if request.method=='POST':
        try:
            data=request.json
            mongo=auth.mongo

            userid=data.get("userid")
            fcmToken=data.get("fcmToken")

            print(f"received user id :::::::::::: {userid}")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":"user does not exist"}),404
            
            if user and fcmToken:
                mongo.db.users.update_one({"_id":ObjectId(user['_id'])},{'$set':{"fcmToken":fcmToken}})
                return jsonify({"message":"Now you will receive notifications from stangchat"}),200
        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@auth.route("/deletefcmtoken",methods=['POST'])
def deleteFcmToken():
    if request.method=='POST':
        try:
            data=request.json
            mongo=auth.mongo

            userid=data.get("userid")
            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({'message':"user does not exists"}),404
            
            mongo.db.users.update_one({'_id': user['_id']}, {'$set': {'fcmToken': ''}})
            return jsonify({'message':"You will not receive any notifications"}),200

        except Exception as e:
            return jsonify({'message':str(e)}),500
# ✅
@auth.route("/decode_token",methods=['POST'])
def decode_token():
    if request.method=='POST':
        try:
            authToken=request.cookies.get("authToken")
            decoded_token=decode_jwt_token(authToken)
            return jsonify({"decoded_token":decoded_token}),200
        
        except jwt.exceptions.DecodeError as error:
            return jsonify({"message":str(error)}),401

        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@auth.route("/logout", methods=['POST'])
def logout():
    if request.method=='POST':
        try: 
            response = make_response(jsonify({"message": "Logout successful"}),200)
            response.delete_cookie("authToken",samesite="None", secure=True,httponly=True)
            return response
        except Exception as e:
            return jsonify({"message":str(e)}),500


    
