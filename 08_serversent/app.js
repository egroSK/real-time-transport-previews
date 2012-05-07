/**
 * Zjednodušený todo-list, technika (transportný spôsob) SERVER-SENT EVENT.
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

// Routy

/**
 * GET / 
 * Pošle vyrenderovaný index ako odpoveď.
 */
app.get('/', function (req, res) {
	res.header('Cache-Control', 'no-cache');
	res.render('index.ejs', { 'title': 'SERVER-SENT EVENT - Jednoduchý TODO list' });
});

/** 
 * @type Array.<response> reposnes Pole otvorených požiadaviek od klientov. 
 *
 * Ešte by bolo treba doimplementovať mazanie odpojených klientov, zisťovanie aktívnych 
 * prebieha napr. posielaním tzv. heartbeat požiadavku zo strany klienta.
 * alebo odchytávaním eventu close na response objekte.
 */
var responses = [];

/**
 * POST /todo (param = text)
 * Rzpošle prijaté todočko všetkým pripojeným klientom.
 */
app.post('/todo', function (req, res) {
	var todo_text = req.body['text'];
	if (!todo_text || todo_text.trim().length === 0) {
		return res.send('Text úlohy musí byť zadaný.', 400);	
	}
	res.send();

	var json_to_send = JSON.stringify({ todos: [new Todo(req.body['text'])] });

	responses.forEach(function (resp) {
		resp.write('data: ' + json_to_send + '\n\n');
	});
});

/**
 * GET /todos
 * Uloží si pripojeného užívateľa do pola s otovrenými response objektami.
 */
app.get('/todos', function (req, res) {
	res.header('Content-Type', 'text/event-stream');
	res.header('Cache-Control', 'no-cache')
	res.header('Connection', 'keep-alive');

	req.on('close', function () {
		// Tuto by mohla byť funkcia pre odmazanie objektu s odpoveďou z pola responses
		console.log('connection closed');
	});

	responses.push(res);
});

// Listen

app.listen(3000, function(){
	console.log("Express server is listening on: " + app.address().address + ":" + app.address().port);
});
