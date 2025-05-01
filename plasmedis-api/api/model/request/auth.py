from api import api
from flask_restx import fields

credentials = api.model("Credentials", {
    "username": fields.String(example="username", required=True),
    "password": fields.String(example="123456789", required=True)
})

recover_password = api.model("Recover Password", {
    "username": fields.String(example="username", required=False),
    "email": fields.String(example="admin@admin.com", required=False)
})
