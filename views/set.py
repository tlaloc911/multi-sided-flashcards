from flask import Blueprint, render_template, redirect, url_for
set_blueprint = Blueprint('set', __name__, template_folder='templates')
from sqlalchemy.orm import sessionmaker
from queries import get_set, delete_set

@set_blueprint.route('/<int:set_id>') 
def set(set_id):
    # Session = sessionmaker(bind=engine)
    # session = Session()
    set = get_set(set_id)
    set_info = set.get_card_info()
    # session.close()
    # print(set_info)
    # return "you clicked set #" + str(set_id)
    return render_template('set.html', set=set, set_info=set_info)

@set_blueprint.route('/<int:set_id>/edit')
def edit(set_id):
    # Session = sessionmaker(bind=engine)
    # session = Session()
    set = get_set(set_id)
    # session.close()
    return render_template('set-edit.html', set=set)

@set_blueprint.route('/<int:set_id>/study')
def study(set_id):
    # Session = sessionmaker(bind=engine)
    # session = Session()
    set = get_set(set_id)
    # session.close()
    return render_template('set-study.html', set=set)

@set_blueprint.route('/<int:set_id>/delete')
def delete(set_id):
    # Session = sessionmaker(bind=engine)
    # session = Session()
    delete_set(set_id)
    # session.close()
    return redirect(url_for('home.home'))