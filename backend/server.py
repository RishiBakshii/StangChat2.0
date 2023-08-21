from flask import Flask,jsonify,make_response,request
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from pathlib import Path
from bson.json_util import dumps

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
CORS(app)


auth.mongo=mongo
posts.mongo=mongo
users.mongo=mongo
comments.mongo = mongo

app.register_blueprint(auth)
app.register_blueprint(posts)
app.register_blueprint(users)
app.register_blueprint(comments)


if __name__=='__main__':
    app.run(debug=True)