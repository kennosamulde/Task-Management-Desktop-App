// Variables
const categoryContainer = document.querySelector('[data-category-container]');
const categoryNavContainer = document.querySelector('[data-category-nav-container]');
const categoryNavForm = document.querySelector('[data-category-nav-form]');
const categoryNavInput = document.querySelector('[data-category-nav-input]');

const quickAddModal = document.querySelector('[data-modal-container]');
const quickAddForm = document.querySelector('[data-modal-form]');
const quickAddInput = document.querySelector('[data-modal-input]');

const modalCategoryForm = document.querySelector('[data-modal-category-form]');
const modalCategoryInput = document.querySelector('[data-modal-category-input]');
const modalListForm = document.querySelector('[data-modal-list-form]');
const modalListInput = document.querySelector('[data-modal-list-input]');
const importantModal = document.querySelector('[data-modal-important]');  

const categoryPopper = document.querySelector('#modalCategory');
const listPopper = document.querySelector('#modalList');

const LOCAL_STORAGE_CATEGORIES_KEY = 'categories';
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = 'selected.category';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'selected.list';
const LOCAL_STORAGE_SELECTED_TASK_ID_KEY = 'selected.task';
const LOCAL_STORAGE_SELECTED_CATEGORY_LINK_KEY = 'selected.category.link';
const LOCAL_STORAGE_SELECTED_LIST_LINK_KEY = 'selected.list.link';

let selectedCategoryID = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY) || '';
let selectedTaskID = localStorage.getItem(LOCAL_STORAGE_SELECTED_TASK_ID_KEY) || '';
let selectedCategoryLinkID = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_LINK_KEY) || '';
let selectedListLinkID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_LINK_KEY) || '';
let categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) || [
  {
    id: Math.random().toString(36).substr(2, 9), 
    name: 'Life',
    list: [],
    items: 0,
    color: getRandomColor(),
  },
  {
    id: Math.random().toString(36).substr(2, 9), 
    name: 'Work',
    list: [],
    items: 0,
    color: getRandomColor(),
  },
  {
    id: Math.random().toString(36).substr(2, 9), 
    name: 'Finance',
    list: [],
    items: 0,
    color: getRandomColor(),
  },
];

// Save to Local Storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY, selectedCategoryID);
  localStorage.setItem(LOCAL_STORAGE_SELECTED_TASK_ID_KEY, selectedTaskID);
  localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_LINK_KEY, selectedCategoryLinkID);
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_LINK_KEY, selectedListLinkID);
}

// Global UI
function modalUI() {
  const modal = document.querySelector('.quick-add');
  const container = document.querySelector('.container');
  
  document.addEventListener('click', (e) => {
    let quickAddBtn = e.target.closest('.quick-add-btn');
    let closeBtn = e.target.closest('.close-quick-add');
    let closeBg = e.target.closest('.quick-add__bg');
    let checkBoxMain = e.target.closest('.task__head__checkbox');
  
    if (quickAddBtn) {
      modal.style.display = 'block';
      container.style.filter = 'blur(3px)';
    } else if (closeBtn || closeBg) {
      modal.style.display = 'none';
      container.style.filter = 'none';
    } else if (checkBoxMain) {
      let id =  checkBoxMain.dataset.id;
      let selectedTask = getTask(id);
      selectedTask.isCompleted =  checkBoxMain.checked;
      let checkBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

      let selectedCheckBoxes = checkBoxes.filter(checkBox => checkBox.dataset.id === id);
      selectedCheckBoxes.forEach(checkBox => {
        checkBox.checked = selectedTask.isCompleted;
      });
      save();
    }
  });
  getModalLinks();
}

// Render popper category list
function renderPopperCategory() {
  let id = selectedCategoryLinkID;
  clearContainer(categoryPopper);
  categories.forEach(category => {
    const popperItem = `
    <li class= "${category.id === id ? 'active' : ''}" data-id="${category.id}" data-category-link>
      <h3 class="heading-3">${category.name}</h3>
      <span>
      <svg xmlns="http://www.w3.org/2000/svg" width="15.622" height="11.65" viewBox="0 0 15.622 11.65">
        <path id="Icon_awesome-check" data-name="Icon awesome-check" d="M5.306,16,.229,10.921a.781.781,0,0,1,0-1.1l1.1-1.1a.781.781,0,0,1,1.1,0l3.42,3.42,7.326-7.326a.781.781,0,0,1,1.1,0l1.1,1.1a.781.781,0,0,1,0,1.1L6.411,16A.781.781,0,0,1,5.306,16Z" transform="translate(0 -4.577)" fill="#484DF9"/>
      </svg>         
      </span>
    </li>
    `;
    categoryPopper.insertAdjacentHTML('beforeend', popperItem);
  });
}

// Render popper list list
function renderPopperList() {
  let id = selectedListLinkID;
  clearContainer(listPopper);
  let selectedCategory = categories.find(category => category.id === selectedCategoryLinkID);
  if (selectedCategory) {
    selectedCategory.list.forEach(list => {
      const popperItem = `
      <li class= "${list.id === id ? 'active' : ''}" data-id="${list.id}" data-list-link>
        <h3 class="heading-3">${list.name}</h3>
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="15.622" height="11.65" viewBox="0 0 15.622 11.65">
          <path id="Icon_awesome-check" data-name="Icon awesome-check" d="M5.306,16,.229,10.921a.781.781,0,0,1,0-1.1l1.1-1.1a.781.781,0,0,1,1.1,0l3.42,3.42,7.326-7.326a.781.781,0,0,1,1.1,0l1.1,1.1a.781.781,0,0,1,0,1.1L6.411,16A.781.781,0,0,1,5.306,16Z" transform="translate(0 -4.577)" fill="#484DF9"/>
        </svg>         
        </span>
      </li>
      `;
      listPopper.insertAdjacentHTML('beforeend', popperItem);
    });
  }
}

// Get Modal links
function getModalLinks() {
  const lists = document.querySelectorAll('[data-modal-list]');
  lists.forEach(list => {
    list.addEventListener('click', (e) => {
      if (list.id === "modalCategory") {
        let links = document.querySelectorAll('[data-category-link]');
        let link = e.target.closest('[data-category-link]');
        let id = link.dataset.id;
        selectedCategoryLinkID = id;
        links.forEach(link => {      
          link.classList.remove('active');
        });
        link.classList.add('active');
      } else if (list.id === "modalList") {
        let links = document.querySelectorAll('[data-list-link]');
        let link = e.target.closest('[data-list-link]');
        let id = link.dataset.id;
        selectedListLinkID = id;
        links.forEach(link => {
          link.classList.remove('active');
        });
        link.classList.add('active');
      }
      saveAndRender();
    });
  });
}

// Quick add
quickAddModal.addEventListener('submit', (e) => {
  e.preventDefault();
  let taskName = quickAddInput.value;
  let categoryID = selectedCategoryLinkID;
  let listID = selectedListLinkID;
  if (!taskName) {return}
  const task = createTask(taskName);
  if (importantModal.classList.contains('active')) {
    task.isImportant = true;
  } else {
    task.isImportant = false;
  }
  const category = categories.find(category => category.id === categoryID);
  const list = category.list.find(list => list.id === listID).list;
  list.push(task);
  quickAddInput.value = '';
  saveAndRender();
});

quickAddModal.addEventListener('click', (e) => {
  let impModal = e.target.closest('[data-modal-important]');
  if (impModal) {
    impModal.classList.toggle('active');
  }
});


// Add category
[categoryNavForm, modalCategoryForm].forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let input = form.firstElementChild.nextElementSibling;
    addCategory(input);
  });
});

function addCategory(input) {
  let categoryName = input.value;
  if (!categoryName) return;
  const category = createCategory(categoryName);
  categories.push(category);
  input.value = '';
  saveAndRender();
}

// Get selected category
categoryNavContainer.addEventListener('click', (e) => {
  let linkId = e.target.closest('[data-cnav-links]').dataset.id;
  selectedCategoryID = linkId;
  saveAndRender();
});

// Category events
categoryContainer.addEventListener('click', (e) => {
  let accordion = e.target.closest('.accordion__list');
  let taskItem = e.target.closest('.task__item');
  let checkBox = e.target.closest('.task__item__checkbox');
  let deleteCategory = e.target.closest('[data-delete-category]');
  let deleteList = e.target.closest('[data-delete-list]');
  let important = e.target.closest('[data-important]');

  if (accordion) {
    let id = accordion.dataset.id;
    let selectedCategory = categories.find(category => category.id === selectedCategoryID);
    let selectedList = selectedCategory.list.find(list => list.id === id);
    accordion.classList.toggle('active');
    let panel = accordion.parentElement.parentElement.nextElementSibling;
    panel.classList.toggle('active');

    if (panel.classList.contains('active')) {
      selectedList.isActive = true;
    } else {
      selectedList.isActive = false;
    }
    save();

  } else if (checkBox) {
    let id = checkBox.dataset.id;
    let selectedTask = getTask(id);
    selectedTask.isCompleted = checkBox.checked;
    let checkBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  
    let selectedCheckBoxes = checkBoxes.filter(checkBox => checkBox.dataset.id === id);
    selectedCheckBoxes.forEach(checkBox => {
      checkBox.checked = selectedTask.isCompleted;
    });
    save();

  } else if (important) {
    let id = important.dataset.id;
    let selectedTask = getTask(id);
    if (selectedTask.isImportant === false) {
      selectedTask.isImportant = true;
    } else {
      selectedTask.isImportant = false;
    }
    important.classList.toggle('active');
    
  } else if (taskItem) {
    let tasks = document.querySelectorAll('.task__item');
    tasks.forEach(task => {
      task.classList.remove('active');
    });

    taskItem.classList.add('active');
    let itemId = taskItem.dataset.id;
    selectedTaskID = itemId;
    save();
    renderFullTask();

  } else if (deleteCategory) {
    const index = categories.findIndex(category => category.id === selectedCategoryID);
    categories.splice(index, 1);
    save();
    renderCategory();

  } else if (deleteList) {
    let id = deleteList.dataset.id;
    let categoryList = categories.find(category => category.id === selectedCategoryID).list;
    let index = categoryList.findIndex(list => list.id === id);
    categoryList.splice(index, 1);
    save();
    renderCount();
    renderList();
  }
});

// Get task
function getTask(id) {
  let categoryList = categories.find(category => category.id === selectedCategoryID).list;
  let tasks = [];

  categoryList.forEach(list => {
    list.list.map(item => {
      let task = item;
      tasks.push(task);
    });
  });

  let selectedTask = tasks.find(task => task.id === id);
  return selectedTask;
}

// Save description
let container = document.querySelector('.right');
container.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    let area = document.querySelector('.task__description');
    let id = selectedTaskID;
    let selectedTask = getTask(id);
    selectedTask.description = area.innerHTML;
  }
  save();
});

// delete task
container.addEventListener('click', (e) => {
  let deleteTask = e.target.closest('[data-delete-task]');

  if (deleteTask) {
    let id = deleteTask.dataset.id;
    let list = categories.find(category => category.id === selectedCategoryID).list;
    let tasks = [];
    list.map(item => {
      let newList = item.list;
      newList.forEach(task => {
        tasks.push(task);
      });
    });
    
    let task = tasks.find(task => task.id === id);
    let selectedList = list.find(item => item.name === task.list).list;
    let index = selectedList.findIndex(item => item.id === task.id);
    selectedList.splice(index, 1);
    selectedTaskID = '';
    save();
    renderTask();
    renderFullTask();
  }
});

// Add List or task inside dom
categoryContainer.addEventListener('submit', (e) => {
  let listForm = e.target.closest('[data-list-form]');
  let taskForm = e.target.closest('[data-task-form]');
  if (listForm) {
    e.preventDefault();
    let id = e.target.dataset.id;
    let category = categories.find(category => category.id === id);

    const listInputs = Array.from(document.querySelectorAll('[data-list-input]'));
    let listInput = listInputs.find(listInput => listInput.dataset.id === id);
    const listName = listInput.value;
    if (!listName) { return }
    const list = createList(listName);
    category.list.push(list);
    listInput.value = '';
    renderCount();
    save();
    renderList();
    renderTask();
  }
  else if (taskForm) {
  e.preventDefault();
  let accordion = taskForm.previousElementSibling.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild;

  accordion.classList.add('active');
  let panel = accordion.parentElement.parentElement.nextElementSibling;
  panel.classList.add('active');

  let id = e.target.dataset.id;
  let selectedCategory = categories.find(category => category.id === selectedCategoryID).list;
  let selectedList = selectedCategory.find(list => list.id === id);

  if (panel.classList.contains('active')) {
    selectedList.isActive = true;
  } else {
    selectedList.isActive = false;
  }

  const taskInputs = Array.from(document.querySelectorAll('[data-task-input]'));
  let taskInput = taskInputs.find(taskInput => taskInput.dataset.id === id);
  const taskName = taskInput.value;
  if (!taskName) {return}
  const task = createTask(taskName);
  selectedList.list.push(task);
  taskInput.value = '';
  save();
  renderTask();
  }
});

// Add list from modal
modalListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let listName = modalListInput.value;
  if (!listName) return;
  const list = createList(listName);
  let categoryList = categories.find(category => category.id === selectedCategoryLinkID).list;
  categoryList.push(list);
  modalListInput.value = '';
  saveAndRender();
});

// Render count
function renderCount() {
  let category = categories.find(category => category.id === selectedCategoryID);
  let counters = Array.from(document.querySelectorAll('[data-num-items]'));
  let counter = counters.find(counter => counter.dataset.id === category.id);
  counter.innerText = category.list.length;
  save();
  renderCategoryNav();
}

// Render full task
function renderFullTask() {
  const container = document.querySelector('.task__container');
  clearContainer(container);

  if (selectedTaskID) {
    let items = [];

    categories.map(category => {
      let cList = category.list;
      cList.map(list => {
        let Alllist = list.list;
        Alllist.forEach(item => {
          items.push(item);
        });
      });
    });

  let task = items.find(item => item.id === selectedTaskID);
  task.isActive = true; 
   
  const markup = `
    <div class="task ${task.isActive = true ? 'active' : ''}">
    <div class="task__head">
      <input type="checkbox" class="checkbox task__head__checkbox" ${task.isCompleted ? 'checked' : ''} data-id="${task.id}">
      <span class="task__head__checkmark"></span>
      <div class="task__head__title">
        <h3 class="heading-2 heading-3--secondary">${task.name}</h3>
        <h4 class="heading-4">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="16.634" height="16.634" viewBox="0 0 16.634 16.634">
          <g id="Icon_feather-clock" data-name="Icon feather-clock" transform="translate(-2 -2)">
            <path id="Path_30" data-name="Path 30" d="M17.634,10.317A7.317,7.317,0,1,1,10.317,3,7.317,7.317,0,0,1,17.634,10.317Z" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Path_31" data-name="Path 31" d="M18,9v4.39l2.927,1.463" transform="translate(-7.683 -3.073)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </g>
        </svg>
        </span>${task.dateCreated}</h4>
      </div>
      <div class="task__head__buttons">
        <button class="btn btn--icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 17.978 17.196">
            <path id="Icon_feather-star" data-name="Icon feather-star" d="M10.989,3l2.469,5,5.521.807L14.984,12.7l.943,5.5-4.937-2.6L6.052,18.2l.943-5.5L3,8.808,8.521,8Z" transform="translate(-2 -2)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>                      
        </button>
        <button class="btn btn--icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="17.091" height="18.768" viewBox="0 0 17.091 18.768">
            <g id="Icon_feather-calendar" data-name="Icon feather-calendar" transform="translate(-3.5 -2)">
              <path id="Path_56" data-name="Path 56" d="M6.177,6H17.914a1.677,1.677,0,0,1,1.677,1.677V19.414a1.677,1.677,0,0,1-1.677,1.677H6.177A1.677,1.677,0,0,1,4.5,19.414V7.677A1.677,1.677,0,0,1,6.177,6Z" transform="translate(0 -1.323)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_57" data-name="Path 57" d="M24,3V6.354" transform="translate(-8.601)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_58" data-name="Path 58" d="M12,3V6.354" transform="translate(-3.308)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_59" data-name="Path 59" d="M4.5,15H19.591" transform="translate(0 -5.293)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
          </svg>                
        </button>
        <button class="btn btn--icon" data-id="${task.id}" data-delete-task>
          <svg xmlns="http://www.w3.org/2000/svg" width="17.75" height="19.5" viewBox="0 0 17.75 19.5">
            <g id="Icon_feather-trash-2" data-name="Icon feather-trash-2" transform="translate(-3.5 -2)">
              <path id="Path_52" data-name="Path 52" d="M4.5,9H20.25" transform="translate(0 -2.5)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_53" data-name="Path 53" d="M19.75,6.5V18.75A1.75,1.75,0,0,1,18,20.5H9.25A1.75,1.75,0,0,1,7.5,18.75V6.5m2.625,0V4.75A1.75,1.75,0,0,1,11.875,3h3.5a1.75,1.75,0,0,1,1.75,1.75V6.5" transform="translate(-1.25)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_54" data-name="Path 54" d="M15,16.5v5.25" transform="translate(-4.375 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path id="Path_55" data-name="Path 55" d="M21,16.5v5.25" transform="translate(-6.875 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
          </svg>                
        </button>
      </div>
    </div>
    <div class="task__text-area">
      <div class="heading-3 heading-3--secondary task__description" placeholder="Type something..." contenteditable spellcheck="false" data-task-description>${task.description}</div>
    </div>
  </div>
    `;
  container.innerHTML = markup;
  }
}

// Render Task on list
function renderTask() {
  if (selectedCategoryID) {
    const taskContainers = Array.from(document.querySelectorAll('[data-task-container]'));
    const selectedCategoryList = categories.find(category => category.id === selectedCategoryID).list;
    taskContainers.forEach(taskContainer => {
      selectedCategoryList.forEach(list => {
        if (taskContainer.dataset.id === list.id) {
          clearContainer(taskContainer);
          list.list.forEach(task => {
            task.list = list.name;
            const taskElement = `
            <div class="task__item ${selectedTaskID === task.id ? 'active' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task__item__checkbox checkbox" ${task.isCompleted ? 'checked' : ''} data-id="${task.id}">
            <span class="task__item__checkmark checkmark"></span>
            <li class="task__item__text">
              <h3 class="heading-3 heading-3--secondary">${task.name}</h3>
              <h4 class="heading-4"><span><svg xmlns="http://www.w3.org/2000/svg" width="16.634" height="16.634" viewBox="0 0 16.634 16.634">
                <g id="Icon_feather-clock" data-name="Icon feather-clock" transform="translate(-2 -2)">
                  <path id="Path_30" data-name="Path 30" d="M17.634,10.317A7.317,7.317,0,1,1,10.317,3,7.317,7.317,0,0,1,17.634,10.317Z" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_31" data-name="Path 31" d="M18,9v4.39l2.927,1.463" transform="translate(-7.683 -3.073)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </g>
              </svg>
              </span>${task.dateCreated}</h4>
            </li>
            <button class="btn btn--icon ${task.isImportant === true ? 'active' : ''}" data-id="${task.id}" data-important>
              <svg xmlns="http://www.w3.org/2000/svg" width="17.978" height="17.196" viewBox="0 0 17.978 17.196">
                <path id="Icon_feather-star" data-name="Icon feather-star" d="M10.989,3l2.469,5,5.521.807L14.984,12.7l.943,5.5-4.937-2.6L6.052,18.2l.943-5.5L3,8.808,8.521,8Z" transform="translate(-2 -2)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>                      
            </button>
          </div>
            `;
            taskContainer.insertAdjacentHTML('beforeend', taskElement);
          });
        }
      });
    });
  }
}

// Render List UI
function renderList() {
  if (selectedCategoryID) {
    const containers = Array.from(document.querySelectorAll('[data-list-container]'));
    let selectedContainer = containers.find(container => container.dataset.id === selectedCategoryID);
    clearContainer(selectedContainer);
    let category = categories.find(category => category.id === selectedCategoryID);
    category.list.forEach(list => {
      list.category = category.name;
      const listElement = `
      <div class="list__item" data-id="${list.id}">
      <div class="list__item__head">
        <div class="list__item__head__title">
          <h2 class="heading-2">${list.name}</h2>
          <h4 class="heading-4">Created: <span>${list.dateCreated}</span></h4>
        </div>
        <div class="list__item__head__buttons">
          <div class="list__btn__group accordion__list ${list.isActive === false ? '' : 'active'}" data-id="${list.id}">
            <button class="btn btn--icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7.855" viewBox="0 0 14 7.855">
                <path id="Icon_ionic-ios-arrow-up" data-name="Icon ionic-ios-arrow-up" d="M13.059,16.737l5.194-5.2A.982.982,0,0,1,19.64,12.93l-5.886,5.89a.98.98,0,0,1-1.354.029L6.474,12.934A.982.982,0,0,1,7.86,11.543Z" transform="translate(-6.188 -11.251)" fill="#8385a1"/>
              </svg>       
            </button>
          </div>
          <div class="list__btn__group">
            <button class="btn btn--icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="5" viewBox="0 0 22 5">
                <g id="Group_5" data-name="Group 5" transform="translate(212 -1024) rotate(90)">
                  <circle id="Ellipse_3" data-name="Ellipse 3" cx="2" cy="2" r="2" transform="translate(1024 208)" fill="#8385A1"/>
                  <circle id="Ellipse_17" data-name="Ellipse 17" cx="2" cy="2" r="2" transform="translate(1024 199)" fill="#8385A1"/>
                  <circle id="Ellipse_18" data-name="Ellipse 18" cx="2" cy="2" r="2" transform="translate(1024 190)" fill="#8385A1"/>
                </g>
              </svg>                
            </button>
            <ul class="popper">
            <li data-id="${list.id}" data-delete-list>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 17.75 19.5">
                <g id="Icon_feather-trash-2" data-name="Icon feather-trash-2" transform="translate(-3.5 -2)">
                  <path id="Path_52" data-name="Path 52" d="M4.5,9H20.25" transform="translate(0 -2.5)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_53" data-name="Path 53" d="M19.75,6.5V18.75A1.75,1.75,0,0,1,18,20.5H9.25A1.75,1.75,0,0,1,7.5,18.75V6.5m2.625,0V4.75A1.75,1.75,0,0,1,11.875,3h3.5a1.75,1.75,0,0,1,1.75,1.75V6.5" transform="translate(-1.25)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_54" data-name="Path 54" d="M15,16.5v5.25" transform="translate(-4.375 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_55" data-name="Path 55" d="M21,16.5v5.25" transform="translate(-6.875 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </g>
              </svg>  
              <h4 class="heading-4">Delete List</h4>
            </li>
          </ul>
          </div> 
        </div>
      </div>
      <ul class="task__content ${list.isActive === false ? '' : 'active'}" data-task-container data-id="${list.id}">
      </ul>
      <form action="" class="task__form" data-task-form data-id="${list.id}" =>
        <button class="btn btn--icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
            <g id="Group_57" data-name="Group 57" transform="translate(-47 -557)">
              <rect id="Rectangle_9" data-name="Rectangle 9" width="22" height="22" rx="11" transform="translate(47 557)" fill="#e5f8fc"/>
              <path id="Icon_ionic-ios-add" data-name="Icon ionic-ios-add" d="M19.04,13.668H15.006V9.634a.669.669,0,1,0-1.338,0v4.034H9.634a.669.669,0,0,0,0,1.338h4.034V19.04a.669.669,0,0,0,1.338,0V15.006H19.04a.669.669,0,1,0,0-1.338Z" transform="translate(43.688 553.663)" fill="#484df9"/>
            </g>
          </svg>
        </button>  
        <input type="text" placeholder="Add a new task" class="heading-3" data-task-input data-id="${list.id}">
      </form>
    </div>
      `;
      selectedContainer.insertAdjacentHTML('afterbegin', listElement);
     });
  }
}

function renderCategoryNav() {
    let id = selectedCategoryID;
    clearContainer(categoryNavContainer);
    categories.forEach(category => {
      category.items = category.list.length;
      const categoryLink = `
      <li class="heading-3 cnav__list__li  ${category.id === id ? 'active' : ''}" data-id="${category.id}" data-cnav-links>
      <span class="cnav__dot" style="border: 4px solid ${category.color}"></span>
      <h3 class="heading-3">${limitTitle(category.name)}</h3>
      <span class="cnav__num heading-4" style="background: ${category.color}">${category.items}</span>
      </li>
    `;
    categoryNavContainer.insertAdjacentHTML('beforeend', categoryLink);
  });
}

// Render Category UI 
function renderCategory() {
  let id = selectedCategoryID;
  clearContainer(categoryContainer);
    categories.forEach(category => {
      category.items = category.list.length;
      const categoryElement = `
      <div class="category ${category.id === id ? 'active' : ''}" data-category data-id="${category.id}">
      <div class="category__head">
        <div class="category__title">
          <h1 class="heading-1">${category.name}</h1>
          <span class="heading-3"style="background: ${category.color}" data-num-items data-id="${category.id}">${category.items}</span>
        </div>
        <div class="category__nav">
          <ul class="nav">
            <li class="heading-3"><span class="heading-4">10</span>Lists</li>
            <li class="heading-3"><span class="heading-4">2</span>Notes</li>
            <li class="heading-3"><span class="heading-4">2</span>Files</li>
            <div></div>
          </ul>
          <div class="category__nav__controls">
            <div class="controls__group">
              <button class="btn btn--icon">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="sort-by-list">
                <path id="sort-by-list_形状结合" class="st0" d="M9.8,6.5h9.5c0.4,0,0.8,0.3,0.8,0.8S19.7,8,19.2,8H9.8C9.3,8,9,7.7,9,7.2S9.3,6.5,9.8,6.5z   M9.8,11h9.5c0.4,0,0.8,0.3,0.8,0.8s-0.3,0.8-0.8,0.8H9.8c-0.4,0-0.8-0.3-0.8-0.8S9.3,11,9.8,11z M9.8,15.5h9.5  c0.4,0,0.8,0.3,0.8,0.8S19.7,17,19.2,17H9.8C9.3,17,9,16.7,9,16.2S9.3,15.5,9.8,15.5z M5.2,17.4V5c0-0.4,0.3-0.8,0.8-0.8  S6.8,4.6,6.8,5v14c0,0.6-0.8,1-1.2,0.6l-3-2.6c-0.3-0.3-0.3-0.7-0.1-1.1s0.7-0.3,1.1-0.1L5.2,17.4z"></path>
                </svg>
              </button>
              <ul class="popper">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 17.75 19.5">
                    <g id="Icon_feather-trash-2" data-name="Icon feather-trash-2" transform="translate(-3.5 -2)">
                      <path id="Path_52" data-name="Path 52" d="M4.5,9H20.25" transform="translate(0 -2.5)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      <path id="Path_53" data-name="Path 53" d="M19.75,6.5V18.75A1.75,1.75,0,0,1,18,20.5H9.25A1.75,1.75,0,0,1,7.5,18.75V6.5m2.625,0V4.75A1.75,1.75,0,0,1,11.875,3h3.5a1.75,1.75,0,0,1,1.75,1.75V6.5" transform="translate(-1.25)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      <path id="Path_54" data-name="Path 54" d="M15,16.5v5.25" transform="translate(-4.375 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      <path id="Path_55" data-name="Path 55" d="M21,16.5v5.25" transform="translate(-6.875 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </g>
                  </svg>  
                  <h4 class="heading-4">Delete category</h4>
                </li>
              </ul>
            </div>
            <div class="controls__group">
              <button class="btn btn--icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="5" viewBox="0 0 22 5">
              <g id="Group_5" data-name="Group 5" transform="translate(212 -1024) rotate(90)">
                <circle id="Ellipse_3" data-name="Ellipse 3" cx="2" cy="2" r="2" transform="translate(1024 208)" fill="#8385A1"/>
                <circle id="Ellipse_17" data-name="Ellipse 17" cx="2" cy="2" r="2" transform="translate(1024 199)" fill="#8385A1"/>
                <circle id="Ellipse_18" data-name="Ellipse 18" cx="2" cy="2" r="2" transform="translate(1024 190)" fill="#8385A1"/>
              </g>
            </svg>     
            </button>
            <ul class="popper">
              <li data-delete-category>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 17.75 19.5">
                  <g id="Icon_feather-trash-2" data-name="Icon feather-trash-2" transform="translate(-3.5 -2)">
                    <path id="Path_52" data-name="Path 52" d="M4.5,9H20.25" transform="translate(0 -2.5)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_53" data-name="Path 53" d="M19.75,6.5V18.75A1.75,1.75,0,0,1,18,20.5H9.25A1.75,1.75,0,0,1,7.5,18.75V6.5m2.625,0V4.75A1.75,1.75,0,0,1,11.875,3h3.5a1.75,1.75,0,0,1,1.75,1.75V6.5" transform="translate(-1.25)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_54" data-name="Path 54" d="M15,16.5v5.25" transform="translate(-4.375 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_55" data-name="Path 55" d="M21,16.5v5.25" transform="translate(-6.875 -5.625)" fill="none" stroke="#cfcfcf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </g>
                </svg>  
                <h4 class="heading-4">Delete category</h4>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>
      <div class="category__content">
        <form action="" class="category__form" data-list-form data-id="${category.id}">
          <button class="btn btn--icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41">
              <g id="Group_22" data-name="Group 22" transform="translate(-115 -943)">
                <rect id="Rectangle_13" data-name="Rectangle 13" width="41" height="41" rx="20.5" transform="translate(115 943)" fill="none"/>
                <path id="Icon_ionic-ios-add" data-name="Icon ionic-ios-add" d="M25.91,16.875H19.125V10.09a1.125,1.125,0,0,0-2.25,0v6.785H10.09a1.125,1.125,0,0,0,0,2.25h6.785V25.91a1.125,1.125,0,0,0,2.25,0V19.125H25.91a1.125,1.125,0,0,0,0-2.25Z" transform="translate(118 946)" fill="#484df9"/>
              </g>
              </svg>
          </button>  
          <input type="text" placeholder="Add a new list to ${category.name}" class="heading-3" data-list-input data-id="${category.id}">
        </form>
        <div class="list" data-list-container data-id="${category.id}">
        </div>
      </div>
    </div>
      `;
      categoryContainer.insertAdjacentHTML('beforeend', categoryElement);
  });
}

// Save and Render 
function saveAndRender() {
  save();
  render();
}

// Render
function render() {
  renderCategory();
  renderCategoryNav();
  if (selectedCategoryID) {
    renderList();
    renderPopperCategory();
    renderPopperList();  
    renderTask();
    renderFullTask();
  }
}
// ClearList
function clearContainer(container) {
  if (container) {
    container.innerHTML = '';
  }
}

// Create Category
function createCategory(name) {
  return {
    id: Math.random().toString(36).substr(2, 9), 
    name: name,
    list: [],
    items: 0,
    color: getRandomColor()
  }
}

// Create List
function createList(name) {
  return {
    id: Math.random().toString(36).substr(2, 9), 
    name: name, 
    dateCreated: createDate(),
    category: '',
    list: [],
    isActive: false,
    height: ''
  }
}

// Create Task
function createTask(name) {
  return { 
    id: Math.random().toString(36).substr(2, 9), 
    name: name, 
    isCompleted: false, 
    dateCreated: createDateandTime(),
    dateScheduled: '',
    timeScheduled: '',
    isImportant: false,
    description: '',
    list: '',
    isActive: false
  }
}

// Create a date
function createDateandTime() {
  const dateAndTime = `${createDate()} • ${createTime()}`;
  return dateAndTime;
}

function createDate() {
  const today = new Date();
  const options = {weekday: "short", month: "short", day:"numeric"};
  const date = today.toLocaleDateString('en-US', options);
  return date;
}

function createTime() {
  const today = new Date();
  const hr = today.getHours() > 12 ? '0' + today.getHours() - 12 : today.getHours();
  const min = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
  let am_pm = today.getHours() >= 12 ? 'PM' : 'AM'
  const time = `${hr}:${min} ${am_pm}`;
  return time;
}

// Generate random color 
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Limit title
function limitTitle(title, limit = 10) {
  let newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  modalUI();
  saveAndRender();
});

