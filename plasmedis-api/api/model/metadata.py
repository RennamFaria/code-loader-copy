from api import api
from flask_restx import fields

created = api.model("Created Metadata", {
    "user": fields.Integer(example=1),
    "name": fields.String(example="Name"),
    "date": fields.String(example="10-10-1999")
})

updated = api.model("Updated Metadata", {
    "user": fields.Integer(example=1),
    "name": fields.String(example="Name"),
    "date": fields.String(example="10-10-1999")
})

metadata = api.model("Metadata", {
    "created": fields.Nested(created),
    "updated": fields.Nested(updated)
})
