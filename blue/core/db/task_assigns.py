import datetime
import random

class TaskAssigns:
    def __init__(self, db=None):
        self._task_assigns = db.task_assigns
        pass
    def insert(self, form, manager):
        return self._task_assigns.insert_one({
                    "_id": "{}".format(random.randint(10000, 100000000)),
                    "task_id": form['task'],
                    "developer_id": form['developer'],
                    "manager_id": manager,
                    "planned_start_date": form['ps-date'],
                    "planned_end_date": form['pe-date'],
                    "creation_date": datetime.datetime.utcnow()
                })

    def get_tasks__by_developer_id(self, developer_id):
        return self._task_assigns.find({"developer_id": developer_id})
