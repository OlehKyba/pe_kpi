from click import command
from random import sample, randint
from datetime import datetime, timedelta
from flask.cli import with_appcontext

from .extentions import db
from .models import User, UserStatus, Standard


@command(name='create_db')
@with_appcontext
def create_tables():
    db.create_all()


@command(name='drop_db')
@with_appcontext
def drop_tables():
    db.drop_all()


@command(name='user')
@with_appcontext
def test_user():

    test = User.query.filter_by(email='test.user@test.com').first()

    if not test:
        test_user_data = {
            'name': 'Name',
            'surname': 'Surname',
            'email': 'test.user@test.com',
            'group': 'Test',
            'club': 'Sport',
            'status': UserStatus.active,
        }

        test_password = 'test'

        user = User(**test_user_data)
        user.set_password(test_password)

        db.session.add(user)

        length = 50
        start = datetime.strptime("01-09-2019", "%d-%m-%Y")
        end = datetime.strptime("30-06-2020", "%d-%m-%Y")
        date_generated = [start + timedelta(days=x) for x in range(0, (end - start).days)]

        well_being_dates = sample(date_generated, length)
        pull_up_dates = sample(date_generated, length)

        for date in date_generated:
            standard = Standard(type='Пульс', date=date, value=randint(60, 85))
            standard.user = user
            db.session.add(standard)

        for date in well_being_dates:
            well_being = Standard(type='Самовідчуття', date=date, value=randint(1, 6))
            well_being.user = user
            db.session.add(well_being)

        for date in pull_up_dates:
            pull_up = Standard(type='Підтягування', date=date, value=randint(1, 18))
            pull_up.user = user
            db.session.add(pull_up)

        db.session.commit()


commands = [create_tables, drop_tables, test_user]
