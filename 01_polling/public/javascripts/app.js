/**
 * Zjednodušený todo-list, technika (transportný spôsob) POLLING.
 *
 * Ukážková real-time webová aplikácia pre bakalársku prácu s témou real-time webové aplikácie
 * určená k demonštrácii real-time komunikácie klienta so serverom transporným spôsobom uvedeným vyššie.
 *
 * Aplikácia má implementované iba dve funkcie - pridanie novej úlohy a získanie úloh zo servera.
 * Aplikácia neobsahuje všetky potrebné prvky, ktoré by boli pokryté v produkčnej aplikácii, 
 * ako overovanie hodnôt získaných od užívateľa a podobne.
 *
 * Pozn. úlohy nie sú ukladané do databázy preto je ich životnosť iba po dobu spustenia aplikácie.
 *
 * @author Matej Paulech <matej.paulech@gmail.com>
 */

/**  @type {number} since Timestamp poslednej zmeny (v ms) */
var since = 0;
/**  @type {number} period Interval v ktorom sa budú zisťovať zmeny (v ms) */
var period = 10 * 1000;

/**
 * Funkcia, ktorá získa nové dáta zo servera a spracuje ich.
 */
function checkForChanges() {
	$.ajax({
		type: 'GET',
		url: 'todos',
		data: { 'since': since },
	}).done(function (data) {
		since = data['since'];
		
		data.todos.forEach(function (todo) {
			$('<li>').text(todo['text']).appendTo('#todos');
		});
		$('#status_update').text('Posledná aktualizácia: ' + new Date(data['since']));
		
		setTimeout(checkForChanges, period);
	}).fail(function () {
		$('#status_update').text('Nastala chyba pri získavaní poznámok zo serveru, skúšam znova');
		
		setTimeout(checkForChanges, period);
	});
}

$(function () {
	$('#todo_text').focus();

	/**
	 * Akcia pre odoslanie formulára. 
	 * Skontroluje sa, či je textove pole vyplnene a ak áno pošle sa ajax požiadavka na server.
	 */
	$('#new_todo').submit(function () {
		var todo_text = $('#todo_text').val().trim();
		
		if (todo_text.length === 0 ) {
			alert("Zadaj novú úlohu.");
			return false;
		}

		$.ajax({
			type: 'POST',
			url: 'todo',
			data: { 'text': todo_text }
		}).done(function () {
			$('#todo_text').val('');
			$('#status_new').text('Úloha bola úspešne uložená na serveri.').show().delay(2000).fadeOut();
		}).fail(function (xhr, errorType, statusText) {
			$('#status_new').text('Úlohu sa nepodarilo odoslať na server, skús znova... (' + statusText + ': ' + xhr.responseText + ')').show().delay(5000).fadeOut();
		});

		return false;
	});

	// Zavolá funkciu pre zistovanie zmien - prvotné získanie dát.
	checkForChanges();
});