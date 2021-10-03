# class Tree:
#     connections = []
#     root = Node('root', 'root')
#     def __init__(self):
#         pass
#     def push(self, new_branch):
#         last_node = self.root
#         for i in new_branch:
#             if '##' in i:
#                 continue
#             else:
#                 n = Node(i, i)
#                 self.connections.append(Connection(last_node, n))
#                 last_node = n
#         pass
#     def get_all(self):
#         for i in self.connections:
#             print('{} > {}'.format(i.node_one.name, i.node_two.name))
#     def get_connected_to(self, name=''):
#         all_nodes = []
#         for i in self.connections:
#             if i.node_one.name == name:
#                 all_nodes.append(i.node_two)
#         return all_nodes        

# class Node:
#     def __init__(self, name='', value=''):
#         self.name = name
#         self.value = value

# class Connection:
#     def __init__(self, node_one, node_two):
#         self.node_one = node_one
#         self.node_two = node_two

class Tree(object):
    
    def __init__(self):
        pass
    def add_nodes(self, nodes):
        self._nodes = nodes
        pass
    def add_connections(self, connections):
        self._connections = connections
        pass
    def get_node_connected_to(self, node_id):
        _connected_nodes = []
        for i in self._connections:
            if self._connections[i]['to'][0] == node_id:
                _connected_nodes.append(self._connections[i]['from'][0])
        return _connected_nodes
    def if_node_connected_to(self, node_id):
        _connected_nodes = []
        for i in self._connections:
            if self._connections[i]['to'][0] == node_id:
                return True
    def get_node_with_id(self, node_id):
        for i in self._nodes:
            if i == node_id:
                return self._nodes[i]
    def get_node_with_title(self, node_title):
        for i in self._nodes:
            if self._nodes[i]['title'][0] == node_title:
                return self._nodes[i]
            
    def get_nodes_from_connection(self):
        pass