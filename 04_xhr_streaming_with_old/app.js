/**
 * Zjednodušený todo-list, technika (transportný spôsob) XHR-STREAMING (with old)
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

// Závislosti (moduly)

var express = require('express');
var app = module.exports = express.createServer();
var Todo = require('./todo');
var Todos = require('./todos');

// Vytvorenie objektu so zoznamom úloh a pridanie 2 ukážkových úloh

var todos = new Todos();
todos.add('Nakúpiť mlieko');
todos.add('Dopísať bakalárku');

// Nastavenia

// Funkcia pre vlastný formátu času v logoch
express.logger.format('date', function () { 
	var date = new Date();
	return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
});

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', { 'layout': false });
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.logger({ 'format': ':date :method :url' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes

/**
 * GET / 
 * Pošle vyrenderovaný index ako odpoveď.
 */
app.get('/', function (req, res) {
	res.header('Cache-Control', 'no-cache');
	res.render('index.ejs', { 'title': 'XHR-STREAMING (with old) - Jednoduchý TODO list' });
});

/** 
 * @type Array.<response> reposnes Pole otvorených požiadaviek od klientov. 
 *
 * Ešte by bolo treba doimplementovať mazanie odpojených klientov, zisťovanie aktívnych 
 * prebieha napr. posielaním tzv. heartbeat požiadavku zo strany klienta 
 * alebo odchytávanie metéody close na objekte response. 
 */
var responses = [];

/**
 * POST /todo (param = text)
 * Pošle nové todo všetkým klientom.
 */
app.post('/todo', function (req, res) {
	var todo_text = req.body['text'];
	if (!todo_text || todo_text.trim().length === 0) {
		return res.send('Text úlohy musí byť zadaný.', 400);	
	}
	res.send(); // uzavrie POST požiadavku

	// Poslanie todočka klientom
	var json_to_send = JSON.stringify({
		todos: [todos.add(req.body['text'])],
		since: Date.now()
	}) + '\n';
	responses.forEach(function (resp) {
		resp.write(json_to_send);
	});
});

/**
 * GET /todos 
 * Pošle klientovi hlavičky potrebné k tomu, aby ostalo spojenie otvorené a bolo možné 
 * do neho posielať dáta po častiach. Zároveň odošle prvotnú správu (prázdne medzeri), 
 * aby sa naplnila potrebná časť bufferu prehliadača a vloži objekt slúžiaci pre odpoveď do poľa.
 */
app.get('/todos', function (req, res) {
	var now = Date.now();
	var since = Number(req.query['since']) || 0;
	var new_todos = todos.getSince(since, now);

	res.header('Connection', 'keep-alive');
	res.header('Transfer-Encoding', 'chunked');
	res.write(Array(2049).join(' ') + '\n');
	responses.push(res);

	if (new_todos.length > 0) {
		res.write(JSON.stringify({
			todos: new_todos,
			since: now
		}) + '\n');
	}
});

// Listen

app.listen(3000, function(){
	console.log("Express server is listening on: " + app.address().address + ":" + app.address().port);
});
