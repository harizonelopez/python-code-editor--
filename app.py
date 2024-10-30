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
        result = subprocess.run(
            ["python", "-c", code],
            input=inputs, text=True, capture_output=True, timeout=5
        )
        output = result.stdout
        prompt = None if result.returncode == 0 else " "

    except subprocess.TimeoutExpired:
        output = "Execution timed out!"
        prompt = None

    return jsonify(output=output, prompt=prompt)

if __name__ == '__main__':
    app.run(debug=True)
