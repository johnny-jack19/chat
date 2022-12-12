# Chat
This is the API to the messenger website found here:\
Live site: [https://jackson-chat.herokuapp.com/](https://jackson-chat.herokuapp.com/)\
GitHub: [https://github.com/johnny-jack19/chat-box](https://github.com/johnny-jack19/chat-box)

The url for this api is "https://jackson-chat-api.herokuapp.com" \
It connects to a database to store users, sessions, and messages between users.

## POST "users/login"
This is used to log a user in.

It requires a JSON object with the keys: "userName" and "pass".

Returns a 401 status if the user name or password were incorrect.\
If the login was successful, it will return a 200 status and a JSON object with the keys: "user" and "session".\
***These need to be stored and sent back as headers later***

## GET "/userlist"
***Requires a "user" and "session" header with data received from the login request***\
This is used to get a list of all the users with the exception of the user that is logged in.

Returns a JSON object with "results" as the key and an array with with each item containing an object with the keys: "user_id" and "user_name".

## GET "/:user/:friend"
***"user" is the logged in user and "friend" is the user currently being selected***\
***Requires a "user" and "session" header with data received from the login request***

This is used to get a table containing the messages of the user and the friend.

Returns a JSON object with "results" as the key and an array with with each item containing an object with the keys: "message_id", "user_id", "message", and "time_stamp".

## POST "/message/:user/:friend"
***"user" is the logged in user and "friend" is the user currently being selected***\
***Requires a "user" and "session" header with data received from the login request***

This is used to post a message into a chat table between the user and the friend.

Requires a body with a JSON object with the keys: "user_id" and "message".

## POST "/users"
This is used to create a new user.

Requires a JSON object with the keys: "userName" and "pass".\
It will encrypt the password and store both the user name and the password in a user table.

Returns a 201 status if it was successful and a 401 if the user name is already taken.
