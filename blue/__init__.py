from flask import Flask

app = Flask(__name__)
app.secret_key = 'HECORE_SECRETKEY'



from blue.api.routes import mod
from blue.sign.routes import mod
from blue.interface.routes import mod

from blue.manager.routes import mod
from blue.developer.routes import mod


app.register_blueprint(interface.routes.mod)
app.register_blueprint(api.routes.mod, url_prefix='/api')
app.register_blueprint(sign.routes.mod, url_prefix='/sign')
app.register_blueprint(manager.routes.mod, url_prefix='/manager')
app.register_blueprint(developer.routes.mod, url_prefix='/developer')
