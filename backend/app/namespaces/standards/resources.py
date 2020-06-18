from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask_restplus import Resource, marshal
from flask_jwt_extended import jwt_required, get_current_user

from . import standards_api
from .parsers import get_standards_parser, update_standard_parser
from .models import create_standard_req, create_standard_res, standard_model

from app.extentions import db
from app.models import Standard


get_parser = get_standards_parser()
update_parser = update_standard_parser()


@standards_api.route('/')
class StandardsResource(Resource):

    MESSAGE_409 = 'Invalid query params'
    MESSAGE_201 = 'Standard successfully created'

    @jwt_required
    @standards_api.expect(get_parser)
    def get(self):
        current_user = get_current_user()
        date = get_parser.parse_args()
        day, month, year = date['day'], date['month'], date['year']

        query = current_user.standards
        start_date = {}
        finish_date = {}

        if day:
            if not month or not year:
                return {'msg': self.MESSAGE_409}, 409

            relative_delta = relativedelta(day=1)
            if (datetime(year, month, 1) + relativedelta(day=31)).day == day:
                relative_delta = relativedelta(hours=23)

            start_date = {'day': day, 'month': month, 'year': year}
            finsh = datetime(year, month, day) + relative_delta
            finish_date = {'day': finsh.day, 'month': finsh.month, 'year': finsh.year}

        elif month:
            if not year:
                return {'msg': self.MESSAGE_409}, 409

            finsh = datetime(year, month, 1) + relativedelta(day=31)
            start_date = {'day': 1, 'month': month, 'year': year}
            finish_date = {'day': finsh.day, 'month': month, 'year': year}

        elif year:
            start_date = {'day': 1, 'month': 1, 'year': year}
            finish_date = {'day': 31, 'month': 12, 'year': year}

        if len(start_date) > 0:
            start, finish = datetime(**start_date), datetime(**finish_date)
            query = query.filter(Standard.date.between(start, finish))

        standards = query.order_by(Standard.date).all()

        return marshal(standards, standard_model, envelope='data'), 200

    @jwt_required
    @standards_api.expect(create_standard_req, validate=True)
    def post(self):
        current_user = get_current_user()
        new_standard = standards_api.payload
        standard = Standard(**new_standard)
        standard.user = current_user

        db.session.add(standard)
        db.session.commit()
        return marshal({'msg': self.MESSAGE_201, 'id': str(standard.public_id)}, create_standard_res), 201


@standards_api.route('/<string:public_id>')
class AccurateStandardResource(Resource):

    MESSAGE_403 = 'The standard does not belong to the user'

    @jwt_required
    @standards_api.expect(update_parser)
    def put(self, public_id):
        current_user = get_current_user()
        standard = current_user.standards.filter_by(public_id=public_id).first()

        if not standard:
            return {'msg': self.MESSAGE_403}, 403

        standard_data = update_parser.parse_args()

        for key in standard_data:
            value = standard_data[key]
            if value:
                setattr(standard, key, value)

        db.session.commit()
        return {}, 204

    @jwt_required
    def delete(self, public_id):
        current_user = get_current_user()
        standard = current_user.standards.filter_by(public_id=public_id).first()

        if not standard:
            return {'msg': self.MESSAGE_403}, 403

        db.session.delete(standard)
        db.session.commit()
        return {}, 204
