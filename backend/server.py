from flask import Flask,jsonify,request,make_response
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
import jwt
from utils.common import decode_jwt_token
from utils.validation import is_existing_userid
from bson import ObjectId
import json

from routes.auth import auth
from routes.posts import posts
from routes.users import users
from routes.comments import comments


load_dotenv()

app=Flask(__name__)

app.config['MONGO_URI']=os.environ.get('DATABASE_URI')
UPLOAD_FOLDER=os.path.join('static','uploads')
POST_FOLDER='post'
PROFILE_FOLDER='profile'
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
app.config['POST_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],POST_FOLDER)
app.config['PROFILE_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],PROFILE_FOLDER)
app.config['DEFAULT_PROFILE_PICTURE']=os.path.join(app.config['PROFILE_FOLDER'],'defaultProfile.png')

profile_photos=os.path.join(app.config['UPLOAD_FOLDER'],'profile')
post_photos = os.path.join(app.config['UPLOAD_FOLDER'], 'postphotos')

mongo=PyMongo(app)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": "http://192.168.1.3:3000"}}, supports_credentials=True)



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



auth.mongo=mongo
posts.mongo=mongo
users.mongo=mongo
comments.mongo = mongo

app.register_blueprint(auth)
app.register_blueprint(posts)
app.register_blueprint(users)
app.register_blueprint(comments)

@app.route("/")
def default():
    return jsonify({"running":True}),200




if __name__=='__main__':
    # app.run(host="192.168.1.3",debug=True)
    app.run(debug=True)