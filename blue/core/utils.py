import json
import os


def get_config(type):
    with open('./blue/core/db/config_data/manager_configs.json', 'r') as json_file:  
        data = json.load(json_file)
        return data[type]


def format_tasks(task_list):
    pass


def word_count(text: str) -> list:
    """generates word cloud data"""
    words_list = text.split(" ")
    words_set = set(words_list)
    count = []
    for word in words_set:
        count.append({"text": word, "size": words_list.count(word)})
    return count
