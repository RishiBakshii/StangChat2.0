from bson import ObjectId
from flask import Blueprint,current_app
from flask import Flask,jsonify,request
from dotenv import load_dotenv
import os
from datetime import datetime
from bson import ObjectId
from werkzeug.utils import secure_filename
from bson.json_util import dumps
load_dotenv()

posts=Blueprint('posts',__name__)
app=current_app

@posts.route('/uploadpost',methods=['POST'])
def uploadPost():
    if request.method=='POST':
        try:
            mongo=posts.mongo
            userid=request.form.get("userid")
            user=mongo.db.users.find_one({'_id':ObjectId(userid)})
            if user:
                user_post=request.files.get("post")
                secureFilename=secure_filename(user_post.filename)
                user_post_path=os.path.join(app.config['POST_FOLDER'],secureFilename).replace("\\","/")
                user_post.save(user_post_path)
                new_post={
                    "user_id":user["_id"],
                    "username":user['username'],
                    "caption":request.form.get('caption'),
                    "postPath":user_post_path,
                    "profilePath":user['profilePicture'],
                    'likesCount':0,
                    'likes':[],
                    'postedAt':datetime.now().strftime("%B %d, %Y"),
                    'exactTime':datetime.now()
                    }
                uploaded_post_id=posts.mongo.db.post.insert_one(new_post).inserted_id
                newly_uploaded_post=posts.mongo.db.post.find_one({"_id":uploaded_post_id})
                return dumps(newly_uploaded_post),200
                
                
            return jsonify({"message":"user does not exist"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500

@posts.route("/getuserpost",methods=['POST'])
def getuserposts():
    if request.method=='POST':
        try:
            data=request.json
            mongo=posts.mongo
            userid=data.get("userid")
            user=mongo.db.users.find_one({"_id":ObjectId(userid)})
            if user:
                user_posts=list(mongo.db.post.find({"user_id":ObjectId(userid)}))
                user_posts_dump=dumps(user_posts)
                print(user_posts_dump)
                return user_posts_dump,200
            if not user:
                return jsonify({"message":"user not found"}),400
        except Exception as e:
            return jsonify({"message":str(e)}),500

@posts.route('/likepost',methods=['POST'])
def likepost():
    if request.method=='POST':
        try:
            mongo=posts.mongo
            data=request.json
            userid=data.get("userid")
            postid=data.get("postid")
            
            user=mongo.db.users.find_one({"_id":ObjectId(userid)})
            if not user:
                return jsonify({"message": "User not found"}), 400
            
            post=mongo.db.post.find_one({"_id":ObjectId(postid)})
            if not post:
                return jsonify({"message": "Post not found"}), 400
            
            if userid in post["likes"]:
                mongo.db.post.update_one(
        {"_id": ObjectId(postid)},
        {
            "$pull": {"likes": userid},
            "$inc": {"likesCount": -1}
        }
    )
                return jsonify({"message": 0}), 200
            else:
                mongo.db.post.update_one(
        {"_id": ObjectId(postid)},
        {
            "$addToSet": {"likes": userid},
            "$inc": {"likesCount": 1}
        }
    )
                return jsonify({"message": 1}), 200

        except Exception as e:
            return jsonify({"message":str(e)}),500

@posts.route("/getfeed",methods=['POST'])
def getfeed():
    if request.method=='POST':
        try:
            data=request.json
            mongo=posts.mongo
            page=data.get('page')
            per_page = 5
            skip = (page - 1) * per_page

            feed = mongo.db.post.find({}).skip(skip).limit(per_page)

            feed_list = list(feed)
            feed_json = dumps(feed_list)
            with open("test.json",'a') as f:
                f.write(f'{feed_json}\n\n')
            print(feed_json)
            return feed_json,200
        except Exception as e:
            return jsonify({'message':str(e)}),500
