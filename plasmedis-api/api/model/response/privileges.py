from api import api
from flask_restx import fields

privileges = api.model("Privileges", {
    "id": fields.Integer(example=1),
    "name": fields.String(example="Administrator")
})

privileges_list = api.model("Privileges List", {
    "count": fields.Integer(example=1),
    "current": fields.Integer(example=1),
    "limit": fields.Integer(example=10),
    "previous": fields.String(example=""),
    "next": fields.String(example=""),
    "privileges": fields.List(fields.Nested(privileges)),
})
