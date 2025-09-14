from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'tejasbhosale@1304'
app.config['MYSQL_DB'] = 'registration'

mysql = MySQL(app)

@app.route("/")
def home():
    return redirect(url_for("registration"))

@app.route('/registration', methods=["GET", "POST"])
def registration():
    """Handle both GET and POST requests for registration"""
    if request.method == 'GET':
        return render_template('index.html', msg="")
    
    # Handle POST request (form submission)
    if request.method == 'POST':
        try:
            # Handle JSON data from the updated JavaScript
            if request.is_json:
                data = request.get_json()
                username = data.get('username', '').strip()
                email = data.get('email', '').strip()
                phone = data.get('phone', '').strip()
                college = data.get('college', '').strip()
            else:
                # Handle traditional form data (fallback)
                username = request.form.get("username", "").strip()
                email = request.form.get("email", "").strip()
                phone = request.form.get("phone", "").strip()
                college = request.form.get("college", "").strip()
            
            print(f"Received registration: {username}, {email}, {phone}, {college}")
            
            # Validation
            validation_error = validate_registration_data(username, email, phone, college)
            if validation_error:
                if request.is_json:
                    return jsonify({
                        'success': False,
                        'message': validation_error
                    }), 400
                else:
                    return render_template('index.html', msg=validation_error)
            
            # Database operations
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            
            # Check if user already registered (by email)
            cursor.execute('SELECT * FROM registration_details WHERE email = %s', (email,))
            account = cursor.fetchone()
            
            if account:
                error_msg = "This email is already registered!"
                cursor.close()
                if request.is_json:
                    return jsonify({
                        'success': False,
                        'message': error_msg
                    }), 409
                else:
                    return render_template('index.html', msg=error_msg)
            
            # Insert new registration
            cursor.execute(
                "INSERT INTO registration_details (username, email, phone, college, registration_date) VALUES (%s, %s, %s, %s, %s)", 
                (username, email, phone, college, datetime.now())
            )
            mysql.connection.commit()
            cursor.close()
            
            print(f"Registration successful for {email}")
            
            # Success response
            if request.is_json:
                return jsonify({
                    'success': True,
                    'message': 'Registration successful! Redirecting to confirmation page...',
                    'redirect_url': f'/success?email={email}'
                }), 200
            else:
                return redirect(url_for("success", email=email))
                
        except Exception as e:
            print(f"Database error: {str(e)}")
            error_msg = "An error occurred during registration. Please try again."
            
            if request.is_json:
                return jsonify({
                    'success': False,
                    'message': error_msg
                }), 500
            else:
                return render_template('index.html', msg=error_msg)

@app.route("/success")
def success():
    """Render success page with email parameter"""
    email = request.args.get('email', '')
    return render_template("success.html", email=email)

def validate_registration_data(username, email, phone, college):
    """Validate registration form data"""
    
    # Check if all fields are provided
    if not all([username, email, phone, college]):
        return "Please fill in all required fields."
    
    # Validate name length
    if len(username) < 2:
        return "Name must be at least 2 characters long."
    
    # Validate email format
    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_pattern, email):
        return "Please enter a valid email address."
    
    # Validate phone number
    phone_clean = re.sub(r'[^\d]', '', phone)  # Remove non-numeric characters
    if len(phone_clean) < 10:
        return "Please enter a valid phone number (at least 10 digits)."
    
    # Validate college name length
    if len(college) < 2:
        return "College name must be at least 2 characters long."
    
    return None  # No validation errors

@app.route('/api/check-email', methods=['POST'])
def check_email():
    """API endpoint to check if email is already registered"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'available': True})
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT id FROM registration_details WHERE email = %s', (email,))
        account = cursor.fetchone()
        cursor.close()
        
        return jsonify({
            'available': account is None,
            'message': 'Email is already registered!' if account else 'Email is available'
        })
        
    except Exception as e:
        print(f"Email check error: {str(e)}")
        return jsonify({'available': True, 'error': 'Could not check email availability'})

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html', msg="Page not found. Please register below."), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return render_template('index.html', msg="Internal server error. Please try again."), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)