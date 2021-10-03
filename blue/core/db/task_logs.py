from datetime import datetime, timedelta
import random

from ..utils import get_config

class TaskLogs:
    def __init__(self, db=None):
        self._task_logs = db.tasks
        pass
    
    def get_tasklog_list(self,):
        return self._task_logs.find()

    def get__count__per_week(self, this_day=datetime.now()):
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)        
        return self._task_logs.find({
                        "creation_date": {
                                "$gte": start,
                                "$lt": end}}).count()

    def get__count__by_type(self, task_type):
        return self._task_logs.find({
                        "task_type": task_type
                    }).count()
    
    def get__count__hours_per_week(self, this_day=datetime.now()):
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)
        results = self._task_logs.find({
                        "creation_date": {
                                "$gte": start,
                                "$lt": end}})
        count = datetime.strptime("00:00", '%H:%M')
        for record in results:
            diff = datetime.strptime(record['task_end_time'], '%H:%M') - datetime.strptime(record['task_start_time'], '%H:%M')
            count += diff
        return count.hour


    def get__count__hours_per_type(self,):
        specializations = get_config("specializations")
        hours_per_type = []
        for i in specializations:
            all_tasks = self._task_logs.find({'specialization': specializations})
            count = datetime.strptime("00:00", '%H:%M')
            print(list(all_tasks))
            for record in all_tasks:
                diff = datetime.strptime(record['task_end_time'], '%H:%M') - datetime.strptime(record['task_start_time'], '%H:%M')
                count += diff
            hours_per_type.append(count.hour)
        return specializations, hours_per_type
