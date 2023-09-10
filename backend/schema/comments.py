from datetime import datetime

comment_schema={
    'user_id': '',
    'post_id': '',
    'comment': '',
    'username':'',
    'profilepath':'',
    'likes':[],
    'likeCount':0,
    'postedAt':datetime.now().strftime("%B %d, %Y"),
    'exactTime':datetime.now(),
    }