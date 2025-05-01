from flask_restx import fields
import api.model.response.users as user_response

from api import api

generic_model = api.model('Generic', {
    "message": fields.String("Generic Message"),
    "user_data": fields.Nested(user_response.user_data)
})
