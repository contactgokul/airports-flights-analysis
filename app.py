import os 
from flask import Flask, render_template, url_for, json

from flask import Flask, jsonify
from flask import Flask, render_template


app = Flask(__name__)

hello_string = {"Hello": "World!"}


@app.route("/")
def index():
    
    return render_template("index.html")

@app.route("/Airportlogicindex")
def Airportlogicindex():

    return render_template("Airportlogicindex.html")


@app.route("/curvedpathindex")
def curvedpathindex():

    return render_template("curvedpathindex.html")

@app.route("/barracechartindex")
def barracechartindex():

    return render_template("barracechartindex.html")

if __name__ == "__main__":
    app.run(debug=True)

