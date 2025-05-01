from flask_restx import fields
import api.model.response.users as user_response

from api import api

user_data_request = api.model("User Data Created", {
    "settings_id": fields.Integer(example=1),
    "user_data": fields.Nested(user_response.user_data)
})
