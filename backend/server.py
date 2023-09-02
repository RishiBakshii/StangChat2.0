from flask import Flask,jsonify,make_response,request
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from pathlib import Path
from bson.json_util import dumps
import jwt

from utils.common import decode_jwt_token
from utils.validation import is_existing_userid


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

profile_photos=os.path.join(app.config['UPLOAD_FOLDER'],'profile')
post_photos = os.path.join(app.config['UPLOAD_FOLDER'], 'postphotos')

mongo=PyMongo(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)



######
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


# CORS(app, resources={r"/*": {"origins": ["http://192.168.1.7:3000",'http://localhost:3000']}}, supports_credentials=True)
#############


# CORS(app, resources={r"/*": {"origins": '*'}}, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": ["*"]}}, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": ["http://192.168.1.3"]}}, supports_credentials=True)


@app.before_request
def check_token_and_user():
    if request.endpoint in ['auth.login', 'auth.signup', 'users.updateProfile']:
        return None

    try:
        authToken = request.cookies.get('authToken')
        mongo = auth.mongo

        if authToken:
            decoded_token = decode_jwt_token(authToken)
            user_id = decoded_token['user_id']
            user = is_existing_userid(mongo, user_id)
            if not user:
                raise InvalidUserError() 
            else:
                print("🚀🚀")

    except jwt.ExpiredSignatureError:
        raise ExpiredTokenError()

    except jwt.InvalidTokenError:
        raise InvalidTokenError()

    return None

class InvalidUserError(Exception):
    pass

class ExpiredTokenError(Exception):
    pass

class InvalidTokenError(Exception):
    pass

@app.errorhandler(InvalidUserError)
@app.errorhandler(ExpiredTokenError)
@app.errorhandler(InvalidTokenError)
def handle_auth_error(error):
    response = jsonify({'message': str(error)})
    response.status_code = 401  # Unauthorized status code
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
    # app.run(host="192.168.1.7",debug=True)
    app.run(debug=True)