import os
import json
import pandas as pd

class Db:
    def __init__(self, db_name='', key_name=''):
        self.key_name = key_name
        self.db_name = db_name
        db_path = os.path.join('./blue/db/', '{}.json'.format(db_name))
        if os.path.isfile(db_path):
            with open(db_path, 'r') as database_filereader:
                self.data = json.load(database_filereader)[key_name]
        else:
            print("ERROR: No such database created")
        pass
    def insert(self, row):
        self.data.append(row)
        pass

    def update(self, user_id, row):
        for i in range(0, len(self.data)):
            if self.data[i]['user_id'] == user_id:
                self.data[i] = row
        pass
    def delete(self):
        pass
    def is_exist(self, key_value_pair):
        flags = 0
        for row in self.data:
            for i in key_value_pair:
                if key_value_pair[i] == row[i]:
                    flags += 1
        if flags == len(key_value_pair):
            return True
        else:
            return False
    def get_all(self, key_value_pair):
        pass
    def get(self, key_value_pair):
        fetched_rows = []
        flags = 0
        for row in self.data:
            for i in key_value_pair:
                if key_value_pair[i] == row[i]:
                    flags += 1
            if flags == len(key_value_pair):
                fetched_rows.append(row)
                flags = 0
        return fetched_rows
    
    def get_by_colname(self, name, value):
        for row in self.data:
            if row[name] == value:
                return row
        return False
    def close(self):
        pass

