// js file

const pythonKeywords = [
    "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class",
    "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
    "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return",
    "try", "while", "with", "yield", "print", "len", "range", "list", "dict", "set", "tuple",
    "int", "float", "str", "open", "input", "enumerate", "zip", "map", "filter", "sum", "min",
    "max", "sorted", "abs", "all", "any", "bool", "callable", "chr", "ord", "divmod", "exec",
    "format", "hasattr", "getattr", "setattr", "isinstance", "issubclass", "vars"
  ];

// Register Python-specific hint helper
CodeMirror.registerHelper("hint", "python", function(editor) {
const cur = editor.getCursor();
const token = editor.getTokenAt(cur);
const start = token.start;
const end = token.end;
const word = token.string;

// Filter and prioritize suggestions based on the entered text
let list = pythonKeywords
    .filter(kw => kw.includes(word)) // Only include items containing the typed word
    .sort((a, b) => {
        // Sort by exact match first, then alphabetically
        if (a.startsWith(word) && !b.startsWith(word)) return -1;
        if (!a.startsWith(word) && b.startsWith(word)) return 1;
        return a.localeCompare(b);
});

return {
    list: list,
    from: CodeMirror.Pos(cur.line, start),
    to: CodeMirror.Pos(cur.line, end)
};
});

const editor = CodeMirror(document.getElementById('editor'), {
    mode: "python",
    lineNumbers: true,
    theme: "default",
    extraKeys: { "Ctrl-Space": "autocomplete" } // Trigger autocomplete with Ctrl-Space
});

editor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive && /^[a-zA-Z_]+$/.test(event.text[0])) {  // Autocomplete if input is alphanumeric
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

let userInputs = [];  // To store inputs sequentially
let codeRunning = false;

function executeCode() {
    const code = editor.getValue();
    userInputs = [];
    codeRunning = true;

    document.getElementById('output').textContent = '';  // Clear output area
    fetchCodeExecution(code);
}

function fetchCodeExecution(code, inputs = '') {
    fetch('/run_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, inputs: inputs })
    })
    .then(response => response.json())
    .then(data => {
        if (data.prompt) {
            displayOutput(data.output);  // Display output up to prompt
            promptForInput(data.prompt);
        } else {
            displayOutput(data.output, true);  // Final output product
        }
    });
}

function displayOutput(output, end = false) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerText = output;  // Append new output
    if (end) codeRunning = false;
}

function promptForInput(promptText) {
    // document.getElementById('output').innerText += promptText + "\n";
    const inputField = document.getElementById('user-input');
    // Added start
    const outputDiv = document.getElementById('output');
    // Show the prompt text with input field
    outputDiv.innerText += `${promptText} `; // Add prompt text with a space after
    // Added end
    inputField.style.display = 'block';
    inputField.focus();
}

function handleInput(event) {
    if (event.key === 'Enter' && codeRunning) {
        const inputField = document.getElementById('user-input');
        const userValue = inputField.value;

        // Update the prompt line with the entered value
        const outputDiv = document.getElementById('output');
        // outputDiv.innerText = outputDiv.innerText.replace(/:\>\s*$/, `:> ${userValue}\n`);
        const lastPrompt = outputDiv.innerText.split('\n').pop();
        outputDiv.innerText = outputDiv.innerText.slice(0, -lastPrompt.length) + `${lastPrompt.trim()} ${userValue}\n`;

        userInputs.push(userValue); // Add input to the list
        fetchCodeExecution(editor.getValue(), userInputs.join('\n'));

        inputField.value = ''; // Clear input field for next prompt if needed
        inputField.style.display = 'none'; // Hide input field
    }
}

function clearEditor() {
    editor.setValue('');
    document.getElementById('output').textContent = '';
    document.getElementById('user-input').style.display = 'none';
    userInputs = [];
}