from api import api
from flask_restx import fields

post_create = api.model("Post Create", {
    "categoria": fields.Integer(example=1),
    "titulo": fields.String(example="Title"),
    "texto": fields.String(example="Text")
})

post_update = api.model("Post Update", {
    "categoria": fields.Integer(example=1),
    "titulo": fields.String(example="Title"),
    "texto": fields.String(example="Text")
})