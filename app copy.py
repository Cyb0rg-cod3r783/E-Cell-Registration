from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL  # Correct import
import MySQLdb.cursors

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'tejasbhosale@1304'
app.config['MYSQL_DB'] = 'registration'

mysql = MySQL(app)

@app.route("/")
def home():
    return redirect(url_for("registration"))

@app.route('/registration', methods = ["GET", "POST"])
def registration():
    msg = ""

    if request.method == 'POST':
        username = request.form["username"]
        email = request.form["email"]
        phone = request.form["phone"]
        college = request.form["college"]
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM registration_details WHERE username = %s', (username,))
        account = cursor.fetchone()
        if account: 
            msg = "You are already registered!"
        
        else:
            cursor.execute("INSERT INTO registration_details (username, email, phone, college) VALUES (%s, %s, %s, %s)", (username, email, phone, college))
            mysql.connection.commit()
            return redirect(url_for("success"))
        
    return render_template('index.html', msg = msg)

@app.route("/success")
def success():
    return render_template("success.html")


if __name__ == '__main__':
    app.run(debug=True)  # debug=True for development, disable in production

