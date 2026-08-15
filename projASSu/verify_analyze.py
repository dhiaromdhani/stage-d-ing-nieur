import app as app_module
client = app_module.app.test_client()
resp = client.post('/analyze', json={'prompt': 'tester'})
print(resp.status_code)
print(resp.get_json())
