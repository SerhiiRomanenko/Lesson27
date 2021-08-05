'use strict';

class List {
    repository = new Array();

    add(object) {
        const id = Date.now();
        const item = {
            id,
            ...object,
        };

        this.repository.push(item);
    }

    del(id) {
        this.repository = this.repository.filter(item => item.id !== id);
    }

    edit(id, payload) {
        this.repository = this.repository.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    ...payload,
                };
            } else {
                return item;
            }
        });
    }
}

class TodoList extends List {
    addNotice(text) {
        if (!this.#isUnique(text)) {
            super.add({ text, isDone: false });
        } else {
            throw new Error('The value is not Unique');
        }
    }

    editNotice(id, text) {
        if (!this.#isUnique(text)) {
            super.edit(id, { text });
        } else {
            throw new Error('The value is not Unique');
        }
    }

    setAsDoneNotice(id) {
        this.repository = this.repository.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    isDone: true,
                };
            } else {
                return item;
            }
        });
    }

    getStatistic() {
        const doneNotice = this.repository.filter(item => item.isDone === true);

        return {
            totalNotice: this.repository.length,
            doneNotice: doneNotice.length,
        };
    }

    #isUnique(text) {
        return Boolean(this.repository.find(item => item.text === text));
    }
}

class ContactList extends List {
    searchContact(value) {
        return this.repository.filter(item => Object.values(item).includes(value));
    }
}

class RenderToDoList {
    form = document.querySelector('.todo-form');
    list = document.querySelector('.todo__list');

    constructor() {
        this.model = new TodoList();

        this.initializeFormSubmit();
        this.initializeRemovingNotice();
        this.initializeShowStatistic();
    }

    initializeFormSubmit() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            const $input = document.querySelector('.todo__text');

            if ($input.value.trim()) {
                this.model.addNotice($input.value);
                this.initializeShowingList();
            }
            $input.value = '';
            this.initializeShowStatistic();
        });
    }

    initializeShowingList() {
        const fragment = new DocumentFragment();

        this.model.repository.forEach(item => {
            console.dir(this.list.childNodes);
            const $li = document.createElement('li');
            $li.dataset.id = item.id;
            let checkedOrNot;

            if (item.isDone === true) {
                checkedOrNot = 'checked';
            }

            $li.innerHTML = `<span title='Click to edit'>
            ${item.text}</span>
            <input type="checkbox" ${checkedOrNot}>
            <button>Remove notice</button>`;
            fragment.appendChild($li);
        });
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
    }

    initializeRemovingNotice() {
        this.list.addEventListener('click', ({ target }) => {
            const li = target.closest('li');
            console.dir(target);

            switch (target.tagName) {
                case 'BUTTON':
                    this.model.del(+li.getAttribute('data-id'));
                    this.initializeShowStatistic();
                    this.initializeShowingList();
                    break;

                case 'INPUT':
                    this.model.setAsDoneNotice(+li.getAttribute('data-id'));
                    this.initializeShowStatistic();
                    this.initializeShowingList();
                    break;

                case 'SPAN':
                    const $input = document.querySelector('.todo__text');
                    const span = target.closest('span');
                    $input.value = '';
                    $input.value = span.innerText.trim();
                    this.model.del(+li.getAttribute('data-id'));
            }
        });
    }
    initializeShowStatistic() {
        const $statBox = document.querySelector('.todo__statistic');
        const $div = document.createElement('div');
        $statBox.innerHTML = '';
        const fragment = document.createDocumentFragment();

        $div.innerHTML = `<h2>Total: ${this.model.getStatistic().totalNotice}</h2>
        <h2>Complited: ${this.model.getStatistic().doneNotice}</h2>`;
        fragment.appendChild($div);
        $statBox.appendChild(fragment);
    }
}

new RenderToDoList();
new ContactList();
