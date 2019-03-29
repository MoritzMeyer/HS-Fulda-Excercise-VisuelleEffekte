# VisuelleEffekteExcercise
Kurs Visuelle Effekte WS 2018/2019 Hochschule Fulda

Teilnehmer: Moritz Meyer
Matrikelnummer: 447721 
Projekt: Implementierung des Physically based rendering Modells unter Verwendung der Cook-Torrance BRDF

Um das Projekt auszuführen dieses am Besten mit WebStorm öffnen und hier einen live-Server starten als Startkonfiguration sollte die index.html ausgewählt sein. Wenn nicht ist dies der Einstiegspunkt der Navigation. Alternativ kann das Projekt auch über einen anderen Live-Server wie z.B. XAMPP gestartet werden. Es muss jedoch über einen Server gestartet werden, da es ansonsten zu Fehlern beim Laden der Texturen kommt.
In der index.html sind alle Uebungen aufgelistet, sowie am Ende zwei Szenen in denen das Projekt einmal mit Farb-Materialien und einmal mit Texture-Materialien implementiert wurde.

Für Uebung (Engine) und Projekt wurden verschiedenste Beispiele, Lösungswege und Tutorials zu Rate gezogen. Hauptsächlich jedoch die folgenden:
- https://learnopengl.com/book/learnopengl_book_bw.pdf
- https://learnopengl.com/
- http://www.codinglabs.net/article_physically_based_rendering.aspx
- http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx

Die Texturen und Modelle für das Projekt stammen aus folgender Quelle:
- https://freepbr.com/
- https://people.sc.fsu.edu/~jburkardt/data/obj/obj.html

Als Biliotheken wurden folgende verwendet:
- Für die Matrix- und Vektoreberechnungen: http://glmatrix.net/ (sowie in Ausnahmefällen: https://www.x3dom.org/)
- Für das laden von .obj Dateien der OBJ-loader welcher uns in der Veranstaltung zur verfügung gestellt wurde
- Für den Zugriff auf Javascript-DOM Elemente: https://jquery.com/

Engine und Projekt wurden in den Browsern Firefox und Chrome getestet.
