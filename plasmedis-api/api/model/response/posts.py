from api import api
from flask_restx import fields

from api.model.metadata import created

post = api.model("Post", {
    "titulo": fields.String("Title"),
    "texto": fields.String("Text"),
    # metadata
    "created": fields.Nested(created)
})

post_list = api.model("Post List", {
    "count": fields.Integer(1),
    "post": fields.List(fields.Nested(post)),
    "message": fields.String("Message")
})

post_complete = api.model("Post Complete", {
    "id": fields.Integer(1),
    "categoria": fields.Integer(1),
    "titulo": fields.String("Title"),
    "texto": fields.String("Text"),
    "selo": fields.Boolean(True),
    "comments_count": fields.Integer(1),
    # metadata
    "created": fields.Nested(created),
})

comment = api.model("Post Comment", {
    "id": fields.Integer(example=1),
    "texto": fields.String(example="Text"),
    "resposta": fields.Integer(example="Answer"),
    # metadata
    "created": fields.Nested(created)
})

post_complete_list = api.model("Post Complete List", {
    "count": fields.Integer(example=1),
    "current": fields.Integer(example=1),
    "limit": fields.Integer(example=10),
    "previous": fields.String(example=""),
    "next": fields.String(example=""),
    "posts": fields.List(fields.Nested(post_complete))
})
