import bcrypt

password="ilovedata"
hashed_password=bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())

print(f"BEFORE AND AFTER****************\npassword: {password}\nhashedPassword: {hashed_password}")