from flask import Blueprint,request,jsonify
from bson import ObjectId
from flask import Flask,jsonify,request
from bson.json_util import dumps

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
                'username':username
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
