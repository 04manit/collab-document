from flask import Flask, request, jsonify, render_template, send_file
from faker import Faker
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import SyncGrant


app = Flask(__name__)
fake = Faker()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/token')
def generate_token():
    #add your twilio credentials 
    TWILIO_ACCOUNT_SID = 'AC0f1c074b8876ae06a1f2cb7d456e9036'
    TWILIO_SYNC_SERVICE_SID = 'ISce465a44d31e40d4579825d62040cb90'
    TWILIO_API_KEY = 'SKe145d879e3fda227488a71277bca9c5b'
    TWILIO_API_SECRET = 'D8Uwn6ZGa2CMiFSfJgH9rol6p1iWSDeo'

    username = request.args.get('username', fake.user_name())
    token = AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, identity=username)
    sync_grant_access = SyncGrant(TWILIO_SYNC_SERVICE_SID)
    token.add_grant(sync_grant_access)
    return jsonify(identity=username, token=token.to_jwt().decode())


@app.route('/', methods=['POST'])
def download():
    data = request.form['text']

    with open('workfile.txt', 'w') as f:
        f.write(data)

    file_name = 'workfile.txt'

    return send_file(file_name, as_attachment=True)



if __name__ == "__main__":
    app.run(host='localhost', port='5001', debug=True)

