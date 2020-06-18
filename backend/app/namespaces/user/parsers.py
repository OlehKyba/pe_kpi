from flask_restplus import reqparse


def update_user_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, location='json')
    parser.add_argument('surname', type=str, location='json')
    parser.add_argument('club', type=str, location='json')
    parser.add_argument('group', type=str, location='json')

    return parser
