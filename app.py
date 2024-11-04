from flask import Flask, render_template, request, jsonify
import subprocess

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aladinh00-01montext'

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/run_code', methods=['POST'])
def run_code():
    data = request.json
    code = data.get('code')
    inputs = data.get('inputs', '')

    try:
        # Execute the code safely with timeout
        result = subprocess.run(
            ["python", "-c", code],  
            input=inputs, text=True, capture_output=True, timeout=5
        )
        # Get stdout and stderr to include error messages in output
        output = result.stdout or result.stderr
        prompt = None if result.returncode == 0 else " "  # Checks if there was an error

    except subprocess.TimeoutExpired:
        output = "OOPS!! Execution timed out!"
        prompt = None
    except Exception as e:
        output = f"An error occurred: {e}"
        prompt = None

    return jsonify(output=output, prompt=prompt)

if __name__ == '__main__':
    app.run(debug=True)
