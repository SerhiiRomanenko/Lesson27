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

class renderContactBook {
    form = document.querySelector('.contact-form');
    list = document.querySelector('.contact__list');
    searchForm = document.querySelector('.contact__search');

    constructor() {
        this.model = new ContactList();

        this.initializeFormSubmit();
        this.initializeShowingList();
        this.initializeRemovingNotice();
        this.initializeSearchSubmit();
    }

    initializeFormSubmit() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            const $nameInput = document.querySelector('.contact__name');
            const $surnameInput = document.querySelector('.contact__surname');
            const $number = document.querySelector('.contact__number');

            if ($nameInput.value.trim() && $surnameInput.value.trim() && $number.value.trim()) {
                this.model.add({ name: $nameInput.value, surname: $surnameInput.value, number: $number.value });
                this.initializeShowingList();
            }
            $nameInput.value = '';
            $surnameInput.value = '';
            $number.value = '';
        });
    }

    initializeShowingList() {
        const fragment = new DocumentFragment();

        this.model.repository.forEach(item => {
            const $li = document.createElement('li');
            $li.dataset.id = item.id;

            $li.innerHTML = `<span title='Click to edit'>
            ${item.name} ${item.surname} ${item.number}</span>
            <button>Remove notice</button>`;
            fragment.appendChild($li);
        });
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
    }

    initializeRemovingNotice() {
        this.list.addEventListener('click', ({ target }) => {
            const li = target.closest('li');

            switch (target.tagName) {
                case 'BUTTON':
                    this.model.del(+li.getAttribute('data-id'));
                    this.initializeShowingList();
                    break;

                case 'SPAN':
                    const $nameInput = document.querySelector('.contact__name');
                    const $surnameInput = document.querySelector('.contact__surname');
                    const $numberInput = document.querySelector('.contact__number');
                    const span = target.closest('span');
                    const contactInfo = span.innerHTML.trim().split(' ');

                    $nameInput.value = contactInfo[0];
                    $surnameInput.value = contactInfo[1];
                    $numberInput.value = contactInfo[2];

                    this.model.del(+li.getAttribute('data-id'));
            }
        });
    }
    initializeSearchSubmit() {
        const $showAll = document.querySelector('.contact__show-all');
        this.searchForm.addEventListener('submit', e => {
            e.preventDefault();

            const $searchInput = document.querySelector('.contact__input');
            if ($searchInput.value.trim()) {
                const filtredContacts = this.model.searchContact($searchInput.value);
                console.log(filtredContacts);

                const fragment = new DocumentFragment();
                filtredContacts.forEach(item => {
                    const $li = document.createElement('li');
                    $li.dataset.id = item.id;

                    $li.innerHTML = `<span title='Click to edit'>
            ${item.name} ${item.surname} ${item.number}</span>
            <button>Remove notice</button>`;
                    fragment.appendChild($li);
                });
                this.list.innerHTML = '';
                this.list.appendChild(fragment);
            }
            $searchInput.value = '';
        });
        $showAll.addEventListener('click', e => {
            e.preventDefault();

            this.initializeShowingList();
        });
    }
}

new RenderToDoList();
new renderContactBook();
