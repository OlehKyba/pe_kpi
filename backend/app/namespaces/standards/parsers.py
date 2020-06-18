from flask_restplus import reqparse
from flask_restplus.inputs import datetime_from_iso8601


def get_standards_parser():
    get_parser = reqparse.RequestParser()
    get_parser.add_argument('month', type=int, help='Month should be an integer!')
    get_parser.add_argument('year', type=int, help='Year should be an integer!')
    get_parser.add_argument('day', type=int, help='Year should be an integer!')
    return get_parser


def update_standard_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('type', type=str, location='json')
    parser.add_argument('date', type=datetime_from_iso8601, location='json')
    parser.add_argument('value', type=float, location='json')
    return parser
