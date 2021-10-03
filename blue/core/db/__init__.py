import pymongo


def connect(host='localhost', port=27017, db='ttrack'):
    client = pymongo.MongoClient(host, port)
    c = client[db]
    return c
