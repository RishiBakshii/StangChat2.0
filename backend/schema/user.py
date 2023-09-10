from datetime import datetime

user_schema = {
    'username': '',
    'email': '',
    'password': '',
    'location': '',
    'bio': '',
    'profilePicture': '',
    'followers': [],
    'following': [],
    'postCount': 0,
    'followerCount': 0,
    'followingCount': 0,
    'createdAt':datetime.now().strftime("%B %d, %Y"),
    'exactTime':datetime.now(),
}