/**
 * Zjednodušený todo-list, technika (transportný spôsob) POLLING WITH PIGGYBACKING.
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

// Routy

/**
 * GET / 
 * Pošle vyrenderovaný index ako odpoveď.
 */
app.get('/', function (req, res) {
	res.header('Cache-Control', 'no-cache');
	res.render('index.ejs', { 'title': 'Poolling with piggybacking demo - Jednoduchý TODO list' });
});

/**
 * POST /todo (param = text, since)
 * Uloži nové todočko do zoznamu.
 * Oproti tradičnému pollingu zároveň odpovedá zoznamom zmien od zvoleného času.
 */
app.post('/todo', function (req, res) {
	var todo_text = req.body['text'];
	if (!todo_text || todo_text.trim().length === 0) {
		return res.send('Text úlohy musí byť zadaný.', 400);	
	}
	todos.add(todo_text);
	
	var now = Date.now();
	var since = Number(req.body['since']) || 0;
	
	res.send({
		todos: todos.getSince(since, now),
		since: now
	});
});

/**
 * GET /todos (param = since)
 * Odpovie zoznamom zmien od zvoleného času.
 */
app.get('/todos', function (req, res) {
	var now = Date.now()
	var since = Number(req.query['since']) || 0;

	res.send({
		todos: todos.getSince(since, now),
		since: now
	});
});

// Listen

app.listen(3000, function(){
	console.log("Express server is listening on: " + app.address().address + ":" + app.address().port);
});
