/**
 * Zjednodušený todo-list, technika FOREVER-IFRAME (with old).
 * @author Matej Paulech <matej.paulech@gmail.com>
 */

/**
 * Vytvorí objekt s todočkom. Todočku sa automaticky vygeneruje ID a dátum vytvorenia. 
 *
 * @constructor
 * @param {string} text Text nového todočka
 */
var Todo = function (text) {
	this['date'] = Date.now();
	this['id'] = this['date'].toString() + Math.floor(Math.random()*1000);
	this['text'] = text;
	return this;
};

module.exports = Todo;