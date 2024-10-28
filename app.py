from flask import Flask, render_template, request, jsonify
import subprocess
import docker  # For Docker-based execution, if using containers

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/run_code', methods=['POST'])
def run_code():
    code = request.json.get('code')
    language = request.json.get('language')
    
    # Simple example for executing Python code locally
    if language == "python":
        try:
            result = subprocess.run(
                ["python", "-c", code],
                capture_output=True, text=True, timeout=5
            )
            output = result.stdout or result.stderr
        except subprocess.TimeoutExpired:
            output = "Execution timed out!"
    # Add Docker container-based execution logic here for better isolation
    
    return jsonify(output=output)

if __name__ == '__main__':
    app.run(debug=True)
