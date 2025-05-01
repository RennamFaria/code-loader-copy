from flask import request as req
from flask_cors import cross_origin
from flask_restx import Resource

from api import api, AUTH_VERSION

from api.util.decorators import required, token_required
from api.util.auth import get_authorized_user
from api.util.errors import EntryNotFoundError, MessagedError, NotFoundError
from api.util.request import get_boolean_arg

from api.service.auth import *

import api.model.request.auth as request
import api.model.response.auth as response
import api.model.response.default as default

auth = api.namespace('auth', description="Auth namespace")


@auth.route("/login")
class Login(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET Authorization Version', description='This endpoint handles a GET request that return the API Authorization Version')
    @required(response=response.auth_version, token=False)
    def get(self):
        # isso esta fora do service pq não depende de nenhum dado do portal, mas sim do "protocolo" de login da api
        #       faz sentido isso?

        # retorna um marcador de versão, para quando as mudanças no token forem tão significativas que o único
        # jeito de atualizar algo no front vai ser matando a sessão atual do usuário

        return {'version': AUTH_VERSION}, 200

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='POST User Login', description='This endpoint handles a POST request that return the token and the user data')
    @required(response=response.login_response, request=request.credentials, token=False)
    def post(self, data):

        user = Authenticate(data['username'], data['password'])

        if user is not None:
            expiration = datetime.datetime.utcnow() + datetime.timedelta(days=7)
            issued_at = datetime.datetime.utcnow()

            token = jwt.encode({
                'auth': AUTH_VERSION,
                'exp': expiration,
                'iat': issued_at,
                'sub': user["id"],
                'iss': os.environ.get('ME', 'plasmedis-api-local'),
                'aud': req.args.get('aud', 'unknown')
            }, app.config['SECRET_KEY'], algorithm="HS256")

            return {"user": user, "token": token}, 200  # Valido

        return {"user": user, "token": None}, 404  # Invalido


@auth.route("/recover")
class Recover(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='POST Recover Password', description='This endpoint handles a POST request which is used to recover the user password')
    @required(response=default.message, request=request.recover_password, token=False)
    def post(self, data):
        username = data.get("username", None)
        email = data.get("email", None)

        # esse tratamento de erro aqui é meio "experimental"
        #       em uma versão final esse tipo de tratamento deveria estar em um lugar especifico, pra nao ficar
        #       repetindo codigo sem necessidade
        try:
            RecoverPassword(username, email)

            return {"message": "Senha alterada. Verifique o email para mais informações"}, 200
        except NotFoundError as e:
            # erro especifico para quando não existe uma entrada para a chave informada
            #       nesse caso, nao existe um usuario com o username/email informados
            # então deveria ser informada a mensagem do erro pro usuário E um status code 404 NOT FOUND
            return {"message": e.message}, 404
        except ForbiddenError as e:
            # erro especifico para quando a operação não é permitida por algum motivo
            #       nesse caso, a senha do admin nao pode ser resetada
            # então deveria ser informada a mensagem do erro pro usuário E um status code 403 FORBIDDEN
            return {"message": e.message}, 403
        except MessagedError as e:
            # erro geral, que possui alguma mensagem especifica
            # nesse caso, informar a mensagem ed erro pro usuario E um status code 500 INTERNAL SERVER ERROR
            return {"message": e.message}, 500


@auth.route('/me')
class Me(Resource):
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @api.doc(summary='GET Authorized User', description='This endpoint handles a GET request which is used to get the authorized user data')
    @required(response=response.me, token=True)
    def get(self):
        # arg data: if response should include data field
        user = ById(get_authorized_user().id, get_boolean_arg("data"))

        return {"user": user}, 200
