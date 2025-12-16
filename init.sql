set names 'utf8mb4';
-- -----------------------------------------------------------
-- 1. SETĂRI GENERALE PENTRU SUPORT DIACRITICE (UTF8MB4)
-- -----------------------------------------------------------
ALTER DATABASE mydatabase
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 2. CREATE TABLES (cu encoding specificat)
-- -----------------------------------------------------------

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE buildings (
    buildingId INT AUTO_INCREMENT PRIMARY KEY,
    picturesPath VARCHAR(255),
    name VARCHAR(50),
    address VARCHAR(100),
    year INT,
    summary VARCHAR(700),
    rating FLOAT,
    category VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE options (
    optionId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    name varchar(50),
    description varchar(200),
    ranking int,
    CONSTRAINT fk_users_options FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE itineraries (
    itineraryId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    numberOfBuildings INT,
    distance FLOAT,
    ranking INT,
    optionBased VARCHAR(20),
    CONSTRAINT fk_users_itineraries FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE itineraryBuilding (
    itineraryBuildingId INT AUTO_INCREMENT PRIMARY KEY,
    itineraryId INT,
    buildingId INT,
    CONSTRAINT fk_itineraries_itineraryBuildings FOREIGN KEY (itineraryId)
        REFERENCES itineraries(itineraryId)
        ON DELETE CASCADE,
    CONSTRAINT fk_buildings_itineraryBuildings FOREIGN KEY (buildingId)
        REFERENCES buildings(buildingId)
        ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE reviews (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    buildingId INT,
    title VARCHAR(50),
    description VARCHAR(200),
    rating INT,
    CONSTRAINT fk_users_reviews FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE,
    CONSTRAINT fk_buildings_reviews FOREIGN KEY (buildingId)
        REFERENCES buildings(buildingId)
        ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


INSERT INTO buildings(picturesPath, name, address, year, summary, rating, category) VALUES 
('assets/pictures/1.jpg', 'Casa Memorială Constantin Joja', 'Strada Ion Slătineanu nr. 4', 1990, 'Casa Memorială Constantin Joja este dedicată memoriei celebrului arhitect și istoric de artă român. Muzeul este organizat chiar în locuința în care a trăit și a lucrat Joja, oferind vizitatorilor o incursiune autentică în viața și viziunea sa. Colecția cuprinde mobilier de epocă, o vastă bibliotecă personală cu volume rare despre arhitectură și artă, manuscrise și schițe originale. Spațiul reflectă gustul rafinat al arhitectului, evidențiind contribuția sa fundamentală la studiul patrimoniului arhitectural românesc și la conservarea tradiției.', 0, 'memorial'),

('assets/pictures/2.jpg', 'Muzeul Dimitrie și Aurelia Ghiata', 'Strada Dr. Clunet nr. 14', 1992, 'Muzeul găzduiește colecția lăsată moștenire de pictorul Dimitrie Ghiată și soția sa, Aurelia. Dimitrie Ghiată a fost un artist remarcabil al artei românești moderne, cunoscut pentru peisajele sale pline de lirism și portretele sensibile. Expoziția cuprinde o selecție impresionantă de picturi în ulei și desene, ilustrând evoluția stilistică a artistului, de la influențele post-impresioniste la propria sa manieră de interpretare a luminii și formei. Spațiul memorial oferă contextul vieții sale boeme și al creației sale.', 0, 'arta'),

('assets/pictures/3.jpg', 'Muzeul Memorial Dr. Victor Babeș', 'Strada Andrei Mureșanu nr. 14 A', 1928, 'Dedicat savantului Victor Babeș, unul dintre fondatorii microbiologiei moderne și o figură emblematică a medicinei românești. Muzeul este amenajat în casa în care a locuit, fiind un omagiu adus contribuției sale revoluționare în lupta împotriva bolilor infecțioase, inclusiv descoperirea corpilor care îi poartă numele ("Corpii Babeș-Ernst"). Expoziția prezintă documente științifice originale, instrumente medicale de epocă și obiecte personale, oferind o perspectivă asupra vieții unui pionier al științei mondiale.', 0, 'memorial'),

('assets/pictures/4.jpg', 'Muzeul Memorial George Călinescu', 'Str. George Călinescu nr. 53', 1940, 'Situat în casa în care a trăit George Călinescu, unul dintre cei mai influenți critici literari, esteticieni, prozatori și academicieni români. Muzeul conservă atmosfera intelectuală a spațiului de creație, punând în valoare biblioteca impresionantă a scriitorului și mobilierul original. Vizitatorii pot vedea biroul unde a scris capodopere precum "Istoria literaturii române de la origini până în prezent" și "Enigma Otiliei", oferind o fereastră în universul complex al personalității sale.', 0, 'memorial'),

('assets/pictures/5.jpg', 'Casa Memorială George Bacovia', 'Strada George Bacovia nr. 63', 1933, 'Muzeul memorial este dedicat marelui poet simbolist George Bacovia. Casa modestă, cumpărată de poet, a fost ultimul său domiciliu și a servit drept sursă de inspirație pentru versurile sale pline de melancolie, plumb și tristețe orășenească. Expoziția include manuscrise, ediții princeps ale volumelor sale și obiecte personale care ilustrează viața simplă și chinuită a poetului. Este un loc ce păstrează esența simbolismului bacovian, fiind un reper important pentru literatura română.', 0, 'memorial'),

('assets/pictures/6.jpg', 'Casa Memorială Liviu Rebreanu', 'Bulevardul Gheorghe Marinescu nr. 19', 1968, 'Apartamentul a fost locul de reședință al prozatorului Liviu Rebreanu, autorul romanelor fundamentale "Ion" și "Pădurea spânzuraților". Muzeul recreează fidel mediul său de viață și lucru, expunând piese de mobilier, documente de familie, fotografii și ediții ale operelor sale. Spațiul dezvăluie etapele vieții sale, de la începuturile literare la apogeul recunoașterii, evidențiind contribuția sa majoră la dezvoltarea romanului realist românesc.', 0, 'memorial'),

('assets/pictures/7.jpg', 'Casa Memorială Tudor Arghezi', 'Strada Mărțișor', 1940, 'Cunoscută sub numele de "Mărțișor", această casă este un complex memorial ce include locuința, grădina și capela, toate proiectate parțial de Tudor Arghezi însuși. Aici, poetul a trăit și a creat o mare parte din opera sa, fiind un refugiu literar și familial. Expoziția cuprinde o colecție vastă de volume, tablouri, obiecte de artă populară și piese de mobilier. Este o mărturie a personalității sale complexe și a universului său poetic unic, îmbinând sacrul cu profanul.', 0, 'memorial'),

('assets/pictures/8.jpg', 'Capela Mauriciu Blank', 'Pădurea Băneasa', 1920, 'O capelă funerară de o deosebită valoare arhitecturală, proiectată de renumitul arhitect Duiliu Marcu, cunoscut pentru stilul său eclectic și modern. Capela a fost comandată de familia bancherului Mauriciu Blank. Edificiul se remarcă prin eleganța liniilor și detaliile decorative, reprezentând un exemplu notabil de arhitectură funerară de la începutul secolului XX. Deși localizată într-un cadru natural, arhitectura sa se integrează armonios, fiind un mic monument de artă.', 0, 'religious'),

('assets/pictures/9.jpg', 'Monumentul Luptătorului Antiterorist', 'Aleea Padina', 2012, 'Un monument solemn ridicat în memoria eroilor căzuți în lupta antiteroristă din timpul Revoluției din Decembrie 1989. Opera de artă comemorativă servește ca un loc de reculegere și omagiu adus celor care și-au sacrificat viața pentru libertate. Designul său modern și simbolic transmite forța, curajul și spiritul de sacrificiu al luptătorilor, fiind un punct de referință în spațiul public care amintește de evenimentele cruciale ale istoriei recente.', 0, 'monument'),

('assets/pictures/10.jpg', 'Hala Traian', 'Calea Călărașilor', 1896, 'Proiectată de arhitectul italian Giulio Magni, Hala Traian este una dintre cele mai vechi și mai importante piețe acoperite din București. Clădirea este un exemplu remarcabil de arhitectură industrială funcțională de la sfârșitul secolului XIX, utilizând structuri metalice vizibile și sticlă, în spiritul marilor hale europene. De-a lungul timpului, a rămas un centru comercial vital, păstrându-și rolul de piață locală și contribuind la viața socială a zonei.', 0, 'market_hall'),

('assets/pictures/11.jpg', 'Casa Roșescu', 'Bulevardul Aerogării', 1930, 'Această clădire rezidențială este un exemplu tipic, dar distinctiv, de arhitectură interbelică din zona de nord a Bucureștiului. Se remarcă prin volumele bine echilibrate și detaliile decorative subtile, ilustrând tranziția de la stilurile istorice la modernismul incipient. Reprezintă o mărturie a dezvoltării urbane a capitalei în perioada dintre cele două războaie mondiale, când cartierele rezidențiale de lux au început să prindă contur.', 0, 'building'),

('assets/pictures/12.jpg', 'Palatul Crețulescu', 'Strada Știrbei Vodă', 1903, 'Proiectat de arhitectul Petre Antonescu, Palatul Crețulescu este un magnific exemplu de stil neoclasic francez, fiind una dintre cele mai elegante clădiri din București. Inițial construit pentru familia Crețulescu, a servit ulterior diverse scopuri administrative. Se distinge prin fațada sa monumentală, coloanele impunătoare și interiorul somptuos, fiind un simbol al arhitecturii de sfârșit de secol XIX și început de secol XX.', 0, 'palace'),

('assets/pictures/13.jpg', 'Automatica Ford', 'Calea Floreasca', 1936, 'Fosta fabrică de asamblare auto Ford, această clădire reprezintă o piesă importantă de arhitectură industrială modernistă din perioada interbelică. Designul său funcțional, cu spații mari și lumină naturală optimă pentru producție, ilustrează influența arhitecturii internaționale asupra industriei românești. Deși și-a schimbat funcția de-a lungul anilor, rămâne un simbol al modernizării economice a României.', 0, 'industrial'),

('assets/pictures/14.jpg', 'Biserica Dudești Cioplea', 'Strada Ilioara', 1790, 'O biserică veche de o mare valoare istorică, reprezentând arhitectura religioasă tradițională din Țara Românească. Edificiul este un monument istoric care a supraviețuit intemperiilor timpului, păstrând elemente specifice stilului brâncovenesc sau post-brâncovenesc. Pictura interioară și structura sa simplă, dar robustă, o fac un loc de pelerinaj și un reper al istoriei religioase a Bucureștiului.', 0, 'church'),

('assets/pictures/15.jpg', 'Vila Malaxa', 'Aleea Alexandru', 1930, 'Vila care a aparținut influentului industriaș Nicolae Malaxa este un exemplu de vârf al arhitecturii moderne interbelice din București. Caracterizată prin linii curate, volume cubice și utilizarea funcțională a spațiului, reflectă tendințele avangardiste ale vremii. A fost un loc al evenimentelor sociale și politice importante, fiind o mărturie a puterii economice și a gustului estetic al elitei românești de dinainte de război.', 0, 'manor'),

('assets/pictures/16.jpg', 'Casele Petrovici-Armis', 'Strada Doamnei', 1900, 'Un grup de clădiri istorice situate în inima centrului vechi, reprezentând diversitatea stilistică de la cumpăna secolelor XIX și XX. Aceste clădiri ilustrează evoluția urbanistică a Bucureștiului, îmbinând elemente de neoclasicism, Art Nouveau și eclectism. Valoarea lor constă în conservarea imaginii de stradă a Bucureștiului de altădată, fiind piese importante în ansamblul arhitectural al zonei.', 0, 'building'),

('assets/pictures/17.jpg', 'Casa Dissescu', 'Calea Victoriei', 1910, 'O clădire emblematică situată pe Calea Victoriei, proiectată într-un elegant stil Beaux-Arts, specific arhitecturii pariziene. Se distinge prin fațada sa bogat ornamentată, balcoanele din fier forjat și detaliile sculptate. Casa Dissescu este o dovadă a aspirației elitei românești de a alinia capitala la standardele estetice occidentale, fiind un reper vizual pe cea mai importantă arteră a orașului.', 0, 'building'),

('assets/pictures/18.jpg', 'Palatul Bragadiru', 'Calea Rahovei', 1905, 'Construit inițial ca sală de spectacole și loc de socializare pentru muncitorii de la fabrica de bere a lui Dumitru Bragadiru, acest palat este o construcție impresionantă în stil eclectic. Se remarcă prin turnul său impunător, detaliile arhitecturale elaborate și spațiul generos al sălilor. După o perioadă de degradare, a fost restaurat, redevenind un centru important pentru evenimente culturale și sociale din București.', 0, 'palace'),

('assets/pictures/19.jpg', 'Sinagoga Mare', 'Strada Vasile Adamache', 1845, 'Una dintre cele mai vechi și mai semnificative lăcașuri de cult evreiești din București. Sinagoga Mare, construită inițial în stil tradițional, a suferit modificări de-a lungul timpului, integrând elemente eclectice. Este un simbol al prezenței și contribuției comunității evreiești la viața orașului, fiind un monument de arhitectură religioasă și istorie culturală.', 0, 'synagogue'),

('assets/pictures/20.jpg', 'Palatul Elisabeta', 'Kiseleff', 1937, 'Reședința oficială a Familiei Regale a României, Palatul Elisabeta a fost construit pentru Principesa Elisabeta, fosta regină a Greciei. Este un exemplu de arhitectură modernistă târzie, având un rol crucial în istoria recentă a țării, în special în perioada de după 1989. Clădirea se remarcă prin eleganța sa sobră și prin semnificația sa simbolică pentru monarhia română.', 0, 'palace'),

('assets/pictures/21.jpg', 'Palatul Creditului Industrial', 'Piața Universității', 1923, 'O clădire monumentală situată într-una dintre cele mai centrale zone ale Bucureștiului, Piața Universității. Clădirea de birouri, acum monument istoric, impresionează prin masivitatea sa și prin utilizarea elementelor de stil neoclasic și academic. A fost un centru financiar important, reflectând dezvoltarea economică rapidă a României din perioada interbelică.', 0, 'building'),

('assets/pictures/22.jpg', 'Casa Filipescu-Cesianu', 'Calea Victoriei', 1892, 'Această casă somptuoasă în stil Beaux-Arts a fost construită la sfârșitul secolului al XIX-lea și este remarcabilă prin bogăția detaliilor arhitecturale și prin istoria sa. Astăzi, găzduiește Muzeul Vârstelor, o expoziție inedită ce ilustrează modul în care viața cotidiană și locuința bucureșteană s-au schimbat de-a lungul ultimelor trei secole. Este o combinație reușită între patrimoniul arhitectural și cel etnografic.', 0, 'manor'),

('assets/pictures/23.jpg', 'Casa Monteoru', 'Bulevardul Dacia', 1874, 'Construită pentru familia boierului Grigore Monteoru, această clădire impunătoare este un exemplu strălucit de arhitectură eclectic europeană. Se caracterizează prin fațada sa bogată, coloanele, cariatidele și detaliile decorative complexe, fiind o expresie a opulenței și gustului artistic al elitei bucureștene din a doua jumătate a secolului al XIX-lea. De-a lungul timpului, a găzduit diverse instituții culturale.', 0, 'building'),

('assets/pictures/24.jpg', 'Casa Nenciu', 'Calea Victoriei', 1900, 'O casă istorică situată pe Calea Victoriei, ilustrând tranziția stilistică de la sfârșitul secolului XIX. Deși mai puțin opulentă decât palatele vecine, Casa Nenciu contribuie la coerența arhitecturală a celei mai importante străzi a capitalei, păstrând elemente de decor specifice epocii sale. Este un reper al arhitecturii civile bucureștene.', 0, 'building'),

('assets/pictures/25.jpg', 'Casa Vernescu', 'Calea Victoriei', 1890, 'Un monument arhitectural de excepție, renumit pentru renovarea sa realizată de marele arhitect Ion Mincu, părintele școlii naționale de arhitectură. Casa, inițial construită în stil neoclasic, a primit elemente de Art Nouveau și de inspirație neoromânească. Interiorul său somptuos și fațada elegantă o transformă într-unul dintre cele mai fotografiate și admirate edificii de pe Calea Victoriei.', 0, 'building'),

('assets/pictures/26.jpg', 'Casa cu cariatide', 'Calea Victoriei', 1880, 'Denumirea clădirii provine de la elementele sale decorative exterioare – cariatidele – statui feminine care servesc drept coloane de susținere sau pilaștri decorați. Este un exemplu tipic de arhitectură eclectic-clasică, ilustrând influența franceză în designul urban al Bucureștiului. Fațada sa spectaculoasă o face ușor de recunoscut și un punct de atracție pe Calea Victoriei.', 0, 'building'),

('assets/pictures/27.jpg', 'Palatul Știrbei', 'Calea Victoriei', 1837, 'Unul dintre cele mai vechi și mai importante palate din București, fiind inițial reședința Domnitorului Barbu Dimitrie Știrbei. Clădirea a fost supusă unor modificări ulterioare, dar păstrează o structură neoclasică impresionantă. De-a lungul istoriei, a avut roluri variate, de la reședință princiară la muzeu. Reprezintă o mărturie a epocii de modernizare a Țării Românești.', 0, 'palace'),

('assets/pictures/28.jpg', 'Hotel Dunărea', 'Calea Griviței', 1900, 'Situat strategic lângă Gara de Nord, acest hotel istoric face parte din dezvoltarea urbană adiacentă principalului nod feroviar. Arhitectura sa, de la începutul secolului XX, este specifică hotelurilor de epocă, îmbinând funcționalitatea cu un decor sobru, dar elegant. Este un reper al Căii Griviței și reflectă traficul intens de la începutul secolului trecut.', 0, 'building'),

('assets/pictures/29.jpg', 'Grand Hotel Continental', 'Calea Victoriei', 1886, 'Unul dintre cele mai prestigioase hoteluri de lux din București, construit în stilul sofisticat Belle Époque. Clădirea se remarcă prin fațada sa bogat ornamentată, interioarele somptuoase și istoria sa ca loc de întâlnire pentru elita politică și culturală. A fost martor la cele mai importante evenimente din istoria modernă a României, păstrându-și farmecul și eleganța inițială.', 0, 'hotel'),

('assets/pictures/30.jpg', 'Casa Prof. D. D. Stancu', 'Strada Băneasa', 1930, 'O clădire rezidențială reprezentativă pentru arhitectura interbelică din cartierul Băneasa. Se caracterizează prin adoptarea principiilor modernismului funcționalist, cu linii clare și un accent pe spațiile de locuit luminoase și practice. Face parte din patrimoniul arhitectural al zonei de nord, ilustrând expansiunea orașului în acea perioadă.', 0, 'building'),

('assets/pictures/31.jpg', 'Casa Bercaru', 'Bulevardul Aerogării', 1930, 'Casă rezidențială din perioada interbelică, situată pe Bulevardul Aerogării. Arhitectura sa combină, cel mai probabil, elemente de stil neoromânesc cu influențe Art Deco, specific eclectismului funcțional al anilor 30. Este o mărturie a dezvoltării cartierelor rezidențiale pentru clasa de mijloc superioară.', 0, 'building'),

('assets/pictures/32.jpg', 'Casa lt.-col. C. Roșescu', 'Strada Horia Măcelariu', 1930, 'O casă cu valoare de patrimoniu din zona de nord, ilustrând stilul de locuire al ofițerilor și al elitei militare din perioada interbelică. Arhitectura sa, deși sobră, este de o calitate superioară, punând accent pe echilibrul volumelor și pe integrarea în spațiul verde adiacent. Contribuie la identitatea arhitecturală a cartierului.', 0, 'heritage_building'),

('assets/pictures/33.jpg', 'Monumentul Trupelor de Geniu', 'Bulevardul Iuliu Maniu', 1929, 'Cunoscut popular sub numele de "Leul", acest monument este dedicat memoriei Trupelor de Geniu căzute în Primul Război Mondial. Sculptura masivă a leului, simbol al forței și curajului, stă pe un soclu impresionant, dominând intersecția. Monumentul este o operă importantă de artă comemorativă, realizată de sculptorul Spiridon Georgescu.', 0, 'monument'),

('assets/pictures/34.jpg', 'Sediul Uniunii Arhitecților', 'Strada Demetru Ion Dobrescu', 1903, 'Fostul Palat al Băncii Marmorosch Blank, sediul actual al Uniunii Arhitecților din România este o capodoperă a stilului Art Nouveau, cu influențe secesioniste. Proiectat de arhitectul Herman Iacob Heilmann, se remarcă prin fațada sa spectaculoasă, cu ornamente florale, feronerie artistică și utilizarea inovatoare a spațiului. Este considerat unul dintre cele mai frumoase exemple de arhitectură bancară din București.', 0, 'palace'),

('assets/pictures/35.jpg', 'Casa Dinu Lipatti', 'Bulevardul Lascăr Catargiu', 1900, 'Clădirea în care a locuit marele pianist și compozitor Dinu Lipatti. Deși nu este un muzeu memorial în sensul clasic, casa este asociată cu geniul muzical al lui Lipatti. Arhitectura sa este tipică începutului de secol XX, cu un aer burghez elegant, reflectând statutul familiei. Este un loc important în istoria muzicală și culturală a Bucureștiului.', 0, 'building'),

('assets/pictures/36.jpg', 'Palatul Ministerului de Interne', 'Piața Revoluției', 1912, 'O clădire administrativă impunătoare, situată într-o zonă cu o mare încărcătură istorică. Arhitectura sa monumentală, în stil neoclasic academic, a fost concepută pentru a exprima autoritatea și permanența instituțiilor statului. Fațada sa riguroasă și detaliile clasice o plasează printre marile clădiri guvernamentale ale capitalei.', 0, 'building'),

('assets/pictures/37.jpg', 'Casa Pinca', 'Bulevardul Aerogării', 1930, 'O casă din zona de nord cu un stil arhitectural tipic interbelic. Poate prezenta elemente de Art Deco sau modernism, punând accentul pe volume simple și funcționale. Astfel de case ilustrează dezvoltarea cartierelor destinate profesioniștilor și noii burghezii a Bucureștiului în anii 30.', 0, 'building'),

('assets/pictures/38.jpg', 'Casa Lisovschi', 'Bulevardul Aerogării', 1930, 'O vilă rezidențială care se înscrie în peisajul arhitectural interbelic al zonei de nord. Arhitectura sa se distinge prin calitatea finisajelor și prin designul funcțional adaptat cerințelor vremii. Este un exemplu de locuire confortabilă și estetică din perioada de aur a arhitecturii românești.', 0, 'building'),

('assets/pictures/39.jpg', 'Garajul Ciclop', 'Bulevardul Magheru', 1928, 'Garajul Ciclop este un monument de arhitectură industrială și inovație urbană, fiind considerată prima parcare supraetajată modernă din București. Proiectată în stil Art Deco, clădirea a fost o soluție avangardistă la problema parcării în centrul orașului în perioada interbelică. Se remarcă prin structura sa din beton armat și fațada decorată simplu, dar elegant.', 0, 'building'),

('assets/pictures/40.jpg', 'Blocul Zodiac', 'Calea Dorobanților', 1931, 'Blocul Zodiac este un exemplu notabil de arhitectură modernistă timpurie, fiind declarat monument istoric. Proiectat de arhitectul Horia Creangă, este caracterizat de linii drepte, fațade simple și ferestre orizontale, urmând principiile estetice ale funcționalismului. Reprezintă o contribuție majoră la modernizarea peisajului urban al Bucureștiului.', 0, 'building'),

('assets/pictures/41.jpg', 'Palatul Noblesse', 'Strada Sfinților', 1880, 'O clădire istorică impresionantă, Palatul Noblesse este un exemplu de arhitectură eclectic-neoclasică. Restaurată cu minuțiozitate, clădirea și-a păstrat interioarele opulente și detaliile decorative originale. Este adesea folosită ca spațiu pentru evenimente și design interior, fiind un simbol al eleganței burgheze din secolul al XIX-lea.', 0, 'palace'),

('assets/pictures/42.jpg', 'Siloz Orzărie', 'Șoseaua Orhideelor', 1900, 'Această structură industrială veche este o mărturie a dezvoltării industriei berii în București. Silozul, parte a fostei fabrici de bere, se remarcă prin masivitatea sa funcțională și prin utilizarea cărămizii roșii. Deși nu este o clădire rezidențială sau de protocol, valoarea sa rezidă în reprezentarea arhitecturii utilitare și industriale a începutului de secol XX.', 0, 'industrial'),

('assets/pictures/43.jpg', 'Casa Assan', 'Piața Alexandru Lahovari', 1906, 'Construită pentru industriașul George Assan, această vilă impresionantă în stil eclectic-Art Nouveau găzduiește în prezent Muzeul Nicolae Minovici. Casa se distinge prin eleganța sa rafinată, detaliile decorative complexe și utilizarea materialelor de calitate. Este un punct de referință cultural și arhitectural în peisajul Pieței Lahovari.', 0, 'house'),

('assets/pictures/44.jpg', 'Vila D. Ionescu', 'Strada Gheorghe Brătianu', 1930, 'O vilă interbelică de mari dimensiuni, situată într-una dintre zonele rezidențiale de lux ale Bucureștiului. Arhitectura sa reflectă fie stilul neoromânesc, fie modernismul clasicizat, punând accentul pe monumentalitate și reprezentare socială. Este un excelent exemplu al arhitecturii de reședință a elitei economice din perioada respectivă.', 0, 'manor'),

('assets/pictures/45.jpg', 'Palatul Nunțiaturii Apostolice', 'Strada Pictor Constantin Stahi', 1928, 'Reședința oficială a reprezentanței diplomatice a Vaticanului în România, acest palat este un exemplu de arhitectură neoromânească cu influențe eclectice. Clădirea se distinge prin sobrietate, dar și prin elementele de decor inspirate din tradiția românească. Este un monument cu o semnificație istorică și diplomatică deosebită.', 0, 'palace'),

('assets/pictures/46.jpg', 'Cinema Dacia-Marconi', 'Calea Griviței', 1930, 'Fostul cinematograf istoric Dacia-Marconi este un exemplu de arhitectură Art Deco și modernistă târzie. Cinematografele din acea perioadă erau centre sociale importante, iar designul lor reflecta dorința de modernitate. Fațada sa simplă, dar distinctivă, este un reper al Căii Griviței.', 0, 'building'),

('assets/pictures/47.jpg', 'Casa Maria Lahovary', 'Calea Dorobanților', 1900, 'O casă care se distinge printr-o arhitectură elegantă și rafinată, specifică sfârșitului de secol XIX, cu elemente de Art Nouveau. Face parte din ansamblul de reședințe nobiliare și burgheze de pe Calea Dorobanților, ilustrând bogăția și gustul estetic al elitei bucureștene de la acea vreme.', 0, 'palace'),

('assets/pictures/48.jpg', 'Sediul ANVR', 'Strada Dealul Țugulea', 1980, 'Sediul Asociației Naționale a Veteranilor de Război (ANVR) este o clădire cu o arhitectură funcțională specifică perioadei socialiste târzii. Deși stilul este mai puțin decorativ, clădirea are o importanță simbolică, fiind centrul administrativ al unei instituții cu un rol social și istoric important în România postbelică.', 0, 'building'),

('assets/pictures/49.jpg', 'Conacul Golescu Grant', 'Aleea Țibleș', 1850, 'Un conac istoric de mare valoare, cu o istorie ce începe la mijlocul secolului al XIX-lea, asociat cu familiile boierești Golescu și Grant. Arhitectura sa îmbină elemente neoclasice cu cele romantice. După restaurare, a fost transformat în centru cultural, păstrându-și valoarea de patrimoniu și devenind un spațiu vital pentru evenimente.', 0, 'manor'),

('assets/pictures/50.jpg', 'Vila Filipescu-Brâncoveanu', 'Aleea Modrogan', 1900, 'O vilă monumentală situată în zona centrală, cunoscută pentru eleganța și proporțiile sale impunătoare. Arhitectura sa, probabil în stil eclectic sau neoclasic, denotă statutul social înalt al proprietarilor săi. Este un element cheie în patrimoniul de reședințe de lux al Bucureștiului de început de secol XX.', 0, 'palace'),

('assets/pictures/51.jpg', 'Biserica Sf. Visarion Vechi', 'Strada Visarion', 1780, 'O biserică cu o vechime considerabilă, fiind un monument istoric reprezentativ pentru arhitectura religioasă pre-modernă din București. Structura sa, cu ziduri groase și pictură murală tradițională, oferă o imagine autentică a lăcașurilor de cult din Țara Românească a secolului al XVIII-lea. Este un loc de spiritualitate profundă și istorie locală.', 0, 'church'),

('assets/pictures/52.jpg', 'Fostul Hotel Bristol', 'Strada Academiei', 1900, 'Fostul Hotel Bristol este un reper istoric și arhitectural în zona centrală. Clădirea, proiectată într-un stil eclectic cu influențe Art Nouveau, a fost un simbol al modernizării sectorului hotelier la începutul secolului XX. Deși și-a schimbat funcția, fațada sa elegantă rămâne un punct de interes major în zona Universității.', 0, 'building'),

('assets/pictures/53.jpg', 'Templul Coral', 'Strada Sfânta Vineri', 1866, 'Una dintre cele mai frumoase sinagogi din România, Templul Coral este remarcabil prin stilul său neomaur, o interpretare exotică a arhitecturii orientale, populară în Europa secolului al XIX-lea. Fațada sa colorată, arcele potcoavă și decorul interior bogat și simbolic îl fac un monument arhitectural de o valoare inestimabilă pentru patrimoniul cultural și religios al Bucureștiului.', 0, 'synagogue'),

('assets/pictures/54.jpg', 'Cercul Militar Național', 'Strada Constantin Mille', 1912, 'O clădire monumentală situată în inima Bucureștiului, Cercul Militar Național este un simbol al arhitecturii neoclasice. Proiectat de arhitectul Dimitrie Maimarolu, palatul se impune prin fațada sa masivă, coloanele corintice și interiorul somptuos, fiind destinat activităților culturale și sociale ale ofițerilor Armatei Române. Este unul dintre cele mai emblematice edificii ale capitalei.', 0, 'palace'),

('assets/pictures/55.jpg', 'Palatul Cotroceni', 'Bulevardul Geniului', 1895, 'Construit inițial ca mănăstire, Palatul Cotroceni a fost transformat în reședință regală de către Regele Carol I și proiectat de arhitectul francez Paul Gottereau. Astăzi, găzduiește sediul Președinției României. Clădirea îmbină stilul neoclasic cu elemente neoromânești, fiind un complex arhitectural cu o importanță istorică și politică fundamentală pentru statul român.', 0, 'palace'),

('assets/pictures/56.jpg', 'Palatul Creditul Rural', 'Strada Doamnei', 1900, 'Un palat istoric cu un rol bancar important la începutul secolului XX. Arhitectura sa, în stil eclectic-Art Nouveau, se distinge prin fațada elegantă, utilizarea pietrei cioplite și detaliile decorative florale. Este o mărturie a efervescenței economice a capitalei și a calității arhitecturale a clădirilor financiare din acea epocă.', 0, 'palace'),

('assets/pictures/57.jpg', 'Palatul Patriarhiei', 'Dealul Mitropoliei', 1907, 'Situat pe Dealul Mitropoliei, Palatul Patriarhiei este sediul Bisericii Ortodoxe Române. Edificiul a fost construit pe locul vechiului Palat al Camerei Deputaților și se remarcă prin stilul său neoclasic cu influențe bizantine, specific arhitecturii ecleziastice monumentale. Simbolizează legătura strânsă dintre stat și biserică în istoria modernă a României.', 0, 'palace'),

('assets/pictures/58.jpg', 'Vila Nae Ionescu', 'Bulevardul Ion Ionescu de la Brad', 1930, 'Această vilă a aparținut filosofului Nae Ionescu și este un exemplu de arhitectură interbelică, asociată cu mișcările intelectuale și politice controversate ale vremii. Clădirea se remarcă prin liniile sale moderniste, având o istorie complexă care reflectă turbulențele sociale și ideologice ale anilor 30.', 0, 'manor'),

('assets/pictures/59.jpg', 'Palatul Nifon Mitropolitul', 'Strada Doamnei', 1900, 'Un palat cu rol istoric și ecleziastic, Palatul Nifon Mitropolitul a servit ca reședință pentru ierarhii bisericești. Arhitectura sa elegantă, în stil eclectic, contribuie la patrimoniul bogat al străzii Doamnei. Clădirea este un martor al influenței bisericii în viața publică și al dezvoltării urbanistice a centrului vechi.', 0, 'palace');

UPDATE buildings SET category = CASE 
    -- 1. Cultural Buildings / Theaters / Museums (Memorials, Museums, Synagogues, Cinemas)
    WHEN buildingId IN (1, 2, 3, 4, 5, 6, 7, 19, 46, 53) 
        THEN 'Cultural Buildings / Theaters / Museums'

    -- 2. Palaces & Royal Residences (Palaces, Large Estates, Royal Homes)
    WHEN buildingId IN (12, 18, 20, 25, 27, 36, 41, 50, 54, 55, 57, 59) 
        THEN 'Palaces & Royal Residences'

    -- 3. Historic Houses & Villas (Standard Heritage Housing, Modernist Villas, Conacs)
    WHEN buildingId IN (11, 15, 16, 22, 23, 24, 26, 30, 32, 35, 37, 38, 40, 44, 49, 58) 
        THEN 'Historic Houses & Villas'

    -- 4. Neo-Romanian & Art Nouveau Residences (Specific architectural styles)
    WHEN buildingId IN (17, 31, 43, 45, 47) 
        THEN 'Neo-Romanian & Art Nouveau Residences'

    -- 5. National/Interwar Period Banks & Financial Palaces
    WHEN buildingId IN (21, 34, 56) 
        THEN 'National/Interwar Period Banks & Financial Palaces'

    -- 6. Historic Inns & Caravanserais (Hotels & Markets)
    WHEN buildingId IN (10, 28, 29, 52) 
        THEN 'Historic Inns & Caravanserais'

    -- 7. Monuments & Arches (Statues, Industrial Monuments, Chapels, Unique Structures)
    WHEN buildingId IN (8, 9, 13, 33, 39, 42) 
        THEN 'Monuments & Arches'

    -- 8. Orthodox Churches & Monasteries
    WHEN buildingId IN (14, 51) 
        THEN 'Orthodox Churches & Monasteries'

    -- 9. Communist Era Monuments & Civic Structures (Post-war)
    WHEN buildingId IN (48) 
        THEN 'Communist Era Monuments & Civic Structures'

    -- Fallback for safety
    ELSE category 
END;