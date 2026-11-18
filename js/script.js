const MAX_SCREEN_LENGTH = 20;
const MAX_HISTORY_COUNT = 5;
const OPERATORS = ['+', '-', '*', '/', '%'];

const history = [];

const historyPanel = document.getElementById('history-panel');
const screen = document.getElementById('screen');
const keypad = document.getElementById('keypad');

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

    try {
        const result = math.evaluate(expression);
        screen.value = result;

        updateHistoryOnScreen(expression, result);
    } catch (error) {
        console.error('Error al evaluar la expresión:', error);
        screen.value = 'Error';
    }
}

const updateHistoryOnScreen = (expression, result) => {
    if (history.length >= MAX_HISTORY_COUNT) history.shift();

    history.push(`${expression} = ${result}`);
    historyPanel.innerHTML = history
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