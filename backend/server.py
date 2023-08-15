from flask import Flask,jsonify,make_response,request
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

app=Flask(__name__)
app.config['MONGO_URI']=os.environ.get('DATABASE_URI')
mongo=PyMongo(app)
CORS(app)



@app.route("/",methods=['POST'])
def home():
    return jsonify({"success":"true"})

@app.route("/signup",methods=['POST'])
def signup():
    if request.method == 'POST':
        try:
            data=request.json
            existing_user = mongo.db.users.find_one({'email': data.get("email")})

            if existing_user:
                return jsonify({'message': 'oops!😞 looks like Email is taken'}),400

            hashed_password=bcrypt.hashpw(data.get("password").encode("utf-8"),bcrypt.gensalt())

            new_user={
                'username':data.get("username"),
                'email':data.get("email"),
                'password':hashed_password,
                'location':data.get('location'),
            }

            mongo.db.users.insert_one(new_user)

            return make_response(jsonify({"message":f"Welcome on board {data.get('username')}🎉"}),200)

        except Exception as e:
            return make_response(jsonify({"signup":str(e)}),400)

@app.route("/login",methods=['POST'])
def login():
    if request.method=='POST':
        try:
            data=request.json
            user=mongo.db.users.find_one({'email':data.get("email")})

            if user and bcrypt.checkpw(data.get("password").encode("utf-8"),user['password']):
                return make_response(jsonify({"message":"Login Successful"}),200)
            else:
                return make_response(jsonify({'message':"Invalid username or password"}),400)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)


@app.route("/profile/<username>")
def profile(username):
    return f'profile page of {username}'


if __name__=='__main__':
    app.run(debug=True)