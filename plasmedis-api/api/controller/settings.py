from flask_cors import cross_origin
from flask_restx import Resource

import api.model.request.user_data as request
import api.model.response.default as default
import api.model.response.settings as response
import api.model.response.user_data as user_data_response
from api import api
from api.service.settings import *
from api.util.decorators import required

settings = api.namespace('settings', description="Settings namespace")


@settings.route("/<string:type>")
class Settings(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET Setting by Type', description='This endpoint handles a GET request that get a setting by type')
    @required(response=response.settings_response, token=True)
    def get(self, type):
        if type not in ['web', 'api']:
            return {"message": f"Não existe uma configuração para \"{type}\""}, 404

        data = ByType(type)

        return {"message": "Recuperando configuração atual", "settings": data}, 200
    

@settings.route("")
class UserData(Resource):
    
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='POST Setting', description='This endpoint handles a POST request that create a new setting')
    @required(response=default.message, request=request.user_data_request, token=True)
    def post(self, data):
        obj = createUserData(data)

        if obj == "":
            return {f"message": "User data already exists for settings id " + str(data['settings_id'])}, 400

        return {"message": "User data created"}, 201

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='PUT Setting', description='This endpoint handles a PUT request which updates the user data of a setting')
    @required(response=default.message, request=request.user_data_request, token=True)
    def put(self, data):
        obj = updateUserData(data)
        if obj == "":
            return {f"message": "User data does not exists for settings id " + str(data['settings_id'])}, 400
        return {"message": "User data updated"}, 201
    
@settings.route("/<int:settingsId>")
class UserDataId(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET Setting by ID', description='This endpoint handles a GET request that get the user data of a setting by ID')
    @required(response=user_data_response.generic_model, token=True)
    def get(self, settingsId):

        data = findUserDataById(settingsId);

        if data['user_data'] == "" :
            return {"message": "User data not found"}, 404


        return {"message": "User data successfully found",'user_data' : data['user_data']}, 200
    

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='DELETE Setting', description='This endpoint handles a DELETE request that delete a setting by ID')
    @required(response=default.message, token=True)
    def delete(self, settingsId):
        
        data = deleteUserData(settingsId)

        return {"message": "User data sucessfully deleted", "settings": data}, 200
    

