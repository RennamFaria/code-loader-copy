from api import api
from flask_restx import fields
import json

avatar_data = api.model("Avatar", {
    "avatar": fields.String(example="AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZX"),
})

user = api.model("User", {
    "id": fields.Integer(example=1),
    "type": fields.Integer(example=3),
    "active": fields.Boolean(example=True),
    "email": fields.String(example="user@user.com"),
    "username": fields.String(example="username"),
    "name": fields.String(example="name"),
    "has_data": fields.Boolean(example=True),
    "has_accepted_terms": fields.Boolean(example=True),
    "avatar_data": fields.Nested(avatar_data)
})

user_data = api.model("User Data", {
    'genero': fields.String(example="Masculine"),
    'nascimento': fields.Date(example="10-10-1990"),
    'area_atuacao': fields.String(example="Health"),
    'instituicao': fields.String(example="Universidade Federal de São Paulo"),
    'campus': fields.String(example="São José dos Campos"),
    'setor': fields.String(example="Orthopedics"),
    'deficiencia': fields.Boolean(example=True),
    'parente_com_tea': fields.Boolean(example=True),
    'freq_convivio_tea': fields.String(example="Weekly"),
    'qtd_alunos_tea': fields.Integer(example=10),
    'tempo_trabalho_tea': fields.Integer(example=10),
    'qtd_pacientes_tea_ano': fields.Integer(example=10),
})

user_with_data = api.inherit("User with Data", user, {
    "data": fields.Nested(user_data, allow_null=True)
})

user_complete = api.model("User Complete", {
    "user": fields.Nested(user_with_data)
})

users_list = api.model("Users List", {
    "count": fields.Integer(example=1),
    "current": fields.Integer(example=1),
    "limit": fields.Integer(example=10),
    "previous": fields.String(example=""),
    "next": fields.String(example=""),
    "users": fields.List(fields.Nested(user))
})

user_create_message = api.model("User Create Message", {
    "message": fields.String(example="Usuario Criado"),
    "user": fields.Integer(example=2)
})
