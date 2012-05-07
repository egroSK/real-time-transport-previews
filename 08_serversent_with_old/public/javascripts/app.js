/**
 * Zjednodušený todo-list, technika (transportný spôsob) SERVER-SENT EVENT (with old)
 * je vylepšený o získanie úloh pridaných, v čase, kedy nebol užívateľ pripojený.
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

/**
 * Funkcia, ktorá pripojí klienta ku serveru s využitím techniky Sent-Server event.
 * Okrem toho obsahuje definíciu SSE listenerov.
 */
function connectToServer() {
	var es = new EventSource('/todos');
	
	es.onmessage = function (msg) {
		var data = JSON.parse(msg.data);
		data.todos.forEach(function (todo) {
			$('<li>').text(todo['text']).appendTo('#todos');
		});
		$('#status_update').text('Posledná správa: ' + new Date());
	};
	
	es.onerror = function (e) {
		$('#status_update').text('Nastala chyba pri získavaní poznámok zo serveru, skúšam znova.');
	};
}

$(function () {
	$('#todo_text').focus();

	/**
	 * Akcia pre odoslanie formulára. 
	 * Skontroluje sa, či je textové pole vyplnené a ak áno pošle sa ajax požiadavka na server.
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

	// Pripojenie sa ku serveru pomocou SSE a následné získavanie dát.
	connectToServer();
});