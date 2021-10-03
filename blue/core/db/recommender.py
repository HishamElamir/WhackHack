from datetime import datetime, timedelta
import random

from ..utils import get_config


class Recommend:
    def __init__(self, db=None):
        self.db = db
        self._recommender = db.r_mappings
        pass

    @property
    def recommender(self):
        return self._recommender

    def get_similar(self, text="", limit=10):
        print(text)
        cursor = self._recommender.find({"$text": {"$search": text}},
                                        {'score': {'$meta': 'textScore'}})
        cursor.sort([('score', {'$meta': 'textScore'})])
        return cursor
