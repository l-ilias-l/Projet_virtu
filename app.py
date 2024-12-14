from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb://database:27017/')
db = client.calendar_app

@app.route('/events', methods=['POST'])
def add_event():
    data = request.json
    db.events.insert_one(data)
    return jsonify({'message': 'Event added!'}), 201

@app.route('/events', methods=['GET'])
def get_events():
    events = list(db.events.find({}, {'_id': 0}))
    return jsonify(events)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
