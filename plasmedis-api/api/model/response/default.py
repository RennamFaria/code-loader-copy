from api import api
from flask_restx import fields

message = api.model("Message", {
    "message": fields.String(example="Generic Message")
})
