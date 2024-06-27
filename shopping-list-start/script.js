const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;



function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


function onAddItemSubmit (e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === '') {
        alert("please add an item");
        return;
    }

    // Check edit mode

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('.edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExist(newItem)) {
            alert('Item already exists');
            return;
        }
    }


    
    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Addnew item to array
    itemsFromStorage.push(item);

    // Convert to JSONstring and set to localStorage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

function createButton (classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon (classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function getItemsFromStorage () {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
        } else {
            itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    
    return itemsFromStorage;
}

// parentElement is for to target an element whose parent is a button of a class 'remove-item'. Usin g the console.log could help to know if we are targetin the correct element

// The parent Element is doubled below because we're hiting a parentElement that will be the buttomn and then another parentElement, which will be the list-item itself

function onClickItem(e) {
    if (e.target.parentElement.classList.contains ('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExist (item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}


// THIS IS FOR EDIT ANY ITEM IN THE LIST
function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem (item) {
    if (confirm('Are you sure?')) {
        // remove item from DOM
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}

function removeItemFromStorage (item) {
    let itemsFromStorage = getItemsFromStorage();
    
    // Filter out item to be removed

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function filterItems (e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach((item)  => { 
        const itemName = item.firstChild.textContent.toLocaleLowerCase();

        // I'll use indexOf and put text with the method, so what's going to happen is if the text that's typed in matches the item name. So if I put an A there and any of these have an A, then it's going to be true. If not, then it's going to be a negative one. If doesn't match, it'll be -1
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function clearItems () {
    // itemList.innerHTML = ''; you can do this but there's a better way

    // firstChild - while the item list, the ul has a first child, which is going to be the first item, then we want to remove that by taking the item list and we'll use the remove child because we're using it on the item list, which is the ul and then pass in the first child
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // CLear from localstorage

    localStorage.removeItem('items');

    checkUI();
}

function checkUI () {

        itemInput.value = '';

    // using querySelectorAll is a nodelist (which similar as an array)
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add item';
    formBtn.style.bacckgroundColor = '#333';

    isEditMode = false;
}

// Initialize app

function init() {

// Event listeners
itemForm.addEventListener ('submit', onAddItemSubmit);
itemList.addEventListener ('click', onClickItem);
clearBtn.addEventListener ('click', clearItems);
itemFilter.addEventListener ('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

// This is in the global scope because I want this to run when the page loads
checkUI();
}

init();