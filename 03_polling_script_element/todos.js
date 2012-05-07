/**
 * Zjednodušený todo-list, technika POLLING <script> ELEMENT.
 * @author Matej Paulech <matej.paulech@gmail.com>
 */

// Závislosti
var Todo = require('./todo');

/**
 * Velmi zjednodušený (a neefektívny!) objekt pre uchovávanie todočiek.
 * V skutočnej aplikácii by bola použitá databáza.
 *
 * @constructor
 */
var Todos = function () {
	this.todos = [];
};

/**
 * Pridá nové todo do databázy
 *
 * @param {string} text Text nového todočka
 */
Todos.prototype.add = function (text) {
	var todo = new Todo(text);
	this.todos.push(todo);
	return todo;
};

/**
 * Vrati pole todočiek vytvorených v zadanom časovom intervale
 *
 * @param {number} since Timestamp od ktorého majú byť získavané správy (v sekundách)
 * @param {number} to Timestamp do ktoreho majú byť získavané správy (v sekundách)
 * @return {Array.<Object.<number, string, string>>} Pole objektov s todočkami.
 */
Todos.prototype.getSince = function (since, to) {
	return this.todos.filter(function (todo) {
		return todo['date'] > since && todo['date'] <= to;
	});
};

module.exports = Todos;