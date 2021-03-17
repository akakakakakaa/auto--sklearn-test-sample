from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api
from ns.autosklearn.autosklearn_api import ns as autosklearn_ns

app = Flask(__name__)
CORS(app)
app.config.SWAGGER_UI_DOC_EXPANSION = 'full'
api = Api(app, version="1.0", title="autosklearn sample api")
api.add_namespace(autosklearn_ns)

if __name__ == "__main__":
  app.run(host="0.0.0.0", port="5500")