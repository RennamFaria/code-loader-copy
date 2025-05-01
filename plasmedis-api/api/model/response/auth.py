from api.util.decorators import required
from api import api
from flask_restx import fields

from api.model.response.users import user, user_with_data, user_complete


login_response = api.model("Login Response", {
    "user": fields.Nested(user, allow_null=True),
    "token": fields.String(example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9")
})

auth_version = api.model("Authentication Version", {
    "version": fields.String(example="0.2.2")
})

me = api.inherit("Authorized User", user_complete, {
    "user": fields.Nested(user_with_data)
})
