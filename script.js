const inputFormId = 'input';
const outputFormId = 'output';
const selectOptions = ['text', 'number', 'datetime-local', 'color'];
const labelMapping = {
    "text": 'Insert text: ',
    "number": 'Insert number: ',
    "datetime-local": "Insert date and time: ",
    "color": "Choose color: "
};
let json = [];

const drawItems = (parent, children) => {
    children.forEach(x => parent.appendChild(x));
}

const createForm = (id) => {
    const form = document.createElement('form');
    form.dataset.id = id;

    if(id === inputFormId) {
        drawItems(form, createSelect('type', selectOptions));
        drawItems(form, [createButton('Add Field')]);
    }
    else if(id === outputFormId) {
        const fieldset = document.createElement('fieldset');
        fieldset.dataset.id = outputFormId + '-fieldset';
        drawItems(form, [fieldset, createButton('Compose JSON')]);
    }
    
    return [form];
}

const createSelect = (name, options) => {
    const select = document.createElement('select');
    select.name = name;
    const defaultOption = document.createElement('option');
    defaultOption.value = '0';
    defaultOption.default = true;
    defaultOption.innerText = 'Please choose: ';

    drawItems(select, [
        defaultOption,
        ...options.map(x => {
            const option = document.createElement("option");
            option.innerHTML = x
            option.value = x

            return option
        })
    ])
    return [select];
}

const createInput = (type) => {
    const formInput = document.createElement('div');
    formInput.classList.add('form-input');
    const inputId = Date.now();
    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.innerText = labelMapping[type];
    const input = document.createElement('input');
    input.id = inputId;
    input.name = `${type}_${inputId}`;
    input.type = type;
    drawItems(formInput, [label, input]);
    return [formInput];
}

const createButton = (text) => {
    const button = document.createElement('button');
    button.innerText = text;
    return button;
}

const inputFormSubmitHandler = (e, outputForm) => {
    const outputFieldset = outputForm.querySelector('fieldset[data-id='+outputFormId+'-fieldset]');
    let fieldValue = e.target.querySelector('select').value;
    if(fieldValue !== '0') {
        let newInput = createInput(fieldValue);
        drawItems(outputFieldset, newInput)
        fieldValue = '0';
    }
}

const outputFormSubmitHanlder = (_, outputForm) => {
    json = [];
    const inputs = outputForm.querySelectorAll('input');
    if(inputs.length !== 0) {
        [...inputs].forEach(x => {
            json.push({"name": x.name, "value": x.value})
        });
        console.log(JSON.stringify(json));
    } else return;
        
}

const submitHandlerMapping = {
    'input': inputFormSubmitHandler,
    'output': outputFormSubmitHanlder,
};

const main = () => {
    const app = document.getElementById('root');

    drawItems(app, createForm(inputFormId));
    drawItems(app, createForm(outputFormId));
    
    const outputForm = document.querySelector("[data-id="+outputFormId+"");

    app.addEventListener('submit', (event) => {
        event.preventDefault();
        if(typeof submitHandlerMapping[event.target.dataset.id] === "function") {
            submitHandlerMapping[event.target.dataset.id](event, outputForm);
        }
    })
}

window.addEventListener("load", main)