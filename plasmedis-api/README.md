# PlaSMeDIS API

Plataforma Social Moderada para Disseminação de Informações sobre Saúde

Ação do projeto de extensão CodeLab-Unifesp - IBEAC

O projeto CodeLab-Unifesp desenvolve uma plataforma de comunicação e interação social para que a organização social 
IBEAC - Instituto Brasileiro de Estudos e Apoio Comunitário Queiróz Filho dissemine informações de saúde a gestantes 
e puérperas das comunidades da região de Parelheiros em São Paulo. A ideia, formatada a partir de várias reuniões com 
representantes da ONG, é desenvolver um aplicativo de fórum de discussão que criará uma ponte entre especialistas em 
primeira infância do CEPI (Centro de Estudos em Primeira Infância) e as mães e puérperas. Entre os tópicos do aplicativo 
estão os cuidados com as mães, o parto e os bebês, além de trocas solidárias e indicações de cultura e lazer. O projeto tem 
potencial de atingir um grande número de pessoas da comunidade, visto que a ONG trabalha com toda a região de Parelheiros e 
tem atuação e reconhecimento nacionais. O software a ser desenvolvido será de licença livre e poderá ser usado também por 
outras comunidades. 

## 🚀 Começando

O back-end é desenvolvido em Flask, um micro framework para desenvolvimento web em Python. O front-end é desenvolvido em React, 
um framework JavaScript criado pelo Facebook (atual Meta) que é usado para criar interfaces de usuário (UI) em aplicações web. 
Essas instruções permitirão que você obtenha uma cópia do back-end em operação na sua máquina local para fins de desenvolvimento e 
testes. O back-end pode ser executado com o Docker ou com o Docker-Compose. Docker é uma plataforma que disponibiliza 
diversos serviços baseados em containers que permitem que vários aplicativos funcionem em diferentes sistemas operacionais. 
Docker Compose é uma solução multi-container que utiliza um arquivo declarativo para definir os serviços que você quer rodar, 
sendo que cada serviço é basicamente um container que você pode executar. Para começar, instale o git e clone o projeto:

```
git clone https://github.com/UnifespCodeLab/plasmedis-api.git
```

## 📋 Instalação

### Instalação no Windows:

Instale o Python : https://www.python.org/downloads/  
Instale o Docker Desktop for Windows: https://docs.docker.com/desktop/install/windows-install/  

Confirme a instalação das ferramentas:

```
python --version
docker --version
docker-compose --version
```

### Instalação no Linux e no WSL:

Instação do WSL e do Python no WSL: https://medium.com/@francisco_51376/python-wsl-2-75e38ab368c9  
Instalar e Utilizar o Docker no Linux Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt  
Instalar Python no Linux Ubuntu: https://python.org.br/instalacao-linux/  
Instalar e Utilizar o Docker Compose no Linux Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-pt  

## 🔧 Execução

Você deve criar um arquivo no diretório raiz do projeto (\plasmedis-api) chamado .env. Copie o conteúdo
do arquivo .env.sample para este arquivo::

```
DATABASE_URI="postgresql://postgres:1234@<ip>:5432/postgres"
SECRET_KEY="KEY"
VERSION="2.1"
AUTH_VERSION="0.2.2"
PORTAL_NAME="TEApp"
```

Preencha o campo <ip> da seguinte forma:

No Windows você pode usar localhost ou o endereço IP da máquina Windows, que você pode obter no prompt com o comando 
ipconfig e buscando pelo valor Endereço IPv4. Exemplo:

```
DATABASE_URI="postgresql://postgres:1234@localhost:5432/postgres"
DATABASE_URI="postgresql://postgres:1234@192.168.1.165:5432/postgres"
```

No WSL2, você pode usar localhost ou o seu IP no WSL2, que você pode obter no prompt com o comando ifconfig e buscando pelo valor inet. Da mesma forma, 
se estiver em um contêiner Docker no Linux, você pode usar localhost ou o endereço IP do host Linux com o comando ifconfig.

### Para executar no Windows:

Executar com o Docker Compose:

Estando no diretório com o arquivo `Dockerfile`, execute:

```
docker-compose build
```
O comando docker-compose build é usado para construir ou reconstruir as imagens Docker definidas no arquivo docker-compose.yml. 
Isso é útil quando você faz alterações no seu código, nas dependências ou em outros componentes do seu ambiente de contêineres.
Ele lê as instruções do arquivo Dockerfile associado a cada serviço no seu docker-compose.yml e cria as imagens correspondentes.
Após isso, execute o comando:

```
docker-compose up -d
```

O comando docker-compose up é usado para iniciar os serviços definidos no arquivo docker-compose.yml.
Ele cria e inicia os contêineres com base nas imagens construídas anteriormente.Ele também gerencia a 
interconexão entre os serviços conforme definido nas configurações do Docker Compose. Em geral, execute
o build caso haja mudança de dependências, e o up a cada alteração que você queira testar durante o desenvolvimento.
A flag -d inicia os serviços em segundo plano (detached mode), te permitindo continuar a usar o mesmo terminal. Para finalizar 
um ambiente Docker que foi iniciado em segundo plano:

```
docker-compose down
```

Alguns endereços importantes:

```
Documentação dos Endpoints: http://localhost:5000/docs
Postgree SQL Admin: http://localhost:5050/browser
Status da Aplicação: http://localhost:5000/status
```

Para iniciar o desenvolvimento você deve criar as tabelas no banco de dados e inserir registros. Acesse
http://localhost:5050/browser, a senha do user admin e do banco de dados é 1234 

Crie um servidor com as seguintes informações:

```
Name: plasmedis-db
Host name/address: plasmedis-db
Maintenance Database: postgres
Username: postgres
Password: 1234
```

No Object Explorer busque por Servers > plasmedis > Databases > Schemas > public > Tables. Com o botão direito em Tables busque
por Query Tool e copie e execute o conteúdo do arquivo database/teapp_tables.sql para criar as tabelas no banco.
Da mesma forma, copie e execute o conteúdo do arquivo database/teapp_inserts.sql para criar alguns registros no banco.


Para executar com Docker

Construa a imagem com:
```
docker build -t plasmedis-api <path>
```

Sendo path o caminho para o diretório com o arquivo `Dockerfile`

Execute a aplicação em modo desacoplado com:
```
docker run -d -t plasmedis-api
```

Identifique o IP do container e utilize-o para fazer as requisições sobre a porta 8000
```
docker network inspect bridge
```
