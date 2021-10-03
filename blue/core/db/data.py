class Data:
    def __init__(self, db=None):
        self._data = db.data
        pass
    
    def insert_data(self, params):
        data_row = {
            "_id": "{}--{}--{}--{}".format(
                params['intent'],
                params['user_fullname'].replace(" ", "-").lower(),
                params['project_name'].replace(" ", "-").lower(),
                self._data.count() + 1),
            "project_id": params['project_id'],
            "user_id": params['user_id'],
            "data_type": params['data_type'],
            "text": params['text'], "intent": params['intent'], "entities": params['entities']}
        self._data.insert_one(data_row)
        pass
    def update_data(self,):
        pass
    def delete_data(self,):
        pass
    
    def get_data(self, params):
        return self._data.find(params)
    def get_data__id(self, datum_id):
        return self._data.find_one({"_id": datum_id})
    def get_data__user_id(self, user_id):
        return self._data.find({"user_id": user_id})
    def get_data__project_id(self, project_id):
        return self._data.find({'project_id': project_id})
    def get_data_count__project_id(self, project_id, params={}):
        q = params
        q['project_id'] = project_id
        return self._data.find(params).count()