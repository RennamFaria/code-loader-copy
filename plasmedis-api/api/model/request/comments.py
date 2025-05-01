from api import api
from flask_restx import fields

comment = api.model("Comment Create", {
    "postagem": fields.Integer(example=1),
    "texto": fields.String(example="Text"),
    "resposta": fields.Integer(example="Answer"),
})
