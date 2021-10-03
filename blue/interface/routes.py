from flask import Blueprint, render_template, flash, redirect, request, session, abort

from ..core.db import connect
from ..core.db.users import Users

mod = Blueprint('interface', __name__, template_folder='templates', static_folder='static')
dbs = connect()


@mod.route('/')
def create_project_page():
    if not session.get('logged_in'):
        return redirect('/sign/in/')
    else:
        users_db = Users(db=dbs)
        logged_user = users_db.get_user_by_id(session['user_id'])
        if logged_user['role'] == 'manager':
            return redirect('/manager')
        elif logged_user['role'] == 'developer':
            return redirect('/developer/')
