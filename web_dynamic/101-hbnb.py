#!/usr/bin/python3
"""
Flask application that serves the 101-hbnb page with state, city, and amenity filters, and reviews.
"""
from flask import Flask, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place
import uuid

# Flask application setup
app = Flask(__name__)

@app.teardown_appcontext
def close_db(error):
    """
    Closes the SQLAlchemy session after each request.
    """
    storage.close()

@app.route('/101-hbnb/', strict_slashes=False)
def hbnb_filters():
    """
    Renders the 101-hbnb.html template with states, cities, amenities, places, and reviews.
    """
    # Fetch all states, amenities, and places
    states = storage.all(State).values()
    states = sorted(states, key=lambda x: x.name)

    # Prepare a list of states with their cities
    st_ct = [[state, sorted(state.cities, key=lambda x: x.name)] for state in states]

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda x: x.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda x: x.name)

    # Generate a unique cache identifier
    cache_id = str(uuid.uuid4())

    # Render the 101-hbnb.html template with the context
    return render_template('101-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)

if __name__ == "__main__":
    """
    Main function to run the Flask application.
    """
    app.run(host='0.0.0.0', port=5001)
