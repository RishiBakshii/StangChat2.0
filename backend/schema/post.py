from datetime import datetime

post_schema={
    "user_id":'',
    "username":'',
    "caption":'',
    "postPath":'',
    "profilePath":'',
    'likesCount':0,
    'commentsCount':0,
    'likes':[],
    'postedAt':datetime.now().strftime("%B %d, %Y"),
    'exactTime':datetime.now(),
    }