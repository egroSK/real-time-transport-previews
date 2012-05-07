# Úvod

Tento projekt obsahuje ukážkové real-time webové aplikácie určené k demonštrácii rôznych real-time transportných spôsobov medzi klientom a serverom na webe. 

Ukážkové aplikácie sú súčasťou bakalárskej práce na tému real-time webové aplikácie písanej na Fakulte informatiky a štatisiky na Vysokej škole ekonomickej v Prahe.

Transportné spôsoby sú predvedené na aplikácii zjednodušeného todo-listu. Todo-list má implementované iba dve funkcie - pridanie novej úlohy a získanie úloh zo servera.

***Aplikácia neobsahuje všetky potrebné prvky, ktoré by boli pokryté v produkčnej aplikácii, ako overovanie hodnôt získaných od užívateľa a podobne. Jedná sa čisto iba o predvedenie komunikácie klienta so serverom pri danom transportnom spôsobe.***

*Pozn. 1. Úlohy nie sú ukladané do databázy preto je ich životnosť iba po dobu spustenia aplikácie.*

*Pozn. 2. Aplikácie boli testované v prehliadači Safari 5.1.5 a Chrome 18.*

# Spustenie ukážkovej aplikácie
Každý adresár predstavuje jednu samostatnú aplikáciu nezávislú od ostatných.

Pre spustenie ukážkovej aplikácie je nutné mať nainštalované prostredie [Node.js](http://nodejs.org/) verzie 0.4 a vyššej.

Pred spustením aplikácie je treba v adresári s aplikáciou stiahnúť závislosti príkazom:

	npm install -d

Samotná aplikácia sa spúšťa príkazom:

	node app.js

Po spustení aplikácie sa v konzole vypíše adresa a port na ktorom aplikácia beží, štandartne je to adresa localhost a port 3000. Port sa dá zmeniť v zdrojovom kóde v časti:

	app.listen(3000, function(){ … });

*Odporúčam testovať real-time komunikáciu otvorením stránky s aplikáciou vo viacerých prehliadačoch a nie v jednom z dôvodu obmedzenia prehliadačov na dve otvorené spojenia ku serveru.*

# Priradenie transportných spôsobov ku kapitolám bakalárskej práce

####3.1	Využitie pull modelu – nepravý real-time  
#####_3.1.1 Polling_
* 01_polling

#####_3.1.2 Vylepšený polling – piggybacking_
* 02_polling_with_piggybacking  

#####_3.1.3 Polling s využitím &lt;script&gt; elementu_
* 03_polling_script_element

####3.2 Využitie push modelu nad HTTP protokolom (Comet)
#####_3.2.1 XHR-streaming_
* 04_xhr_streaming
* 04_xhr_streaming_with_old

#####_3.2.2 Forever-iframe_
* 05_forever_iframe
* 05_forever_iframe_with_old

#####_3.2.3 Long-polling_
* 06_longpolling

#####_3.2.4 Long-polling s využitím &lt;script&gt; elementu_
* 07_longpolling_script_element

#####_3.2.6 Server-sent Event_
* 08_serversent
* 08_serversent_with_old

_Aplikácia s označením **with_old** je vylepšená o získavanie úloh pridaných v čase, kedy nebol užívateľ pripojený._