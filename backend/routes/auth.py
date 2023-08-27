from flask import Blueprint, request, make_response, jsonify
import jwt
import os
import bcrypt
from bson.json_util import dumps
from utils.common import generate_jwt_token,format_user_data,hash_password
from schema.user import user_schema
from utils.validation import is_valid_email,is_valid_username
auth = Blueprint('auth', __name__)


@auth.route("/login", methods=['POST'])
def login():
    """
    Handle user login via POST request.

    This function handles the process of user authentication and generating a JWT token upon successful login.
    
    Args:
        None
    
    Returns:
        Flask Response: A JSON response indicating the outcome of the login attempt.
            - If login is successful, returns a success message along with a JWT token and user data.
            - If login fails due to invalid credentials, returns an error message with status code 400.
            - If an exception occurs, returns an error message with status code 500.
    """
    if request.method=='POST':
        try:
            data=request.json
            mongo=auth.mongo
            email=data.get("email")
            password=data.get("password")

            user=mongo.db.users.find_one({'email':email})

            if user and bcrypt.checkpw(password.encode("utf-8"),user['password']):
                payload={'user_id':str(user['_id']),'email':str(user['email'])}
                token=generate_jwt_token(payload)

                return jsonify({"message":"Login Successful","authToken":token,'userdata':format_user_data(user)}),200
            else:
                return jsonify({'message':"Invalid username or password"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500

@auth.route("/signup",methods=['POST'])
def signup():
    """
    Handle user signup via POST request.

    This function handles the process of user registration.

    Args:
        None

    Returns:
        Flask Response: A JSON response indicating the outcome of the signup attempt.
            - If signup is successful, returns a success message along with the new user's ID.
            - If the email is already taken, returns an error message with status code 400.
            - If the username is already taken, returns an error message with status code 400.
            - If an exception occurs, returns an error message with status code 500.
    """
    if request.method == 'POST':
        try:
            data=request.json
            mongo=auth.mongo
            username=data.get("username")
            email=data.get("email")
            password=data.get("password")
            location=data.get("location")

            if not is_valid_email(mongo,email):
                return jsonify({'message': 'Email is already taken😭'}),400
            
            if not is_valid_username(mongo,username):
                 return jsonify({'message': 'Username is already taken😭'}),400

            hashed_password=hash_password(password)

            new_user=user_schema.copy()
            new_user.update({
                'username': username,
                'email': email,
                'password': hashed_password,
                'location': location
            })
            created_user=mongo.db.users.insert_one(new_user)

            return jsonify({"message":f"Welcome on Board {username}🎉",'userid':str(created_user.inserted_id)}),201

        except Exception as e:
            print(e)
            return jsonify({"message":str(e)}),500

@auth.route("/decode_token",methods=['POST'])
def decode_token():
    print(f'{"*"*100}')
    if request.method=='POST':
        try:
            data=request.json
            token=data.get("authToken")
            decoded_token=jwt.decode(token,os.environ.get('SECRET_KEY'),algorithms='HS256')
            return jsonify({"message":"token decoded","decoded_token":decoded_token}),200
        except Exception as e:
            return jsonify({"message":str(e)}),400
