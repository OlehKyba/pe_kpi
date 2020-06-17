from flask_restplus.fields import String, DateTime, Float

from . import standards_api

create_standard_req = standards_api.model('CreateStandardRequest', {
    'type': String(required=True, max_length=100),
    'date': DateTime(required=True),
    'value': Float(required=True, min=0),
})

create_standard_res = standards_api.model('CreateStandardResponse', {
    'id': String(required=True),
    'msg': String(required=True),
})

update_standard_req = standards_api.model('UpdateStandardRequest', {
    'type': String(max_length=100, default=None),
    'date': DateTime(default=None, dt_format='iso8601'),
    'value': Float(min=0, default=None),
})

standard_model = standards_api.model('StandardResponse', {
    'id': String(attribute='public_id', required=True),
    'type': String(required=True, max_length=100),
    'date': DateTime(required=True),
    'value': Float(required=True, min=0),
})
