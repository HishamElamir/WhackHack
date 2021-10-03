from flask import Blueprint, request, jsonify
from ..core.db import connect
from ..core.db.tasks import Tasks
from ..core.db.recommender import Recommend

import json
import os

mod = Blueprint('api', __name__)
dbs = connect()


@mod.route('/tasks/get', methods=['GET', 'POST'])
@mod.route('/tasks/get/', methods=['GET', 'POST'])
def api__tasks_get(project):
    tasks = Tasks()
    if request.method == 'POST':
        return jsonify({'tasks': tasks.get_tasks_list()})


@mod.route('/tasks/get_similar', methods=['GET', 'POST'])
@mod.route('/tasks/get_similar/', methods=['GET', 'POST'])
def api__recommend_similar():
    if request.method == 'POST':
        recommend = Recommend(dbs)
        row = list(recommend.get_similar(text=request.form['textData']))[0]
        return jsonify({'impact': row['impact'],
                        'score': row['score'],
                        'urgency': row['urgency']})
