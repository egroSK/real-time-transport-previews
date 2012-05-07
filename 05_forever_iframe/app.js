/**
 * Zjednodušený todo-list, technika (transportný spôsob) FOREVER-IFRAME.
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
	res.render('index.ejs', { 'title': 'FOREVER-IFRAME - Jednoduchý TODO list' });
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
 * Spracuje došlé todočko a rozpošle ho ostatným pripojeným klientom.
 */
app.post('/todo', function (req, res) {
	var todo_text = req.body['text'];
	if (!todo_text || todo_text.trim().length === 0) {
		return res.send('Text úlohy musí byť zadaný.', 400);	
	}
	res.send(); // Uzavretie POST požiadavku

	// Poslanie todočka klientom
	var todo_to_send = JSON.stringify(new Todo(req.body['text']));
	responses.forEach(function (resp) {
		resp.write("<script>window.parent.processData('" + todo_to_send + "')</script>");
	});
});

/**
 * GET /todos
 * Nastaví potrebné hlavičky a pošle úvodnú časť vnoreného dokumentu.
 * Zároveň uloži objekt s požiadavkou do pola s požiadavkami.
 */
app.get('/todos', function (req, res) {
	res.header('Content-type', 'text/html');
	res.header('Connection', 'keep-alive');
	res.header('Transfer-Encoding', 'chunked');

	res.write('<!DOCTYPE><html><head><meta charset="utf8"></head><body>');
	res.write(Array(2049).join(' '));

	responses.push(res);
});

// Listen

app.listen(3000, function(){
	console.log("Express server is listening on: " + app.address().address + ":" + app.address().port);
});
