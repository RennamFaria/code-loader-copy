from flask_cors import cross_origin
from flask_restx import Resource

from api import api
from api.util.auth import get_authorized_user
from api.util.request import get_path_without_pagination_args, get_pagination_arg
from api.util.response import get_paginated_list

from api.util.decorators import required

from api.service.privileges import All, Create

import api.model.request.privileges as request
import api.model.response.privileges as response
import api.model.response.default as default

privileges = api.namespace('privileges', description="Privileges namespace")


@privileges.route("")
class Privileges(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET Privileges', description='This endpoint handles a GET request that returns the list of all privileges')
    @required(response=response.privileges_list, token=True)
    def get(self):
        results = All()

        page, limit = get_pagination_arg()
        path = get_path_without_pagination_args()
        privileges_page = get_paginated_list("privileges", results, path, page, limit)

        if 'privileges' in privileges_page:
            return privileges_page, 200
        return privileges_page, 400

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='POST Privilege', description='This endpoint handles a POST request that create a new privilege')
    @required(response=default.message, request=request.privileges, token=True)
    def post(self, data):
        new_id = Create(data, get_authorized_user())

        return {"message": f"Privilégio {new_id} criado com sucesso"}, 200
