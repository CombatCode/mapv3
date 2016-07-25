Description
----------
Map widget based on the leaflet

Tasks
----------
##### 1. Features  (geometries: markers, polygons)
-	Pobieranie z BE
    -	Ustalenie struktury protokołów
    -	Geojson
    -	Websocket’y
    -	Filtracja przesłanych elementów na podstawie praw dostępu.
-	Statusowanie
    -	Cache (BE)
    -	Rejestracja (optymalizacja, nasłuchiwanie)
- Rysowanie na mapie
    -	iconsety
    -	stylowanie polignów
    -	stożki kamer
- Grupowanie 
- Filtrowanie
- Przenoszenie
- Obracanie (PTZ  - sterowanie, kalibracja)
- Obsługa polygonów (edycja)
- Menu kontekstowe
- Tooltip’y
- Podpisy pod markerami
- Zaznaczanie feature’ów
    - pojedyncze (klik na obszarze mapy)
    - grupowe “box”
    - grupowe “lasso”
- D&D
    - z mapy np na inne widgety aplikacji
    - na mapę lokalizacja istniejących lub dodawanie nowego obiektu

##### 2. Mapsety
##### 3. Mapy
- nawigacja pomiędzy mapami (tył / przód) wybór docelowej mapy z listy, przemieszczanie się za pomocą place’ów, itp
- narzędzie do mierzenia odległości i obszaru
- API zewnętrzne widget’a
    - listowanie obiektów po typie na widocznych obszarze mapy (wyszukiwanie w drzewie kamer)
    - dynamiczne dorysowywanie obiektów np scenariusze alarmowe

##### 4. Warstwy dodatkowe (overlays)
##### 5. Moduł komunikacji via REST
##### 6. Moduł komunikacji via Websockets
##### 7. Architektura aplikacji, transpilacji
##### 8. Moduł widget’a do systemu VMXwebbp

Contributors rulezz
----------
###### Rule no. 1
W miarę możliwości dla każdego ficzera z listy tworzymy nowego brancha w oparciu o kod z mastera
```
git checkout master
git pull origin master
git checkout -b dev-[nazwa_brancha]
```
gdzie, [nazwa_brancha] krótkie resume ficzera dzielone underscorem np. ``dev-websockets_module``.
###### Rule no. 2
Nie margujemy nic do mastera. Po wypchnięciu brancha, tworzymy PullRequesta do code review
###### Rule no. 3
Trzymamy się założonej architektury

![x](http://66.media.tumblr.com/94185caa6fa578cdf2492e62cb0666ab/tumblr_inline_o91sjrJiGK1raprkq_500.gif)
