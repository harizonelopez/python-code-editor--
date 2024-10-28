from flask import Flask, render_template, request, jsonify
import subprocess

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aladinh00-01montext'

@app.route('/')
def home():
    return render_template('home.html')

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
        output_lines = result.stdout.splitlines()
        combined_output = []

        # Separate prompts and user inputs
        input_lines = inputs.splitlines()
        input_idx = 0

        for line in output_lines:
            if "Enter" in line and input_idx < len(input_lines):  # Check for prompts
                combined_output.append(f"{line} {input_lines[input_idx]}")  # Combine prompt with input
                input_idx += 1
            else:
                combined_output.append(line)  # Append any other output

        output = "\n".join(combined_output)

        # output = result.stdout
        prompt = None if result.returncode == 0 else " "

    except subprocess.TimeoutExpired:
        output = "Execution timed out!"
        prompt = None

    return jsonify(output=output, prompt=prompt)

if __name__ == '__main__':
    app.run(debug=True)
