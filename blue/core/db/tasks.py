from datetime import datetime, timedelta
import random

from ..utils import get_config


class Tasks:
    def __init__(self, db=None):
        self.db = db
        self._tasks = db.tasks
        pass

    @property
    def tasks(self):
        return self._tasks

    def insert(self, task, user):
        return self._tasks.insert_one({
            "_id": "{}--{}--{}".format(random.randint(10000, 100000000),
                                       task['title'].replace(" ", "-").lower(),
                                       task['category'].replace(" ", "-").lower()),
            "email": task['email'],
            "creator_id": user,
            "title": task['title'],
            "description": task['description'],
            "category": task['category'],
            "type": "opened",
            "creation_date": datetime.utcnow()
        })

    def assign(self, form, manager):
        self._tasks.update({"_id": form['ticket']},
                                  {
                                      "$push": {
                                          "assigned_for": {
                                              "_id": "{}".format(random.randint(10000, 100000000)),
                                              "assignee_id": form['worker'],
                                              "assigned_by": manager,
                                              "creation_date": datetime.utcnow()}
                                      }
                                  })
        return self._tasks.update({"_id": form['ticket']}, {"$set": {"type": "assigned"}})

    def fill_developer_log(self, form, assign_id):
        return self._tasks.update({"assigned_for._id": assign_id},
                                  {
                                      "$set": {
                                          "assigned_for.$.developer_day_log": form['log_day'],
                                          "assigned_for.$.developer_log_start_time": form['log_start_time'],
                                          "assigned_for.$.developer_log_end_time": form['log_end_time'],
                                          "assigned_for.$.developer_log_comments": form['log_comments']}
                                  })

    def get_tasks_list(self, ):
        return self._tasks.find()

    def get_tasks__by_id(self, task_id, developer_filled='all'):
        return self._tasks.find_one({"_id": task_id})

    def get_tasks__user_id(self, user_id, developer_filled='all'):
        return self._tasks.find({"creator_id": user_id})

    def get_tasks__type(self, task_type, developer_filled='all'):
        return self._tasks.find({"type": task_type})

    def get_tasks__assigned__by_developer_id(self, developer_id, filled=False):
        return self._tasks.find({"$and": [{"assigned_for.developer_id": {"$eq": developer_id}},
                                          {"assigned_for.developer_day_log": {"$exists": False}}]})

    def get_tasks__assigned__by_id(self, assign_id):
        return self._tasks.find({"assigned_for.assignee_id": assign_id})

    def get__count__per_day(self):
        return self._tasks.aggregate([
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "date": "$creation_date",
                            "format": "%Y-%m-%d"}
                    },
                    "count": {"$sum": 1}
                }
            }
        ])

    def get__count__hours_per_type(self, ):
        this_day = datetime.now()
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)
        specializations = self._tasks.distinct("category")
        hours_per_type = []
        for i in specializations:
            all_tasks = self._tasks.find({"$and": [{'category': i},
                                                   {"creation_date": {"$gte": start,
                                                                      "$lt": end}}]})
            count = datetime.strptime("00:00", '%H:%M')
            for record in all_tasks:
                for a in record['assigned_for']:
                    if 'developer_log_end_time' in a:
                        diff = datetime.strptime(a['developer_log_end_time'], '%H:%M') - datetime.strptime(
                            a['developer_log_start_time'], '%H:%M')
                        count += diff
            hours_per_type.append(count.day * 24 + count.hour)
        return specializations, hours_per_type

    def get__count__hours_per_categories(self, ):
        this_day = datetime.now()
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)
        categories = get_config("categories")
        hours_per_type = []
        for i in categories:
            all_tasks = self._tasks.find({'categories': i})
            count = datetime.strptime("00:00", '%H:%M')
            for record in all_tasks:
                for a in record['assigned_for']:
                    if 'developer_log_end_time' in a:
                        diff = datetime.strptime(a['developer_log_end_time'], '%H:%M') - \
                               datetime.strptime(a['developer_log_start_time'], '%H:%M')
                        count += diff
            hours_per_type.append(count.hour)
        return categories, hours_per_type

    def get__count__hours_developers_per_categories(self, ):
        categories = get_config("categories")
        hours_list = []
        all_tasks = list(self._tasks.find())
        for task in all_tasks:
            for dev in task['assigned_for']:
                if 'developer_log_end_time' in dev:
                    hours_list.append({"task_category": task['category'], "specialization": task['specialization'],
                                       "dev_id": dev['developer_id'],
                                       "hours": datetime.strptime(dev['developer_log_end_time'],
                                                                  '%H:%M') - datetime.strptime(
                                           dev['developer_log_start_time'], '%H:%M')})
        return hours_list

    def get__count__hours_per_week(self, this_day=datetime.now()):
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)
        results = self._tasks.find({
            "creation_date": {
                "$gte": start,
                "$lt": end}})
        count = datetime.strptime("00:00", '%H:%M')
        for record in results:
            for dev in record["assigned_for"]:
                if "developer_log_start_time" in dev and "developer_log_end_time" in dev:
                    diff = datetime.strptime(dev['developer_log_end_time'], '%H:%M') - \
                           datetime.strptime(dev['developer_log_start_time'], '%H:%M')
                    count += diff
        return count.month * 30 * 24 + count.day * 24 + count.hour

    def get__count__per_week(self, this_day=datetime.now()):
        """ count of tickets/tasks on this week """
        start = this_day - timedelta(days=this_day.weekday() + 2)
        end = start + timedelta(days=6)
        results = self._tasks.find({
            "creation_date": {
                "$gte": start,
                "$lt": end}}).count()
        return results

    def get__count__per_type(self, user_id):
        """get count per type"""
        types = self._tasks.distinct("type")
        count = []
        for t in types:
            if user_id == 'all':
                count.append(
                    self._tasks.find({
                        "type": t
                    }).count()
                )
            else:
                count.append(
                    self._tasks.find({
                        "creator_id": user_id,
                        "type": t
                    }).count()
                )
        return types, count

    def get__count__per_category(self, user_id):
        categories = self._tasks.distinct("category")
        count = []
        for category in categories:
            if user_id == 'all':
                count.append(
                    self._tasks.find({
                        "category": category
                    }).count()
                )
            else:
                count.append(
                    self._tasks.find({
                        "category": category,
                        "creator_id": user_id
                    }).count()
                )
        return categories, count

    def get__user__per_category(self, ):
        all_devs = self.db.users.find({"role": "developer"})
        devs_data = []

        for i in all_devs:
            dev_data = {}
            dev_data["username"] = i["username"]
            dev_tasks = self._tasks.find({"assigned_for.developer_id": i["_id"]})
            for j in dev_tasks:
                if j["specialization"] in dev_data:
                    dev_data[j["specialization"]] += datetime.strptime(j['assigned_for'][0]['developer_log_end_time'],
                                                                       '%H:%M') - datetime.strptime(
                        j['assigned_for'][0]['developer_log_start_time'], '%H:%M')
                else:
                    if 'developer_log_end_time' in j['assigned_for'][0] and 'developer_log_start_time' in \
                            j['assigned_for'][0]:
                        dev_data[j["specialization"]] = datetime.strptime(
                            j['assigned_for'][0]['developer_log_end_time'], '%H:%M') - datetime.strptime(
                            j['assigned_for'][0]['developer_log_start_time'], '%H:%M')
            devs_data.append(dev_data)

        for d in devs_data:
            for s in d:
                if type(d[s]) is not str:
                    d[s] = d[s].total_seconds() // 3600
        return devs_data
