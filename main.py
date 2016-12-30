# -*- coding: utf-8 -*-

import logging

from flask import Flask, render_template, request, redirect, g
from flask_babel import Babel, get_locale
from babel import negotiate_locale

app = Flask(__name__)
babel = Babel(app)

AVAILABLE_LOCALES = [str(t) for t in babel.list_translations()]

@babel.localeselector
def get_user_locale():
	preferred = [x.replace('-', '_') for x in request.accept_languages.values()]
	if 'l' in request.args:
		preferred = [request.args['l']]
	elif 'fb_locale' in request.args:
		preferred = [request.args['fb_locale']]
	return negotiate_locale(preferred, AVAILABLE_LOCALES)

@app.before_request
def before_request():
	g.locale = get_locale()
	if g.locale is None:
		g.locale = 'en'

@app.route('/')
def hello():
    return render_template('index.html')

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500

if __name__ == '__main__':
    app.run(debug=True)
