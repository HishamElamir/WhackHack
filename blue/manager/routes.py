from flask import Blueprint, render_template, redirect, request, session

from ..core.db import connect
from ..core.db.users import Users
from ..core.db.tasks import Tasks
from ..core.db.recommender import Recommend

from ..core.utils import word_count

mod = Blueprint('manager', __name__,
                template_folder='templates', static_folder='static')
dbs = connect()


@mod.route('', methods=['GET', 'POST'])
@mod.route('/', methods=['GET', 'POST'])
def manager__index_dashboard():
    user = Users(db=dbs)
    tasks = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
        categories_labels, categories_count = tasks.get__count__per_category('all')
        types_labels, types_count = tasks.get__count__per_type('all')
        days_labels = []
        days_count = []
        for item in list(tasks.get__count__per_day()):
            days_labels.append(item['_id'])
            days_count.append(item['count'])
        devs_stat = tasks.get__user__per_category()

        # total_devs = user.get__count__role('developer')
        # tasks_list = tasks.get_tasks__user_id(this_user['_id'], developer_filled='filled')
        # task_waiting = tasks.get_tasks__user_id(this_user['_id'], developer_filled='not')
        # logs_this_week = tasks.get__count__per_week()

        # total_task_type = tasks.get__count__by_type('Development')
        # logs_hours_this_week = tasks.get__count__hours_per_week()
        # tasks_types, tasks_hours_per_type = tasks.get__count__hours_per_type()
        # dev_hours_list = tasks.get__count__hours_developers_per_categories()

        # devs_stat = tasks.get__user__per_category()

        if this_user['role'] == 'manager':
            return render_template('dashboard.manager.html', this_user=this_user, devs_stat=devs_stat,
                                   categories={'key': categories_labels, 'value': categories_count},
                                   types={'key': types_labels, 'value': types_count},
                                   days={'key': days_labels, 'value': days_count})
        else:
            return redirect('/')
    else:
        return redirect('/')


@mod.route('/create-ticket', methods=['GET', 'POST'])
@mod.route('/create-ticket/', methods=['GET', 'POST'])
def manager__create_task():
    user = Users(db=dbs)
    task = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'manager':
        if request.method == 'POST':
            task.insert(request.form, this_user['_id'])
            return render_template('create_task.manager.html', this_user=this_user)
        else:
            return render_template('create_task.manager.html', this_user=this_user)
    else:
        return redirect('/')


@mod.route('/assign-ticket', methods=['GET', 'POST'])
@mod.route('/assign-ticket/', methods=['GET', 'POST'])
def manager__assign_task():
    user = Users(db=dbs)
    task = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'manager':
        dev_list = user.get_user__role('manager')
        task_list = task.get_tasks__type("opened")
        if request.method == 'POST':
            print(request.form)
            task.assign(request.form, this_user['_id'])
            return render_template('assign_task.manager.html',
                                   this_user=this_user, dev_list=dev_list, task_list=task_list)
        else:
            return render_template('assign_task.manager.html',
                                   this_user=this_user, dev_list=dev_list, task_list=task_list)
    else:
        return redirect('/')


@mod.route('/view-ticket', methods=['GET', 'POST'])
@mod.route('/view-ticket/', methods=['GET', 'POST'])
def manager__view_task():
    user = Users(db=dbs)
    task = Tasks(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'manager':
        task_list = task.get_tasks__assigned__by_id(this_user['_id'])
        return render_template('view_task.manager.html',
                               this_user=this_user, task_list=task_list)
    else:
        return redirect('/')


@mod.route('/view-ticket/<task_id>', methods=['GET', 'POST'])
@mod.route('/view-ticket/<task_id>/', methods=['GET', 'POST'])
def manager__task_dashboard(task_id=None):
    user = Users(db=dbs)
    task = Tasks(db=dbs)
    recommend = Recommend(db=dbs)

    if session.get('logged_in'):
        this_user = user.get_user_by_id(session['user_id'])
    else:
        return redirect('/')

    if this_user['role'] == 'manager':
        task = task.get_tasks__by_id(task_id)
        word_cloud = {"data": word_count(task['title'] + " " + task['description'])}

        row = list(recommend.get_similar(text=task['title'] + task['description']))[0]

        return render_template('task_dashboard.manager.html',
                               this_user=this_user, task=task, word_cloud=word_cloud,
                               impact=row['impact'], urgency=row['urgency'])
    else:
        return redirect('/')
