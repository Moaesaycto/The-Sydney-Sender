from flask import Flask, jsonify, request, make_response, render_template
import threading, webbrowser
from main import generate;

app = Flask(__name__)
PORT = 5114
HOST = "127.0.0.1"

@app.route('/') 
def index(): 
     return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
     req = request.get_json()
     return make_response(jsonify(generate(req)), 200)

if __name__ == '__main__':
    url = "http://{0}:{1}/".format(HOST, PORT)
    threading.Timer(0.1, lambda: webbrowser.open(url) ).start()
    app.run(host=HOST, port=PORT, debug=False)