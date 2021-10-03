class Projects:
    def __init__(self, db=None):
        self._projects = db.projects
        pass
    def insert_project(self,):
        pass
    def update_project(self,):
        pass
    def delete_project(self,):
        pass
    
    def get_name__id(self, project_id):
        return self._projects.find_one({"_id": project_id})['name']
    def get_project_by_id(self, project_id):
        return self._projects.find_one({"_id": project_id})
    def get_projects_by_owner_id(self, owner_id):
        return self._projects.find({"owner": owner_id})
    def get_projects_by_worker_id(self, user_id):
        return self._projects.find({'users.user_id': user_id})
    def get_project_domain(self, project_id):
        return self._projects.find_one({'_id': project_id})['p_domain']
    def get_project_users(self, project_id):
        return self._projects.find_one({'_id': project_id})['users']
    def get_project_owner(self, project_id):
        return self._projects.find_one({'_id': project_id})['owner']
    def get_prject_settings(self, project_id):
        return self._projects.find_one({'_id': project_id})['p_settings']
    def get_project_configs(self, project_id):
        return self._projects.find_one({'_id': project_id})['p_config']
    def insert_project__domain_intent(self, project_id, intent):
        p = self._projects.find_one({'_id': project_id})
        p['p_domain']['intents'].append(intent)
        return self._projects.replace_one({"_id": project_id}, p)
    def insert_project__domain_entity(self, project_id, entity, slot=False):
        p = self._projects.find_one({'_id': project_id})
        p['p_domain']['entities'].append(entity)
        if slot:
            p['p_domain']['slots'][entity] = {'type': 'text'}
        return self._projects.replace_one({"_id": project_id}, p)
