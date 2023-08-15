from flask import Flask,jsonify,make_response
from flask_pymongo import PyMongo


app=Flask(__name__)
app.config['MONGO_URI']='mongodb+srv://goFood:goFoodOwner@cluster0.s05gfyt.mongodb.net/communityConnect?retryWrites=true&w=majority'
mongo=PyMongo(app)



@app.route("/")
def home():
    res=mongo.db.users.find_one({})
    print(res)
    return jsonify(res['name'])


if __name__=='__main__':
    app.run(debug=True)