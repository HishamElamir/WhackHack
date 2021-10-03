import datetime

from flask import Blueprint, render_template, flash, redirect, request, session, abort, jsonify

from ..core.db import connect
from ..core.db.users import Users
from ..core.db.tasks import Tasks
from ..core.db.task_logs import TaskLogs
from ..core.db.task_assigns import TaskAssigns

from ..core.utils import get_config

mod = Blueprint('developer', __name__,
                template_folder='templates', static_folder='static')
dbs = connect()


@mod.route('', methods=['GET', 'POST'])
@mod.route('/', methods=['GET', 'POST'])
def developer__index_dashboard():
    user = Users(db=dbs)
    tasks = Tasks(db=dbs)
    task_logs = TaskLogs(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])

        categories_labels, categories_count = tasks.get__count__per_category(this_user['_id'])
        types_labels, types_count = tasks.get__count__per_type(this_user['_id'])
        devs_stat = tasks.get__user__per_category()
        if this_user['role'] == 'developer':
            return render_template('dashboard.developer.html', this_user=this_user,
                                   devs_stat=devs_stat,
                                   categories={'key': categories_labels, 'value': categories_count},
                                   types={'key': types_labels, 'value': types_count})
        else:
            return redirect('/')
    else:
        return redirect('/')


@mod.route('/tasklog/<task>', methods=['GET', 'POST'])
@mod.route('/tasklog/<task>/', methods=['GET', 'POST'])
def developer__task_log(task):
    user = Users(db=dbs)
    this_user = user.get_user_by_id(session['user_id'])
    if session.get('logged_in') and this_user['role'] == 'developer':
        if request.method == 'POST':
            log_task = Tasks(db=dbs)
            print(request.form)
            log_task.fill_developer_log(request.form, task)
            return redirect('/developer/')
        else:
            tasks = Tasks(db=dbs)
            task_assigned = tasks.get_tasks__assigned__by_id(task)
            print(task_assigned)
            return render_template('task_log.developer.html', user_id=this_user['_id'],
                                   task_assigned=task_assigned)
    else:
        return redirect('/')


@mod.route('/create-ticket', methods=['GET', 'POST'])
@mod.route('/create-ticket/', methods=['GET', 'POST'])
def developer__create_task():
    user = Users(db=dbs)
    task = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'developer':
        if request.method == 'POST':
            task.insert(request.form, this_user['_id'])
            return render_template('create_task.developer.html', this_user=this_user)
        else:
            return render_template('create_task.developer.html', this_user=this_user)
    else:
        return redirect('/')


@mod.route('/view-ticket', methods=['GET', 'POST'])
@mod.route('/view-ticket/', methods=['GET', 'POST'])
def developer__view_task():
    user = Users(db=dbs)
    task = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'developer':
        task_list = task.get_tasks__user_id(this_user['_id'])
        return render_template('view_task.developer.html',
                               this_user=this_user, task_list=task_list)
    else:
        return redirect('/')
