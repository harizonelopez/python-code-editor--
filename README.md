# Python Code Editor

This ia a Python code compiler that allows users to code and run Python code snippets in real time, directly from their browser. The application is built using Flask for the backend, with an interactive interface for writing, submitting, and viewing code execution results.

## Features

 **Real-time Code Execution** 
   - Runs Python code snippets entered by the user.

 **User Input Handling**
   - Supports multiple prompts within the code for user inputs.

 **Integrated Output Display**
   - Displays code output and entered inputs together in a single output area.

 **Responsive UI**
   - A clean, minimalistic design for easy use and readability.

 **Code Editor**
   - Uses CodeMirror for syntax highlighting and line numbering.

 **Timeout Protection**
   - Prevents infinite loops and hangs with an execution timeout.

## Prerequisites

- **Python** (v3.6+)
- **Flask** (v2.0+)
- **CodeMirror** (included in the frontend dependencies)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/harizonelopez/python-compiler-app.git
   `cd python-compiler-app`
   ```

2. Run the application:
   ```bash
   `python app.py`

3. Access the Application

   - Open your browser and go to `http://127.0.0.1:5000` to access the application.
