from bson import ObjectId
from flask import Blueprint,current_app
from flask import jsonify,request
from dotenv import load_dotenv
import os
from datetime import datetime
from bson import ObjectId
from werkzeug.utils import secure_filename
from bson.json_util import dumps
from utils.validation import is_existing_userid,is_existing_postid
from utils.common import upload_post,delete_post_and_related_comments,handle_like_post,handle_unlike_post
from schema.post import post_schema
from io import BytesIO
from botocore.exceptions import NoCredentialsError
import uuid
load_dotenv()
import json

posts=Blueprint('posts',__name__)
app=current_app

# ✅
@posts.route('/uploadpost',methods=['POST'])
def createPost():
    if request.method=='POST':
        try:
            mongo=posts.mongo
            data=request.json

            userid=data.get("userid")
            caption=data.get('caption')
            postpath=data.get("postPath")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":"user does not exist"}),404

            try:
                new_post=post_schema.copy()
                new_post.update({
                    "user_id":user["_id"],
                    "username":user['username'],
                    "caption":caption,
                    "postPath":postpath,
                    "profilePath":user['profilePicture'],
                    'postedAt':datetime.now().strftime("%B %d, %Y"),
                    'exactTime':datetime.now(),
                    })

                uploaded_post_id=mongo.db.post.insert_one(new_post).inserted_id

                mongo.db.users.update_one(
                {"_id": user['_id']},
                {"$inc": {"postCount": 1}})

                newly_uploaded_post=mongo.db.post.find_one({"_id":uploaded_post_id})

                return dumps(newly_uploaded_post),201
            
            except Exception as e:
                print(e)
                return jsonify({"message": str(e)}), 500

               
        except Exception as e:
            print(e)
            return jsonify({"message":str(e)}),500

# ✅
@posts.route("/getuserpost",methods=['POST'])
def getuserposts():
    if request.method=='POST':
        try:
            data=request.json
            mongo=posts.mongo
            userid=data.get("userid")
            user=is_existing_userid(mongo,userid)
            if user:
                user_posts=list(mongo.db.post.find({"user_id":ObjectId(userid)}))
                user_posts_dump=dumps(user_posts)
                return user_posts_dump,200
            if not user:
                return jsonify({"message":"user not found"}),404
        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@posts.route('/likepost',methods=['POST'])
def likepost():
    if request.method=='POST':
        try:
            mongo=posts.mongo
            data=request.json
            userid=data.get("userid")
            postid=data.get("postid")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message": "User not found"}), 400
            
            post=is_existing_postid(mongo,postid)
            if not post:
                return jsonify({"message": "Post not found"}), 400
            
            post_owner_document=is_existing_userid(mongo,post['user_id'])
            if not post_owner_document:
                return jsonify({"message":"Some error occured"}),400
            
            fcmToken=post_owner_document['fcmToken']
            username=user['username']

            
            if userid not in post["likes"]:
                updated_like_count=handle_like_post(mongo,userid,postid)
                return jsonify({"message": True,'updated_like_count':updated_like_count,'likeRequest':True,'fcmToken':fcmToken,'username':username}), 200
            else:
                updated_like_count=handle_unlike_post(mongo,userid,postid)
                return jsonify({"message": False,'updated_like_count':updated_like_count}), 200

        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@posts.route("/getfeed",methods=['POST'])
def getfeed():
    if request.method=='POST':
        try:
            data=request.json
            mongo=posts.mongo
            page=data.get('page')
            userid = data.get('userid')

            per_page = 5
            skip = (page - 1) * per_page

            user=is_existing_userid(mongo,userid)

            if not user:
                return jsonify({"message":'user does not exists'}),404
            
            # fetching the user post
            user_posts = mongo.db.post.find({'user_id': ObjectId(user['_id'])})

            # user following posts
            following_posts = mongo.db.post.find({'user_id': {'$in': [ObjectId(id) for id in user['following']]}})

            # combining all the posts
            all_posts = list(following_posts)+list(user_posts)
            sorted_posts = sorted(all_posts, key=lambda x: x['exactTime'], reverse=True)


            paginated_posts = sorted_posts[skip:skip + per_page]

            feed_json = dumps(paginated_posts)
            return feed_json,200

        
        except Exception as e:
            return jsonify({'message':str(e)}),500

# ✅
@posts.route("/getpostlikes",methods=['POST'])
def getPostLikes():
    if request.method=='POST':
        try:
            likes_data=[]
            data=request.json
            postid=data.get("postid")
            mongo=posts.mongo
            post=mongo.db.post.find_one({"_id":ObjectId(postid)})
            if not post:
                return jsonify({"message":"post does not exists"}),400
            

            for user_ids in post['likes']:
                data=mongo.db.users.find_one({"_id":ObjectId(user_ids)})
                if data:
                    likes_data.append({"username":data['username'],'profilePicture':data['profilePicture'],"bio":data['bio']})
            return dumps(likes_data),200

        except Exception as e:
            return jsonify({"message":str(e)}),500

# ✅
@posts.route('/getlatestposts', methods=['GET'])
def get_latest_posts():
    try:
        mongo=posts.mongo
        latest_posts = mongo.db.post.find().sort('exactTime', -1).limit(10)
        return dumps(latest_posts),200
    except Exception as e:
        return jsonify({"message":str(e)}),500

# ✅
@posts.route("/getexplorefeed",methods=['GET'])
def fetch_explore_feed():
    try:
        mongo=posts.mongo
        all_post=mongo.db.post.find()
        return dumps(all_post),200
    except Exception as e:
        return jsonify({"message":str(e)}),500

# ✅
@posts.route("/deletepost",methods=['POST'])
def deletePost():
    if request.method=='POST':
        try:
            data=request.json
            mongo=posts.mongo
            
            s3_bucket_name=posts.s3_bucket_name
            s3=posts.s3

            userid=data.get("userid")
            postid=data.get("postid")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({"message":'user does not exist'}),400
            
            post=is_existing_postid(mongo,postid)
            if not post:
                return jsonify({"message":"post does not exist"}),400
            
            if post['user_id'] != ObjectId(userid):
                return jsonify({"message": "You do not have permission to delete this post"}),403
            
            post_path=post['postPath']

            if post_path:
                s3.delete_object(Bucket=s3_bucket_name, Key=post_path)

            delete_post_and_related_comments(mongo,postid)

            mongo.db.users.update_one(
                {"_id": ObjectId(userid)},
                {"$inc": {"postCount": -1}}
            )
            
            return jsonify({'deletedPostId':postid}),200

        except Exception as e:
            return jsonify({'message':str(e)}),500