from api import api
from flask_restx import fields

category = api.model("Category", {
    "id": fields.Integer(example=1),
    "name": fields.String(example="name"),
    "posts": fields.Integer(example=1)
})

category_list = api.model("Category List", {
    "count": fields.Integer(example=1),
    "current": fields.Integer(example=1),
    "limit": fields.Integer(example=10),
    "previous": fields.String(example=""),
    "next": fields.String(example=""),
    "categories": fields.List(fields.Nested(category))
})
