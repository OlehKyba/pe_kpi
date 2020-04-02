#!/bin/sh

flask db upgrade
python manage.py run --host 0.0.0.0