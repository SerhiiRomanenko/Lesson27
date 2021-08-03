// 'use strict';

///////////************ SELECTORS

const todoTotal = document.querySelector('.todo__total');
const complitedTasks = document.querySelector('.todo__completed');
const $todoButton = document.querySelector('.todo__addTask');
const $todoInfo = document.querySelector('.todo__info');
const $todoTitle = document.querySelector('.todo__title');
const $todoText = document.querySelector('.todo__text');

class List {
    notes = new Array();

    addNote(obj) {
        this.notes.push(obj);
    }

    delNote(value) {
        this.notes = this.notes.filter(note => note.title !== value);
    }
}

class TodoList extends List {
    addNote(title, text, status = false) {
        const isNotUnique = this.isNotUnique({ title, text });

        if (isNotUnique) {
            throw new Error('This value exists');
        }
        const obj = {
            title,
            text,
            status,
        };
        super.addNote(obj);
    }
    delNote() {
        super.addNote();
    }

    isNotUnique({ title, text }) {
        const note = this.notes.find(note => {
            if (title === note.title || text === note.text) {
                return true;
            }
        });
        return !!note;
    }

    getStatistic() {
        const result = {
            allTasks: 0,
            completedTasks: 0,
        };

        this.notes.forEach(note => {
            if (note.status === false) {
                result.completedTasks++;
                result.allTasks++;
            } else {
                result.allTasks++;
            }
        });
        return result;
    }
}

class ContactList extends List {
    addNote(name, surname, number) {
        const obj = {
            name,
            surname,
            number,
        };
        super.addNote(obj);
    }
}

const myToDo = new TodoList();
// console.log(myToDo);

const myContacts = new ContactList();
myContacts.addNote('Serhii', 'Romanenko', 38096112342);
myContacts.addNote('Anya', 'Zhavoronkova', 380506754333);
myContacts.delNote('Anya');
// console.log(myContacts);

///////////************** FUNCTIONS

function showTodoList() {
    const $ul = document.createElement('ul');
    $ul.classList.add('todo__list');
    myToDo.notes.forEach(item => {
        const $li = document.createElement('li');
        $li.classList.add(i);
        $li.innerHTML = item.title + ' - ' + item.text;
        $ul.append($li);
    });
    $todoInfo.after($ul);
}

function addTodoTask() {
    if ($todoTitle.value.trim() !== '' && $todoText.value.trim() !== '') {
        myToDo.addNote($todoTitle.value, $todoText.value);
        $todoTitle.value = '';
        $todoText.value = '';
        todoTotal.innerHTML = myToDo.getStatistic().allTasks;
        complitedTasks.innerHTML = myToDo.getStatistic().completedTasks;
        showTodoList();
    } else {
        console.log('You need to put some text');
    }
}

///////////************* EVENT LISTENERS

$todoButton.addEventListener('click', function (event) {
    event.preventDefault();
    addTodoTask();
    console.log(myToDo);
});

// class List {
//     #notes = [
//         {
//             title: 'clean up',
//             text: 'clean rooms',
//             status: true,
//         },
//         {
//             name: 'Anya',
//             surname: 'Romanenko',
//             phone: 380736952547,
//         },
//     ];

//     constructor(list) {
//         this.notes = list.notes;
//     }

//     // getComplite() {
//     //     return this.#notes;
//     // }

//     addNote(title, text) {
//         const isNotUnique = this.isNotUnique({ title, text });

//         if (isNotUnique) {
//             throw new Error('This value exists');
//         }

//         const note = {
//             title,
//             text,
//             status: false,
//         };
//         this.notes.push(note);
//     }

//     delNote(value) {
//         this.notes = this.notes.filter(note => note.title !== value);
//     }

//     editNote(value, payload) {
//         const note = this.notes.find(note => note.title === value);

//         if (!note) {
//             throw new Error(`This note doesn't exists`);
//         }

//         const isNotUnique = this.isNotUnique(payload);

//         if (isNotUnique) {
//             throw new Error('This value exists');
//         }

//         note.title = payload.title || note.title;
//         note.text = payload.text || note.text;
//     }

//     isNotUnique({ title, text }) {
//         const note = this.notes.find(note => {
//             if (title === note.title || text === note.text) {
//                 return true;
//             }
//         });
//         return !!note;
//     }
// }

// class TodoList extends List {
//     constructor(list) {
//         super(list);
//         // this.notes = options.notes;
//     }
//     getStatistic() {
//         const result = {
//             completedTasks: 0,
//             uncompletedTasks: 0,
//         };

//         this.notes.forEach(note => {
//             if (note.status) {
//                 result.completedTasks++;
//             } else {
//                 result.uncompletedTasks++;
//             }
//         });
//         return result;
//     }

//     setAsDone() {}
// }

// class ContactList extends List {
//     constructor(list) {
//         super(list);
//     }
//     searchInfo(value) {
//         let result = this.notes.find(item => item.name === value || item.surname === value || item.phone === value);
//         if (result) {
//             return result;
//         }
//         return "I didn't find it";
//     }
// }

// const myToDo = new TodoList(toDo);
// myToDo.addNote('cook', 'cook some food');
// myToDo.addNote('help brother', 'repair a chair');
// myToDo.addNote('relax', 'have fun time with friends');
// myToDo.delNote('cook');
// myToDo.editNote('relax', { title: 'Do HW', text: 'Edit toDo' });
// console.log(myToDo.getStatistic());
// console.log(myToDo);

// const myContacts = new ContactList(contacts);
// console.log(myContacts.searchInfo('Anya'));
// console.log(myContacts);
// myContacts.addNote('cook', 'cook some food');
// // console.log(myToDo.getComplite());
