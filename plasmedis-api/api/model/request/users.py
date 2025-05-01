from api import api
from flask_restx import fields
import api.model.response.users as user_response

user_create = api.model("User Create", {
    "type": fields.Integer(3),
    "username": fields.String("username"),
    "email": fields.String("user@user.com"),
    "name": fields.String("name"),
    "password": fields.String("123456789"),
    "data": fields.Nested(user_response.user_data, allow_null=True),
    "avatar_id": fields.Integer(1),
})

user_update = api.model("User Update", {
    "type": fields.Integer(example=3),
    "active": fields.Boolean(example=True),
    "email": fields.String(example="user@user.com"),
    "username": fields.String(example="username"),
    "name": fields.String(example="name"),
    "password": fields.String(example="password"),
    "confirmation_password": fields.String(example="password"),
    "data": fields.Nested(user_response.user_data, skip_none=True)
})

