from flask import request as req
from flask_cors import cross_origin
from flask_restx import Resource

from api import api
from api.util.decorators import required, token_required
from api.util.auth import get_authorized_user
from api.util.request import get_boolean_arg, get_string_list_arg, get_path_without_pagination_args, get_pagination_arg
from api.util.response import get_paginated_list
from api.util.errors import MessagedError

from api.service.users import All, VerifyUsername, Create, ById, UpdateById, Remove

import api.model.request.users as request
import api.model.response.users as response
import api.model.response.default as default

users = api.namespace('users', description="Users namespace")


@users.route("")
class User(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET List of Users', description='This endpoint handles a GET request that return the list of all users or only the active users')
    @required(response=response.users_list, token=True)
    def get(self):
        users = All(not get_boolean_arg("inactive"), get_string_list_arg("email"), get_string_list_arg("username"))

        page, limit = get_pagination_arg()
        path = get_path_without_pagination_args()
        users_page = get_paginated_list("users", users, path, page, limit)

        if 'users' in users_page:
            return users_page, 200
        return users_page, 400

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='POST New User', description='This endpoint handles a POST request that create a new user')
    @required(response=response.user_create_message, request=request.user_create, token=True)
    def post(self, data):
        try:
            id = Create(data, get_authorized_user())
        except MessagedError as e:
            return {"message": e.message}, 500

        return {"message": f"Usuario criado", "user": id}, 200


@users.route('/<int:id>')
class UserId(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET User by ID', description='This endpoint handles a GET request that get a user by ID')
    @required(response=response.user_complete, token=True)
    def get(self, id):
        user = ById(id, get_boolean_arg("with_data", False))
        return {"user": user}, 200

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='PUT User by ID', description='This endpoint handles a PUT request that update a user by ID')
    @required(response=default.message, request=request.user_update, token=True)
    def put(self, data, id):
        try:
            user = UpdateById(id, data, get_authorized_user())

            return {"message": f"Dados de {user['username']} atualizados"}, 200
        except MessagedError as e:
            # erro geral, que possui alguma mensagem especifica
            # nesse caso, informar a mensagem ed erro pro usuario E um status code 500 INTERNAL SERVER ERROR
            return {"message": e.message}, 500

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='DELETE User by ID', description='This endpoint handles a DELETE request that delete a user by ID')
    @required(response=default.message, token=True)
    def delete(self, id):
        try:
            user = Remove(id, get_authorized_user())

            return {"message": f"Dados de {user['username']} removidos"}, 200
        except MessagedError as e:
            # erro geral, que possui alguma mensagem especifica
            # nesse caso, informar a mensagem ed erro pro usuario E um status code 500 INTERNAL SERVER ERROR
            return {"message": e.message}, 500


@users.route("/verify/<string:username>")
class Verify(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET username available', description='This endpoint handles a GET request that check if a username is available')
    @required(response=default.message, token=True)
    def get(self, username):
        exists = VerifyUsername(username)

        if exists:
            return {"message": f"Usuário '{username}' já existe."}, 400
        else:
            return {"message": f"Nome de usuário '{username}' esta disponível."}, 200
