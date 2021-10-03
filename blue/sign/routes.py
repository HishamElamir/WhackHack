from flask import Blueprint, render_template, flash, redirect, request, session, abort
from ..core.db import connect
from ..core.db.users import Users


mod = Blueprint('sign', __name__, template_folder='templates', static_folder='static', static_url_path='.static/sign')

dbs = connect()


@mod.route('/in', methods=['GET', 'POST'])
@mod.route('/in/', methods=['GET', 'POST'])
def sign_in_page():
    if session.get('logged_in'):
        return redirect('/')
    else:
        if request.method == 'POST':
            user = Users(db=dbs)
            logged_user = user.get_user_by_username(request.form['username'])
            if logged_user is not None:
                print(logged_user)
                if user.check_user_password(logged_user['_id'], request.form['password']):
                    session['logged_in'] = True
                    session['user_id'] = logged_user['_id']
                    return redirect('/')
                else:
                    return render_template('in.sign.html')
            else:
                return render_template('in.sign.html')
        else:
            return render_template('in.sign.html')

@mod.route('/up/', methods=['POST', 'GET'])
@mod.route('/up', methods=['POST', 'GET'])
def sign_up_page():
    if session.get('logged_in'):
        return redirect('/')
    else:
        if request.method == 'POST':
            user = Users(db=dbs)
            if user.get_user_by_email(request.form['email']) or user.get_user_by_username(request.form['username']):
                return render_template('up.sign.html', error="Username or Email is exists")
            else:
                user.insert_user(request.form['username'], request.form['email'], request.form['password'])
                session['logged_in'] = True
                session['user_id'] = user.get_user_id_by_email(request.form['email'])
                return redirect('/')
        else:
            return render_template('up.sign.html')

@mod.route('/out')
@mod.route('/out/')
def sign_out_page():
    if session.get('logged_in'):
        session['logged_in'] = False
        return redirect('/sign/in/')
    else:
        return redirect('/sign/in/')
