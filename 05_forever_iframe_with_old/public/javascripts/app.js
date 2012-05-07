/**
 * Zjednodušený todo-list, technika (transportný spôsob) FOREVER-IFRAME (with old)
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

/**  @type {number} since Timestamp poslednej zmeny (v ms) */
var since = 0;

/**
 * Funkcia processData spracuje dáta prijaté zo serveru.
 */
function processData (text) {
	var data = JSON.parse(text);

	since = data['since'];
	data.todos.forEach(function (todo) {
		$('<li>').text(todo['text']).appendTo('#todos');
	});

	$('#status_update').text('Posledná aktualizácia: ' + new Date());
}

/**
 * Funkcia pridá iframe element na stránku, ktorý pošle požiadavku na server,
 * toto spojenie ostáva stále otvorené a postupne prichádzajú zo servery dáta obalené
 * vo funkcii processData a <script> elemente, ktorého telo sa po prijatí vykoná.
 * Mali by tu byť doimplementované riešenie chýb pri loadovaní zo serveru, napr. pomocou timeoutu.
 */
function createCheckingInlineTag () {
	var iframe = document.createElement('iframe');
	iframe.setAttribute('src', '/todos');
	iframe.setAttribute('style', 'width: 0px; height: 0px; border: 0px;');
	document.body.appendChild(iframe);
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

	// Zavolá funkciu pre získavanie dát zo serveru.
	createCheckingInlineTag();
});