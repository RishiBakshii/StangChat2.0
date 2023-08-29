from flask import Blueprint,request,jsonify
from bson import ObjectId
from flask import Flask,jsonify,request
from bson.json_util import dumps
from utils.validation import is_existing_userid,is_existing_commentid
from utils.common import handle_comment_like

comments=Blueprint('comments',__name__)


@comments.route("/postcomment",methods=['POST'])
def postcomment():
    if request.method=='POST':
        try:
            data = request.json
            user_id = data.get('userid')
            post_id = data.get('postid')
            comment_content = data.get('comment')
            username=data.get('username')
            profilepath=data.get("profilepath")
            mongo=comments.mongo

            user = mongo.db.users.find_one({'_id': ObjectId(user_id)})

            if not user:
                return jsonify({'message': 'User not found'}), 400
            
            post = mongo.db.post.find_one({'_id': ObjectId(post_id)})
            if not post:
                return jsonify({'message': 'Post not found'}), 400

            new_comment = {
                'user_id': user_id,
                'post_id': post_id,
                'comment': comment_content,
                'username':username,
                'profilepath':profilepath,
                'likes':[],
                'likeCount':0
            }

            new_comment_id=mongo.db.comments.insert_one(new_comment).inserted_id
            new_comment_doc = mongo.db.comments.find_one({"_id": new_comment_id})
            return dumps(new_comment_doc), 200

            
        except Exception as e:
            return jsonify({"message":str(e)}),500

@comments.route('/getcomments',methods=['POST'])
def getComments():
    if request.method=='POST':
        try:
            mongo=comments.mongo
            data = request.json
            post_id = data.get('postid')

            fetchedComments = mongo.db.comments.find({'post_id': post_id})

            comment_list = list(fetchedComments)
            comment_list=dumps(comment_list)
            return comment_list, 200
        
        except Exception as e:
            print(e)
            return jsonify({'message': str(e)}), 500

@comments.route('/commentlike',methods=['POST'])
def commentLike():
    if request.method=='POST':
        try:
            data=request.json
            mongo=comments.mongo
            userid=data.get("userid")
            commentid=data.get("commentid")

            user=is_existing_userid(mongo,userid)
            if not user:
                return jsonify({'message':"user not found"}),400
            
            comment=is_existing_commentid(mongo,commentid)
            if not comment:
                return jsonify({"message":"comment not found"}),400
            

            response=handle_comment_like(mongo,userid,comment)

            return jsonify(response),200

        except Exception as e:
            return jsonify({"message":str(e)}),500
        
@comments.route("/deletecomment",methods=['POST'])
def deleteComment():
    if request.method=='POST':
        try:
            data = request.json
            mongo = comments.mongo
            userid = data.get("userid")
            postid = data.get("postid")
            commentid = data.get("commentid")

            user = mongo.db.users.find_one({"_id": ObjectId(userid)})
            if not user:
                return jsonify({"message": 'User does not exist'}), 400
            
            post = mongo.db.post.find_one({"_id": ObjectId(postid)})
            if not post:
                return jsonify({"message": "Post does not exist"}), 400
            
            comment = mongo.db.comments.find_one({"_id": ObjectId(commentid), "post_id": postid})
            if not comment:
                return jsonify({"message": "Comment does not exist or is not associated with the post"}), 400

            mongo.db.comments.delete_one({"_id": ObjectId(commentid)})
            mongo.db.post.update_one({"_id": ObjectId(postid)}, {"$inc": {"commentsCount": -1}})

            return jsonify({"message": "Comment deleted"}), 200

        except Exception as e:
            return jsonify({"message":str(e)}),500