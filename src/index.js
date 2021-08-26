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
        let result = new Array();
        this.repository.forEach(item => {
            if (
                item.name.search(value) !== -1 ||
                item.surname.search(value) !== -1 ||
                item.number.search(value) !== -1
            ) {
                result.push(item);
            }
        });
        return result;
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

            let $span = document.createElement('span');
            $span.className = `text${$li.dataset.id}`;
            $span.innerHTML = item.text;
            let $input = document.createElement('input');
            $input.className = `check${$li.dataset.id}`;
            $input.setAttribute('type', 'checkbox');
            if (item.isDone === true) {
                $input.setAttribute('checked', 'true');
            }

            let $button = document.createElement('button');
            $button.innerHTML = 'Remove notice';
            $button.className = `remove${$li.dataset.id}`;
            $li.innerHTML = $span.outerHTML + $input.outerHTML + $button.outerHTML;
            fragment.appendChild($li);
        });
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
    }

    initializeRemovingNotice() {
        this.list.addEventListener('click', ({ target }) => {
            const li = target.closest('li');
            switch (target.className) {
                case `remove${li.dataset.id}`:
                    if (window.confirm('Do you really want to delete item?')) {
                        this.model.del(+li.getAttribute('data-id'));
                        this.initializeShowStatistic();
                        this.initializeShowingList();
                    }

                    break;

                case `check${li.dataset.id}`:
                    this.model.setAsDoneNotice(+li.getAttribute('data-id'));
                    this.initializeShowStatistic();
                    this.initializeShowingList();
                    break;

                case `text${li.dataset.id}`:
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

            let $span = document.createElement('span');
            $span.className = `text${$li.dataset.id}`;
            $span.title = 'Click to edit';
            $span.innerHTML = `${item.name} ${item.surname} ${item.number}`;

            let $button = document.createElement('button');
            $button.className = `remove${$li.dataset.id}`;
            $button.innerHTML = 'Remove notice';

            $li.innerHTML = $span.outerHTML + $button.outerHTML;

            fragment.appendChild($li);
        });
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
    }

    initializeRemovingNotice() {
        this.list.addEventListener('click', ({ target }) => {
            const li = target.closest('li');

            switch (target.className) {
                case `remove${li.dataset.id}`:
                    if (window.confirm('Do you really want to delete item?')) {
                        this.model.del(+li.getAttribute('data-id'));
                        this.initializeShowingList();
                    }

                    break;

                case `text${li.dataset.id}`:
                    const $nameInput = document.querySelector('.contact__name');
                    const $surnameInput = document.querySelector('.contact__surname');
                    const $numberInput = document.querySelector('.contact__number');

                    this.model.repository.forEach(item => {
                        if (item.id === +li.dataset.id) {
                            $nameInput.value = item.name;
                            $surnameInput.value = item.surname;
                            $numberInput.value = item.number;
                        }
                    });

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

                const fragment = new DocumentFragment();
                filtredContacts.forEach(item => {
                    const $li = document.createElement('li');
                    $li.dataset.id = item.id;

                    const $span = document.createElement('span');
                    $span.title = 'Click to edit';
                    $span.innerHTML = `${item.name} ${item.surname} ${item.number}`;

                    const $button = document.createElement('button');
                    $button.innerHTML = 'Remove notice';

                    $li.innerHTML = $span.outerHTML + $button.outerHTML;
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
