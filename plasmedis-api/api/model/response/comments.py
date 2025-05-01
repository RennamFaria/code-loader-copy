from api import api
from flask_restx import fields

from api.model.metadata import created

comment = api.model("Comment", {
    "id": fields.Integer(example=1),
    "texto": fields.String(example="Text"),
    "postagem": fields.Integer(example=1),
    "resposta": fields.Integer(example=2),
    # metadata
    "created": fields.Nested(created)
})

comment_list = api.model("Comment List", {
    "count": fields.Integer(example=1),
    "current": fields.Integer(example=1),
    "limit": fields.Integer(example=10),
    "previous": fields.String(example=""),
    "next": fields.String(example=""),
    "comments": fields.List(fields.Nested(comment)),
})
