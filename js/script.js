const MAX_SCREEN_LENGTH = 50;
const MAX_HISTORY_COUNT = 20;
const OPERATORS = ['+', '-', '*', '/', '%'];
const OPERATION_HISTORY_KEY = "operation_history";

const history = JSON.parse(localStorage.getItem(OPERATION_HISTORY_KEY)) || [];

let latestResult = null;

const historyPanel = document.getElementById('history-panel');
const screen = document.getElementById('screen');
const keypad = document.getElementById('keypad');

const isInputKey = (key) => {
    const isDigit = key >= '0' && key <= '9';
    const isOperatorOrSymbol = [...OPERATORS, '.'].includes(key);

    return isDigit || isOperatorOrSymbol;
};

document.addEventListener('keydown', (event) => {
    const keyboardInput = event.key;
    if (isInputKey(keyboardInput)) {
        appendInput(keyboardInput);
        return;
    }

    switch (keyboardInput) {
        case 'Enter':
        case '=':
            event.preventDefault();
            calculateResult();
            break;

        case 'Backspace':
            deletePreviousInput();
            break;

        case 'Escape':
            clearScreen();
            break;
    }
});

const appendInput = (input) => {
    const displayedValue = screen.value;
    const lastInput = screen.value.slice(-1);
    const numbers = screen.value.split(/[\+\-\*\/]/);
    const currentNumber = numbers[numbers.length - 1];

    if (displayedValue.length >= MAX_SCREEN_LENGTH) return;
    if (input === '0' && (displayedValue === '0' || currentNumber === '0')) return;
    if (isDecimalInvalid(input, lastInput, displayedValue, currentNumber)) return;
    if (isOperatorInvalid(input, displayedValue, lastInput)) return;
    
    if (displayedValue === '0' || displayedValue === 'Infinity') {
        screen.value = input;
        return;
    }

    screen.value += input;
}

const isDecimalInvalid = (input, lastInput, displayedValue, currentNumber) => {
    if (input === '.') {
        if (displayedValue === '0' || displayedValue === 'Infinity') {
            screen.value = '0' + input;
            return true;   
        }

        if (OPERATORS.includes(lastInput)) {
            screen.value += '0.';
            return true;
        }

        if (currentNumber.includes('.')) return true;
    }
}

const isOperatorInvalid = (input, displayedValue, lastInput) => {
    if (OPERATORS.includes(input)) {
        if (input === lastInput || displayedValue === 'Infinity') return true;

        if (displayedValue === '-') {
            screen.value = '0' + input;
            return true;   
        }

        if (displayedValue === '0') {
            if (input === '-') {
                screen.value = input;
                return true;
            } else {
                screen.value += input;
                return true;
            }
        }

        if ([...OPERATORS, '.'].includes(lastInput)) {
            screen.value = screen.value.slice(0,-1) + input;
            return true;
        }
    }
}

const clearScreen = () => screen.value = '0';

const deletePreviousInput = () => {
    if (screen.value.length > 1) {
        screen.value = screen.value.slice(0, -1);
    } else {
        screen.value = '0';
    }
}

const calculateResult = () => {
    const expression = screen.value;

    if (!isValidOperation(expression)) {
        return;
    }

    try {
        const result = math.evaluate(expression);
        screen.value = result;

        updateHistoryOnScreen(expression, result);
        latestResult = String(result);
        console.log(latestResult);
    } catch (error) {
        console.error('Error al evaluar la expresión:', error);
        screen.value = 'Error';
    }
}

const isValidOperation = (expression) => {
    if (expression === '0') {
        return false;
    }

    const lastChar = expression.slice(-1);
    const invalidOperatorsAtEndOfExpression = OPERATORS.filter(op => op !== '%');
    
    if (invalidOperatorsAtEndOfExpression.includes(lastChar)) {
        return false;
    }

    if (latestResult === expression) {
        return false;
    }

    return true;
}

const updateHistoryOnScreen = (expression, result) => {
    if (history.length >= MAX_HISTORY_COUNT) history.shift();
    const historyPanelList = document.getElementById('history-list');

    history.push(`${expression} = ${result}`);
    localStorage.setItem(OPERATION_HISTORY_KEY, JSON.stringify(history));

    historyPanelList.innerHTML = history
        .map(entry => `<div class="history-item">${entry}</div>`)
        .join('');
        
    console.log(history);
}

const showHistory = () => {
    if (history.length > 0) {
        historyPanel.classList.toggle('hidden');
        document.getElementById('calculator').classList.toggle('history-open');
    }
}

keypad.addEventListener('click', (event) => {
    const buttonPressed = event.target.closest('button');
    if (!buttonPressed) return;

    const { type, value } = buttonPressed.dataset;

    switch (type) {
        case 'char':
            appendInput(value);
            break;
        case 'ac':
            clearScreen();
            break;
        case 'back':
            deletePreviousInput();
            break;
        case 'equals':
            calculateResult();
            break;
        case 'history':
            showHistory();
            break;
    }
});