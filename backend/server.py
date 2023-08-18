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
from pathlib import Path
load_dotenv()



app=Flask(__name__)
app.config['MONGO_URI']=os.environ.get('DATABASE_URI')
UPLOAD_FOLDER=os.path.join('static','uploads')
POST_FOLDER='post'
PROFILE_FOLDER='profile'
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
app.config['POST_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],POST_FOLDER)
app.config['PROFILE_FOLDER']=os.path.join(app.config['UPLOAD_FOLDER'],PROFILE_FOLDER)

profile_photos=os.path.join(app.config['UPLOAD_FOLDER'],'profile')
post_photos = os.path.join(app.config['UPLOAD_FOLDER'], 'postphotos')


mongo=PyMongo(app)
CORS(app)


@app.route("/",methods=['GET'])
def home():
    return jsonify({"success":"true"})


@app.route("/login",methods=['POST'])
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
                return make_response(jsonify({"message":"Login Successful","authToken":f'{token}'}),200)
            else:
                return make_response(jsonify({'message':"Invalid username or password"}),400)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@app.route("/signup",methods=['POST'])
def signup():
    """
    Register a new user and create an account.

    This endpoint handles user registration by checking if the provided email is already
    associated with an existing account. If the email is available, a new user account
    is created with the provided information. The password is securely hashed before being stored.

    Args:
        request (Request): The incoming HTTP request containing user registration data in JSON format.

    Returns:
        Response: A JSON response welcoming the user and providing a user ID upon successful registration.
                  If the provided email is already taken, an error message is returned along with the appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the registration process.

    Example:
        POST request with JSON body:
        {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "secretpassword",
            "location": "Somewhere"
        }

        Successful response:
        {
            "message": "Welcome on board newuser🎉",
            "userid": "your_generated_user_id"
        }

        Failed response:
        {
            "message": "oops!😞 looks like Email is taken"
        }
    """
    if request.method == 'POST':
        try:
            data=request.json
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
                'post':[],
            }
            created_user=mongo.db.users.insert_one(new_user)

            return make_response(jsonify({"message":f"Welcome on Board {data.get('username')}🎉",'userid':str(created_user.inserted_id)}),200)

        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@app.route("/decode_token",methods=['POST'])
def decode_token():
    """
    Decode and verify the authenticity of an authentication token.

    This endpoint receives an authentication token provided by the client and attempts to decode
    and verify the token's authenticity using the provided secret key. If the token is successfully
    decoded, its content (payload) is returned to the client, providing information about the user's identity.

    Args:
        request (Request): The incoming HTTP request containing the authentication token in JSON format.

    Returns:
        Response: A JSON response containing the decoded token's content if successful.
                  If an error occurs during token decoding, an error message is returned with the appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the token decoding process.

    Example:
        POST request with JSON body:
        {
            "authToken": "your_authentication_token"
        }

        Successful response:
        {
            "message": "token decoded",
            "decoded_token": {
                "user_id": "your_user_id",
                "email": "user@example.com",
                "exp": "expiration_timestamp"
            }
        }

        Failed response:
        {
            "message": "token decoding error message"
        }
    """
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
    """
    Retrieve user information based on the provided user ID.

    This endpoint receives a POST request containing the user ID as JSON data. It fetches detailed user information,
    including the username, email, bio, and profile picture, associated with the provided user ID from the database.
    The retrieved user data is then returned as a JSON response.

    Args:
        request (Request): The incoming HTTP request containing the user ID in JSON format.

    Returns:
        Response: A JSON response containing the fetched user information if successful.
                  If the provided user ID is not found in the database, an error message is returned with the appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the user information retrieval process.

    Examples:
        Sample POST request body:
        {
            "userID": "user_id_to_fetch"
        }

        Successful response:
        {
            "message": "user fetched successfully",
            "data": {
                "username": "user123",
                "email": "user@example.com",
                "bio": "User's bio",
                "profilePicture": "profile_picture_url"
            }
        }

        Failed response:
        {
            "message": "user not found"
        }
    """
    if request.method=='POST':
        try:
            data=request.json
            userID=data.get('userID')
            user_data=mongo.db.users.find_one({"_id":ObjectId(userID)})

            if user_data:
                all_details={
                    "username":user_data['username'],
                    "email":user_data['email'],
                    'bio':user_data['bio'],
                    'profilePicture':user_data['profilePicture'],
                }
                return make_response(jsonify({'message':"user fetched succefully",'data':all_details}),200)
            else:
                return make_response(jsonify({"message":"user not found"}),400)

        except Exception as e:
            return make_response(jsonify({'message':str(e)}),500)

@app.route("/profile/<username>")
def profile(username):
    return f'profile page of {username}'

@app.route('/updateprofile',methods=['POST'])
def updateProfile():
    """
    Update user profile information including bio and profile picture.

    This endpoint handles a POST request containing the user ID, updated bio, and profile picture file.
    It first retrieves the user data using the provided user ID from the MongoDB database.
    If the user exists, the profile picture file is securely saved to the server's designated profile picture directory,
    and its file path is updated in the user's database record along with the updated bio.
    
    Args:
        request (Request): The incoming HTTP request containing user ID, bio, and profile picture as form data.

    Returns:
        Response: A JSON response indicating the success of the profile update or providing an error message.

    Raises:
        Exception: If an unexpected error occurs during the profile update process.

    Examples:
        Sample POST request using multipart/form-data:
        - Headers: Content-Type: multipart/form-data
        - Body: {
                    "userid": "user_id_to_update",
                    "bio": "Updated bio text",
                    "profilepicture": [file: profile_picture.jpg]
                }

        Successful response:
        {
            "message": "Profile Updated"
        }

        Failed response:
        {
            "message": "User Does Not Exist"
        }
    """
    if request.method=='POST':

        try:
            userid = request.form.get('userid')
            bio = request.form.get('bio')
            profile_picture = request.files.get("profilepicture")

            userData=mongo.db.users.find_one({'_id':ObjectId(userid)})

            if userData:
                if profile_picture:
                    secureFilename=secure_filename(profile_picture.filename)
                    profile_picture_path=os.path.join(app.config['PROFILE_FOLDER'],secureFilename).replace("\\","/")
                    profile_picture.save(profile_picture_path)
                else:
                    profile_picture_path=os.path.join(app.config['PROFILE_FOLDER'],'defaultProfile.png').replace("\\","/")
                mongo.db.users.update_one({"_id":ObjectId(userid)},{"$set": {"bio": bio,'profilePicture':profile_picture_path}})
                return make_response(jsonify({'message':"Profile Updated"}),200)
            
            return make_response(jsonify({'message':"User Does Not Exist"}),400)

        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

if __name__=='__main__':
    app.run(debug=True)