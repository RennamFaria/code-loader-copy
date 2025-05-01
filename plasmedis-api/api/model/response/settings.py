from api import api
from flask_restx import fields

visible = api.model("Visibility", {
    "/categorias": fields.Boolean(example=True)
})

settings = api.model("Settings", {
    "id": fields.Integer(example=1),
    "visible": fields.Nested(visible)
})

settings_response = api.model("Settings Response", {
    "message": fields.String(example="Generic Message"),
    "settings": fields.Nested(settings)
})
