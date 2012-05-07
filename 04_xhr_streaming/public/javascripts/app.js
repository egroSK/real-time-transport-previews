/**
 * Zjednodušený todo-list, technika (transportný spôsob) XHR-STREAMING.
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

/**  @type {number} showed Počítadlo už videných správ z XHR objektu */
var showed;
/** @type {number} write_messages_timeout_ID ID práve bežiaceho timeoutu */
var write_messages_timeout_ID;

/**
 * Funkcia, ktorá získa nové data zo servera a spracuje ich.
 */
function checkForChanges() {
	var xhr = new XMLHttpRequest();

	var writeMessages = function() {
		clearInterval(write_messages_timeout_ID);

		// Vypísanie nových správ z XHR objektu
		var texts = xhr.responseText.split('\n');
		for (var i = showed; i < texts.length -1; i++) {
			var todo = JSON.parse(texts[i]);
			$('<li>').text(todo['text']).appendTo('#todos');
		}
		// nastaví počet zobrazených na počet správ v XHR objekte, alebo na 1, ak je ich počet 0
		showed = texts.length - 1 || 1; 

		// O 2 sekundy skontroluje nové správy v XHR objekt, dôležité z dôvodu kompatibility medzi prehliadačmi
		write_messages_timeout_ID = setTimeout(function () {
			writeMessages();
		}, 2000);

		$('#status_update').text('Posledná aktualizácia: ' + new Date());
	};


	xhr.onreadystatechange = function () {
		// inicializácia počítadla počtu zobrazených správ z XHR objektu
		if (xhr.readyState === 1) {
			showed = 1;
		}

		// Výpis správ z XHR objektu po vyvolaní LOADING (3) stavu
		if (xhr.readyState === 3) {
			writeMessages();
		}

		// Po uzavretí spojenia, vypísanie zostávajúcich správ z XHR objektu a nadviazanie nového spojenia
		if (xhr.readyState === 4) {
			if (xhr.status !== 200) {
				// Nastala chyba pri získavaní správ...
			}
			writeMessages();
			xhr.open('GET', 'todos');
			xhr.send();
		}
	};
	xhr.open('GET', 'todos');
	xhr.send();
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

	// Zavolá funkciu pre zistenie zmien - otvorenie spojenia ku serveru.
	checkForChanges();
});