// Aussprache, Alltagsphrasen, Verben, Wochentage.
window.EWE_SOUNDS = [
 // [Buchstabe, Beschreibung auf Deutsch, Beispielwort, Bedeutung, besonders?]
 ['a','wie a in „Mann“','atí','Baum',0],
 ['b','wie b in „Ball“','abólo','Brot',0],
 ['d','wie d in „du“','du','Stadt',0],
 ['ɖ','retroflexes d: Zungenspitze nach hinten gebogen, an den Gaumen gedrückt – ein „dumpfes“ d','ɖeví','Kind',1],
 ['dz','wie „ds“ (stimmhaft), ähnlich engl. „adze“','dzatá','Löwe',1],
 ['e','geschlossenes e wie in „See“, aber kurz','eve','zwei',0],
 ['ɛ','offenes e wie ä in „Bär“ / e in „Ende“','xáxɛ́','eng',1],
 ['f','wie f in „Fisch“ (Unterlippe an Zähne)','fésre','Fenster',0],
 ['ƒ','stimmloses Lippen-f: Lippen fast geschlossen blasen, wie beim Kerzenauspusten – ohne Zähne','ƒu','Meer',1],
 ['g','wie g in „gut“','ga','Geld, Metall',0],
 ['gb','g und b GLEICHZEITIG: Lippen schließen und Zungenrücken hinten anlegen, dann beides zugleich lösen','gbe','Tag; Stimme',1],
 ['ɣ','stimmhafter Reibelaut, wie ein „geriebenes“ g – ähnlich dem Zäpfchen-r in „Rabe“','ɣé','Kreide',1],
 ['h','wie h in „Haus“ (oft etwas stimmhaft)','ha','Schwein',0],
 ['i','wie i in „Igel“, kurz','atí','Baum',0],
 ['k','wie k in „kalt“','kpé','Stein',0],
 ['kp','k und p GLEICHZEITIG: wie gb, aber stimmlos','kpɔ́','sehen',1],
 ['l','wie l in „Licht“','lolo','groß sein',0],
 ['m','wie m in „Mama“','ame','Mensch',0],
 ['n','wie n in „nein“','nú','Ding',0],
 ['ny','wie „nj“ / gn in „Champagner“','nyi','Kuh',1],
 ['ŋ','wie ng in „singen“ – auch am Wortanfang!','ŋútsu','Mann',1],
 ['o','geschlossenes o wie in „Boot“, kurz','to','Büffel',0],
 ['ɔ','offenes o wie in „Sonne“','xɔ','Haus',1],
 ['p','wie p in „Papa“','pétéé','völlig',0],
 ['r','gerolltes Zungenspitzen-r (wie italienisch)','tri','dick sein',0],
 ['s','immer stimmlos wie ß in „Straße“','sukú','Schule',0],
 ['t','wie t in „Tag“','te','Yams',0],
 ['ts','wie z in „Zahn“','tsi','Wasser',1],
 ['u','wie u in „gut“, kurz','nu','Mund',0],
 ['v','wie w in „Wasser“ (Unterlippe an Zähne)','vá','kommen',0],
 ['ʋ','stimmhaftes Lippen-w: Lippen fast geschlossen, ohne Zähne – weicher als w','ʋɔtrú','Tür',1],
 ['w','wie engl. w in „water“ (gerundete Lippen)','wɔ́','Mehl',1],
 ['x','wie ch in „Bach“','xeví','Vogel',1],
 ['y','wie j in „ja“','yi','gehen',1],
 ['z','stimmhaftes s wie in „Sonne“ (norddeutsch)','zě','Topf',1],
 ['ã ẽ ĩ õ ɔ̃ ũ','Nasalvokale (Tilde): wie im Französischen „an“, „un“ – durch die Nase','tɔ̃','drei (etɔ̃)',1]
];

window.EWE_TONES = {
 intro: 'Ewe ist eine <b>Tonsprache</b>: Die Tonhöhe einer Silbe unterscheidet Bedeutungen. Im Buch werden die Töne konsequent markiert – Muttersprachler lassen sie im Alltag oft weg, für Lernende sind sie aber entscheidend.',
 kinds: [
  ['á','Hochton','Akut-Strich auf dem Vokal','Stimme oben halten'],
  ['a','Tiefton','unmarkiert (bei Pronomen: à)','Stimme unten, entspannt'],
  ['ǎ','steigender Ton','tief → hoch','wie eine erstaunte Frage „ja?“'],
  ['â','fallender Ton','hoch → tief','wie ein bestimmtes „nein!“']
 ],
 pairs: [
  ['nu','Mund, Eingang','nú','Ding, Sache'],
  ['asi','Markt','así','Hand'],
  ['tɔ','Fluss, Meer','tɔ́','Vater'],
  ['tu nú','etwas bauen','tú','Gewehr'],
  ['wɔ nú','etwas tun','wɔ́','Mehl'],
  ['akpa','Ärmel, Umschlag','ákpá','zu (sehr)'],
  ['dzo','Feuer','dzǒ','weggehen'],
  ['to','Büffel','tó','Berg, Ohr'],
  ['gbe','Tag, Stimme','gbě','Busch'],
  ['ga','Metall, Geld','gã́','groß']
 ],
 notes: 'Stimmhafte Konsonanten (b, d, g, v, z …) senken den Ton leicht. Die genaue Tonmelodie im Satz lernt man am besten von Muttersprachlern – nimm sie in der App als Referenz auf!'
};

// Alltagsphrasen. src:'b' = so im Buch belegt, 'a' = gebräuchliche Alltagssprache (Tonzeichen nicht im Buch belegt)
window.EWE_PHRASES = [
 { cat: 'Begrüßung & Abschied', items: [
  ['Ŋdí ná wò!','Guten Morgen (dir)!','a'],
  ['Ŋdɔ ná wò!','Guten Tag (dir)! – mittags','b'],
  ['Fiẽ ná wò!','Guten Abend (dir)!','a'],
  ['Woezɔ!','Willkommen! (Buch: wòé zɔ)','b'],
  ['Èfɔ́a?','Bist du gut aufgestanden? (Morgengruß)','a'],
  ['Ẽ, mèfɔ́.','Ja, ich bin gut aufgestanden.','a'],
  ['Áléké nèle?','Wie geht es dir?','a'],
  ['Mèle nyúíé.','Mir geht es gut.','a'],
  ['Hěde nyúíé!','Auf Wiedersehen! (Geh gut!)','b'],
  ['Mǎvá etsɔ.','Ich komme morgen.','b']
 ]},
 { cat: 'Höflichkeit', items: [
  ['Akpé!','Danke!','b'],
  ['Akpé ná wò!','Danke dir!','a'],
  ['Akpé kakaka!','Vielen, vielen Dank!','a'],
  ['Meɖe kuku.','Bitte. / Entschuldigung.','a'],
  ['Yoo.','Okay, in Ordnung.','b'],
  ['Ẽ. / Ao.','Ja. / Nein.','b'],
  ['Máwú né yrá wò!','Gott segne dich!','a']
 ]},
 { cat: 'Kennenlernen', items: [
  ['Ŋkɔ́wò ɖé?','Wie heißt du?','b'],
  ['Ŋkɔ́nyè nyé …','Mein Name ist …','a'],
  ['Afíka nètsó?','Woher kommst du?','b'],
  ['Mètsó Dzǎmanyígbá.','Ich komme aus Deutschland.','a'],
  ['Ƒe nénié nèxɔ?','Wie alt bist du?','b'],
  ['Mèle Eʋegbe srɔ̃ḿ.','Ich lerne Ewe.','a'],
  ['Mèlɔ̃ Eʋegbe.','Ich mag die Ewe-Sprache.','a'],
  ['Nyèményá o.','Ich weiß es nicht.','b'],
  ['Ameka nyé ésia?','Wer ist das?','b'],
  ['Núka nyé ésia?','Was ist das?','b']
 ]},
 { cat: 'Essen & Trinken', items: [
  ['Dɔ le wuyèḿ.','Ich habe Hunger.','b'],
  ['Tsikɔ́ le wuyèḿ.','Ich habe Durst.','b'],
  ['Mèle tsi no gé.','Ich möchte (gleich) Wasser trinken.','b'],
  ['Mèɖí ƒo.','Ich bin satt.','b'],
  ['Núɖuɖu lá nyó ŋútɔ́!','Das Essen ist sehr gut!','b'],
  ['Afíka núɖuƒé le?','Wo ist ein Restaurant?','b']
 ]},
 { cat: 'Markt & Einkaufen', items: [
  ['Nénié wòxɔ?','Wie viel kostet es?','a'],
  ['Nénié ɖeká xɔ?','Wie viel kostet eins?','b'],
  ['Éxɔ asi ákpá!','Das ist zu teuer!','b'],
  ['Éɖi ŋútɔ́.','Es ist sehr billig.','b'],
  ['Mèle sabála ƒle gé.','Ich möchte Zwiebeln kaufen.','b'],
  ['Èle děha dzráḿa?','Verkaufst du Palmwein?','b']
 ]},
 { cat: 'Unterwegs', items: [
  ['Afíka … le?','Wo ist …?','b'],
  ['Mèle Lome yiḿ.','Ich fahre nach Lome.','b'],
  ['Éle afíi.','Es ist hier.','b'],
  ['Éle afímá.','Es ist dort.','b'],
  ['Mède Kpándo kpɔ́.','Ich war schon einmal in Kpando.','b'],
  ['Ná míádzó!','Lass uns gehen!','b'],
  ['Vǎ afíi!','Komm her!','b']
 ]},
 { cat: 'Gefühle & Gesundheit', items: [
  ['Mèkpɔ́ dzidzɔ̌.','Ich bin glücklich.','b'],
  ['Ɖeɖi té ŋúnye.','Ich bin müde.','a'],
  ['Tǎ le ɖuyèḿ.','Ich habe Kopfschmerzen.','b'],
  ['Dɔme le ɖuyèḿ.','Ich habe Bauchschmerzen.','b'],
  ['Mèlɔ̃ wò.','Ich liebe dich.','a']
 ]}
];

// Wochentage und Tagesnamen (Akan-Tradition, im Ewe verbreitet)
window.EWE_DAYS = [
 ['Kwasíɖá','Sonntag','Kɔsí','Akɔ́súá'],
 ['Dzóɖá','Montag','Kɔdzó','Adzóá'],
 ['Bráɖá','Dienstag','Kɔmlá','Abrã́'],
 ['Kúɖá','Mittwoch','Aŋkú','Ákúa'],
 ['Yáwóɖá','Donnerstag','Yawo','Yawá'],
 ['Fíɖá','Freitag','Kofí','Afúá'],
 ['Memlɛ̃ɖá','Samstag','Kwami','Áma']
];

// Verben für den Konjugationstrainer (Formen nach den Regeln der Lektionen 5, 6, 8, 14, 16)
// v: Grundform im Kontext, prog: Verlaufsform-Verbteil, de: Bedeutung, tr: Objekt (transitiv)
window.EWE_VERBS = [
 { v:'yi', imp:'Yi', prog:'yiyiḿ', ing:'yiyí gé', de:'gehen', obj:'' },
 { v:'vá', imp:'Vǎ', prog:'vaváḿ', ing:'vavá gé', de:'kommen', obj:'' },
 { v:'dzó', imp:'Dzǒ', prog:'dzodzóḿ', ing:'dzodzó gé', de:'weggehen', obj:'' },
 { v:'sí', imp:'Sǐ', prog:'sisíḿ', ing:'sisí gé', de:'weglaufen', obj:'' },
 { v:'ɖu nú', imp:'Ɖu nú', prog:'nú ɖuḿ', ing:'nú ɖu gé', de:'essen', obj:'nú' },
 { v:'no tsi', imp:'No tsi', prog:'tsi noḿ', ing:'tsi no gé', de:'Wasser trinken', obj:'tsi' },
 { v:'wɔ dɔ̌', imp:'Wɔ dɔ̌', prog:'dɔ̌ wɔḿ', ing:'dɔ̌ wɔ gé', de:'arbeiten', obj:'dɔ̌' },
 { v:'dzi ha', imp:'Dzi ha', prog:'ha dziḿ', ing:'ha dzi gé', de:'singen', obj:'ha' },
 { v:'ɖa nú', imp:'Ɖa nú', prog:'nú ɖaḿ', ing:'nú ɖa gé', de:'kochen', obj:'nú' },
 { v:'ƒle nú', imp:'Ƒle nú', prog:'nú ƒleḿ', ing:'nú ƒle gé', de:'(etwas) kaufen', obj:'nú' },
 { v:'le tsi', imp:'Le tsi', prog:'tsi leḿ', ing:'tsi le gé', de:'baden', obj:'tsi' },
 { v:'fa aví', imp:'Fa aví', prog:'aví faḿ', ing:'aví fa gé', de:'weinen', obj:'aví' }
];
window.EWE_PRONOUNS = [
 // [deutsch, Aorist-Präfix, Negation-Präfix, Futur-Präfix, Futur-Negation, Progressiv-Subjekt]
 ['ich','mè','nyèmé','mǎ','nyèmá','mèle'],
 ['du','è','mě','ǎ','mǎ','èle'],
 ['er/sie/es','é','mé','á','má','éle'],
 ['wir','mí','míé','míá','míá','míle'],
 ['ihr','mì','mìé','mìá','mìá','mìle'],
 ['sie (Pl.)','wó','wómé','wóá','wómá','wóle']
];
