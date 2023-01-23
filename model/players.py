""" database dependencies to support sqliteDB examples """
from random import randrange
from datetime import date
import os, base64
import json

from __init__ import app, db
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash


''' Tutorial: https://www.sqlalchemy.org/library.html#tutorials, try to get into Python shell and follow along '''

# Define the User class to manage actions in the 'users' table
# -- Object Relational Mapping (ORM) is the key concept of SQLAlchemy
# -- a.) db.Model is like an inner layer of the onion in ORM
# -- b.) User represents data we want to store, something that is built on db.Model
# -- c.) SQLAlchemy ORM is layer on top of SQLAlchemy Core, then SQLAlchemy engine, SQL
class Player(db.Model):
    __tablename__ = 'players'  # table name is plural, class name is singular

    # Define the User schema with "vars" from object
    id = db.Column(db.Integer, primary_key=True)
    _name = db.Column(db.String(255), unique=False, nullable=False)
    _country = db.Column(db.String(255), unique=True, nullable=False)

    # constructor of a User object, initializes the instance variables within object (self)
    def __init__(self, name, country):
        self._name = name    # variables with self prefix become part of the object, 
        self._country = country

    # a name getter method, extracts name from object
    @property
    def name(self):
        return self._name
    
    # a setter function, allows name to be updated after initial object creation
    @name.setter
    def name(self, name):
        self._name = name
    
    # a getter method, extracts email from object
    @property
    def country(self):
        return self._country
    
    # a setter function, allows name to be updated after initial object creation
    @country.setter
    def country(self, country):
        self._country = country
        
    # check if uid parameter matches user id in object, return boolean
    def is_country(self, country):
        return self._country == country
    
    
    # output content using str(object) in human readable form, uses getter
    # output content using json dumps, this is ready for API response
    def __str__(self):
        return json.dumps(self.read())

    # CRUD create/add a new record to the table
    # returns self or None on error
    def create(self):
        try:
            # creates a person object from User(db.Model) class, passes initializers
            db.session.add(self)  # add prepares to persist person object to Users table
            db.session.commit()  # SqlAlchemy "unit of work pattern" requires a manual commit
            return self
        except IntegrityError:
            db.session.remove()
            return None

    # CRUD read converts self to dictionary
    # returns dictionary
    def read(self):
        return {
            "id": self.id,
            "name": self.name,
            "country": self.country,
        }

    # CRUD update: updates user name, password, phone
    # returns self
    def update(self, name="", country=""):
        """only updates values with length"""
        if len(name) > 0:
            self.name = name
        if len(country) > 0:
            self.country = country
        db.session.commit()
        return self

    # CRUD delete: remove self
    # None
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return None


"""Database Creation and Testing """


# Builds working data for testing
def initPlayers():
    """Create database and tables"""
    db.create_all()
    """Tester data for table"""
    p1 = Player(name='Thomas Edison', country='toby')
    p2 = Player(name='Nicholas Tesla', country='niko')
    p3 = Player(name='Alexander Graham Bell', country='lex')
    p4 = Player(name='Eli Whitney', country='whit')
    p5 = Player(name='John Mortensen', country='jm1021')

    players = [p1, p2, p3, p4, p5]

    """Builds sample user/note(s) data"""
    for player in players:
        player.create()
            