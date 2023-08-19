from flask import Blueprint,request,jsonify
import datetime
import bcrypt
import jwt
import os
from flask_pymongo import PyMongo

login=Blueprint('login',__name__)
mongo=PyMongo(login)

@login.route("/login",methods=['POST'])
def login():
    """
    Authenticate user credentials and generate an authentication token.

    This endpoint handles user login by validating the provided email and password.
    If the email is valid and the password matches the stored hash, an authentication
    token is generated using JWT (JSON Web Token).

    Args:
        request (Request): The incoming HTTP request containing user login data in JSON format.

    Returns:
        Response: A JSON response with an authentication token if login is successful.
                  If login fails, an error message is returned along with the appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the login process.

    Example:
        POST request with JSON body:
        {
            "email": "user@example.com",
            "password": "secretpassword"
        }

        Successful response:
        {
            "message": "Login Successful",
            "authToken": "your_generated_jwt_token"
        }

        Failed response:
        {
            "message": "Invalid username or password"
        }
    """
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
                return jsonify({"message":"Login Successful","authToken":f'{token}'}),200
            else:
                return jsonify({'message':"Invalid username or password"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500
