// Lektionen nach Dzablu-Kumah, "Basic Ewe for Foreign Students" (2. Aufl., Köln 2015),
// Erklärungen sinngemäß ins Deutsche übertragen. Tonzeichen wie im Buch:
// á = Hochton, a (unmarkiert) = Tiefton, ǎ = steigend, â = fallend; bei Pronomen ist der Tiefton mit à markiert.
window.EWE_LESSONS = [
{
 n: 1, title: 'Artikel, Eigenschaften, Fragen, Verneinung',
 goal: 'Du kannst sagen, wie etwas ist („Der Baum ist hoch“), danach fragen und es verneinen.',
 sections: [
  { h: 'Der bestimmte Artikel: lá / -á',
    t: 'Der Artikel steht <b>nach</b> dem Nomen. <b>lá</b> ist ein eigenes Wort, <b>-á</b> wird angehängt. Nach einem Tiefton wird -a meist ebenfalls tief.',
    ex: [['atí lá / atíá','der Baum'],['xɔ lá / xɔa','das Haus'],['mɔ́ lá / mɔ́á','der Weg']] },
  { h: 'Eigenschaften mit Zustandsverben',
    t: 'Ewe drückt „ist groß, ist lang …“ meist mit einem <b>Verb</b> aus, nicht mit einem Adjektiv. Das Verb folgt dem Subjekt – ein „ist“ braucht man nicht.',
    ex: [['Atí lá kɔ́.','Der Baum ist hoch.'],['Mɔ́á didi.','Der Weg ist lang.'],['Tsi lá fá.','Das Wasser ist kalt.'],['Ga lá xɔ dzo.','Das Metall ist heiß. („empfängt Feuer“)']] },
  { h: 'Ja/Nein-Fragen mit -a',
    t: 'Hänge einfach ein tieftoniges <b>-a</b> an das Satzende. Antwort: <b>Ẽ</b> (ja) oder <b>Ao / O</b> (nein).',
    ex: [['Atí lá kɔ́a?','Ist der Baum hoch?'],['Ẽ, atí lá kɔ́.','Ja, der Baum ist hoch.'],['Agblea loloa?','Ist die Farm groß?']] },
  { h: 'Verneinung: mé- … o',
    t: '<b>mé-</b> wird vor das Verb gesetzt, <b>o</b> steht am Satzende. Mr. Kumah pflegte zu sagen, wenn jemand das o vergaß: „Du hast noch etwas in der Tasche!“',
    ex: [['Adidóá métri o.','Der Baobab ist nicht dick.'],['Agbalẽ lá ményó o.','Das Buch ist nicht gut.'],['Xɔ lá mékɔ́ o.','Das Haus ist nicht hoch.']] }
 ],
 sentences: [
  ['Atí lá kɔ́.','Der Baum ist hoch.'],['Mɔ́á didi.','Der Weg ist lang.'],['Agbleá lolo.','Die Farm ist groß.'],
  ['Tsi lá fá.','Das Wasser ist kalt.'],['Fésrea keke.','Das Fenster ist breit.'],['Mɔ́ lá xáxɛ́.','Der Weg ist eng.'],
  ['Xeví lá nyó.','Der Vogel ist schön.'],['Akɔɖúá bɔbɔ.','Die Banane ist weich.'],['Ame lá kpui.','Die Person ist klein.'],
  ['Kpé lá sẽ́.','Der Stein ist hart.'],['Nákea sɔgbɔ.','Das Brennholz reicht.'],['Zikpui lá sɔe.','Der Hocker ist klein.'],
  ['Atí lá kɔ́a?','Ist der Baum hoch?'],['Ẽ, atí lá kɔ́.','Ja, der Baum ist hoch.'],['Xɔ lá mékɔ́ o.','Das Haus ist nicht hoch.'],
  ['Zea mélolo o.','Der Topf ist nicht groß.'],['Gasɔ́ lá mésẽ́ o.','Das Fahrrad ist nicht stabil.'],['Kplɔ̃ lá mékeke o.','Der Tisch ist nicht breit.'],
  ['Kétéke lá médidi o.','Der Zug ist nicht lang.'],['Ablegɔ́ lá mégblẽ́ o.','Der Stuhl ist nicht kaputt.']
 ]
},
{
 n: 2, title: 'Adverbien und die Frage „Wie ist …?“',
 goal: 'Du kannst Eigenschaften verstärken („sehr“, „zu“, „wirklich“) und mit áléké … le? fragen.',
 sections: [
  { h: 'Adverbien stehen hinter dem Verb',
    t: 'Wie Artikel hinter dem Nomen stehen, so stehen Adverbien hinter dem Verb. Wichtige Adverbien: <b>ŋútɔ́</b> sehr, <b>ákpá</b> zu (sehr), <b>kóŋ</b> wirklich/äußerst, <b>kúráá</b> ziemlich, <b>vávã̌</b> wahrhaftig, <b>kéŋkéŋ / pétéé</b> völlig, <b>ázɔ̃́</b> jetzt, <b>tútútú</b> genau.<br>Daneben gibt es „Bildadverbien“ (Ideophone) – die „Würze“ der Sprache, die man im echten Gespräch lernt.',
    ex: [['Agblea lolo ŋútɔ́.','Die Farm ist sehr groß.'],['Mɔ́á didi ákpá.','Der Weg ist zu lang.'],['Tsi lá fá ázɔ̃́.','Das Wasser ist jetzt kalt.'],['Akɔɖúá bɔbɔ kéŋkéŋ.','Die Banane ist ganz weich.']] },
  { h: 'Fragen mit áléké … le?',
    t: '<b>Áléké X le?</b> bedeutet „Wie ist X?“.',
    ex: [['Áléké xɔ lá le?','Wie ist das Haus?'],['Xɔ lá kɔ́ ŋútɔ́.','Das Haus ist sehr hoch.']] },
  { h: 'Und, mit, aber',
    t: '<b>éye</b> und (zwischen Sätzen), <b>kplé</b> und/mit (zwischen Nomen), <b>gaké</b> aber.',
    ex: [['Tsi lá fá gaké ga lá xɔ dzo.','Das Wasser ist kalt, aber das Metall ist heiß.']] },
  { h: 'Adverbien in der Verneinung',
    t: '<b>ŋútɔ́, vávã̌</b> und <b>ázɔ̃́</b> kann man nicht verneinen. Man nimmt Ersatzwörter: <b>kúráá</b> (überhaupt nicht), <b>tútútú</b> (nicht wirklich), <b>haɖé</b> (noch nicht).',
    ex: [['Atí lá mékɔ́ kúráá o.','Der Baum ist überhaupt nicht hoch.'],['Adidóá métri tútútú o.','Der Baobab ist nicht wirklich dick.'],['Tsi lá méfá haɖé o.','Das Wasser ist noch nicht kalt.']] }
 ],
 sentences: [
  ['Atí lá kɔ́ ŋútɔ́.','Der Baum ist sehr hoch.'],['Mɔ́á didi ákpá.','Der Weg ist zu lang.'],['Agblea lolo kóŋ.','Die Farm ist wirklich groß.'],
  ['Ga lá xɔ dzo kúráá.','Das Metall ist ziemlich heiß.'],['Amea sẽ́ vávã̌.','Die Person ist wirklich stark.'],['Xeví lá nyó ŋútɔ́.','Der Vogel ist sehr schön.'],
  ['Ʋɔtrúá keke ákpá.','Die Tür ist zu breit.'],['Nákea sɔgbɔ ákpá.','Es ist zu viel Brennholz.'],['Ablegɔ́ lá gblẽ́ pétéé.','Der Stuhl ist völlig kaputt.'],
  ['Zikpui lá sɔe kúráá.','Der Hocker ist ziemlich klein.'],['Áléké atí lá le?','Wie ist der Baum?'],['Áléké tsia le?','Wie ist das Wasser?'],
  ['Tsi lá méfá haɖé o.','Das Wasser ist noch nicht kalt.'],['Atí lá mékɔ́ kúráá o.','Der Baum ist überhaupt nicht hoch.'],
  ['Fésrea mékeke nyúíé o.','Das Fenster ist nicht breit genug.']
 ]
},
{
 n: 3, title: 'Plural, Zahlen, Handlungsverben, Adjektive, Vergleich',
 goal: 'Du kannst zählen, Mehrzahl bilden, sagen was jemand getan hat und vergleichen.',
 sections: [
  { h: 'Plural mit -wó',
    t: 'Plural: <b>-wó</b> anhängen. Bei bestimmten Nomen kommt -wó nach dem Artikel -á. Sammelbegriffe (Reis, Wasser, Salz, Mais …) nehmen meist kein -wó. Mit Zahlwort entfällt -wó – außer das Nomen ist bestimmt.',
    ex: [['atíwó','Bäume'],['atíáwó','die Bäume'],['ŋútsuawó','die Männer'],['atí eve','zwei Bäume'],['atí eveawó','die zwei Bäume'],['nyɔ́nu etɔ̃','drei Frauen']] },
  { h: 'Die Zahlen',
    t: '1 ɖeká, 2 eve, 3 etɔ̃, 4 ene, 5 atɔ̃́, 6 adé, 7 adrẽ́, 8 enyí, 9 asíéke, 10 ewó.<br>11–19 mit <b>wúí-</b> (aus ewó „zehn“): wúíɖekɛ́, wúíeve … wúíasíéke.<br>Die Ewe zählen in Zehnern: <b>bláeve</b> = „zwei Bündel“ = 20, bláetɔ̃ 30, bláene 40 …<br>21 = <b>bláeve vɔ̌ ɖekɛ́</b> („zwanzig, über um eins“). 100 <b>alafá ɖeká</b>, 1000 <b>akpé ɖeká</b>. Übe im Zahlen-Trainer unter „Mehr“!',
    ex: [['ɖeká, eve, etɔ̃, ene, atɔ̃́','1, 2, 3, 4, 5'],['adé, adrẽ́, enyí, asíéke, ewó','6, 7, 8, 9, 10'],['wúíeve','12'],['bláeve vɔ̌ atɔ̃́','25'],['alafá eve','200']] },
  { h: 'Handlungsverben: die Grundform ist Vergangenheit',
    t: 'Bei Handlungsverben bezeichnet die einfache Verbform eine <b>abgeschlossene</b> Handlung (Vergangenheit). Das Objekt folgt dem Verb. Achtung: <b>ƒle</b> kaufen (Festes) vs. <b>dze</b> kaufen (Flüssiges).',
    ex: [['Ŋútsuwó tso atíwó.','Männer fällten Bäume.'],['Nyɔ́nuwó ɖa te.','Frauen kochten Yams.'],['Kɔsí ƒle wɔ́, éye Akɔ́súá dze ami.','Kɔsi kaufte Mehl und Akɔsua kaufte Öl.']] },
  { h: 'Adjektive durch Verdopplung',
    t: 'Aus Zustandsverben bildet man Adjektive meist durch <b>Verdopplung</b>; das Adjektiv steht hinter dem Nomen, -wó hängt am letzten Wort. Beispiele: kɔ̌ → <b>kɔ́kɔ́</b> hoch, sẽ̌ → <b>sésẽ́</b> stark, tri → <b>titrǐ</b> dick, gblẽ̌ → <b>gbégblẽ́</b> kaputt, lolo → <b>lolǒ</b> groß, sɔe → <b>sɔě</b> klein, nyǒ → <b>nyúí</b> schön.',
    ex: [['atí kɔ́kɔ́ lá','der hohe Baum'],['tsi fáfá lá','das kalte Wasser'],['xɔ lolǒ lá','das große Haus'],['atí kɔ́kɔ́wó','hohe Bäume']] },
  { h: 'Vergleich mit wú „übertreffen“',
    t: 'Der Vergleich nutzt ein zweites Verb: <b>wú</b> „übertreffen“ (Verbserialisierung). Superlativ: <b>wú wó kátã́</b> „übertrifft sie alle“. <b>-tɔ</b> macht ein Adjektiv zum Nomen: lolǒtɔ „der Große“.',
    ex: [['Atíglínyi lolo wú to.','Der Elefant ist größer als der Büffel.'],['Atíglínyi lolo wú wó kátã́.','Der Elefant ist der größte.'],['to lolǒtɔ','der große Büffel']] },
  { h: 'Kommen und gehen',
    t: '<b>vá</b> kommen, <b>yi</b> gehen, <b>dzó</b> weggehen, <b>gbɔ</b> zurückkehren, <b>de</b> schon dort gewesen sein, <b>tsó</b> kommen aus, <b>xóxó</b> schon.',
    ex: [['Kɔdzó dzóa?','Ist Kɔdzo weggegangen?'],['Adzóá yi Kpándo xóxó.','Adzoa ist schon nach Kpando gegangen.']] }
 ],
 sentences: [
  ['Ŋútsuwó tso atíwó.','Männer fällten Bäume.'],['Nyɔ́nuwó ɖa te.','Frauen kochten Yams.'],['Nyɔ́nu eveawó ɖa mɔ́li lá.','Die zwei Frauen kochten den Reis.'],
  ['Ame eneawó ƒle zěáwó.','Die vier Leute kauften die Töpfe.'],['Kɔsí ƒle wɔ́, éye Akɔ́súá dze ami.','Kɔsi kaufte Mehl und Akɔsua kaufte Öl.'],
  ['Nyɔ́nuawó nya avɔ̌ adrẽ́.','Die Frauen wuschen sieben Tücher.'],['Sukúvíáwó dzi hawó.','Die Schüler sangen Lieder.'],
  ['Núfíálá lá fíá ha adrẽ́.','Der Lehrer brachte sieben Lieder bei.'],['Atí kɔ́kɔ́ lá mu.','Der hohe Baum fiel um.'],
  ['Xeví nyúí lá ɖu abólo kákɛ́ lá.','Der schöne Vogel aß das Stück Brot.'],['Mɔ́ didǐ lá xáxá ŋútɔ́.','Der lange Weg ist sehr eng.'],
  ['Atí lá kɔ́ wú xɔa.','Der Baum ist höher als das Haus.'],['Ga lá xɔ dzo wú wó kátã́.','Das Metall ist das heißeste.'],
  ['To tri ŋútɔ́, gaké atíglínyi tri wú.','Der Büffel ist sehr dick, aber der Elefant ist dicker.'],
  ['Nyɔ́nuawó dzi ha wú ŋútsuawó.','Die Frauen sangen besser als die Männer.'],['Akɔ́súá gbɔ tsó aƒéa?','Ist Akɔsua von zu Hause zurückgekehrt?'],
  ['Kɔdzó tsó Kpálíme.','Kɔdzo kommt aus Kpalime.']
 ]
},
{
 n: 4, title: 'Unbestimmter Artikel, Demonstrativa, „sein“: nyé und le',
 goal: 'Du kannst „dieser/jener“ sagen und weißt, wann „sein“ nyé und wann le heißt.',
 sections: [
  { h: 'Unbestimmter Artikel: áɖé',
    t: '<b>áɖé</b> heißt „ein gewisser“ und steht nach dem Nomen; Plural <b>áɖéwó</b> „einige“. Bei „Was ist das? – Das ist ein Tisch“ verwendet Ewe <b>keinen</b> Artikel.',
    ex: [['ame áɖé','eine (gewisse) Person'],['Atí áɖé mu.','Ein Baum ist umgefallen.'],['Atí áɖéwó mu.','Einige Bäume sind umgefallen.'],['Núka nyé ésia? Ésia nyé xɔ.','Was ist das? Das ist ein Haus.']] },
  { h: 'Dieser, jener',
    t: '<b>sia</b> dieser, <b>siawó</b> diese; <b>má</b> jener, <b>máwó</b> jene; <b>kemɛ</b> jener dort drüben. Sie stehen ganz am Ende der Nominalgruppe.',
    ex: [['ɖeví sia','dieses Kind'],['xeví máwó','jene Vögel'],['ŋútsuví nyúí sia','dieser brave Junge']] },
  { h: 'Zwei Arten von „sein“',
    t: '<b>nyé</b> = „etwas sein“ (Wer/Was ist X?). <b>le</b> = „irgendwo/irgendwie sein“, „sich befinden“ (Wo? Wie? Wann?).',
    ex: [['Kɔsí nyé ŋútsuví.','Kɔsi ist ein Junge.'],['Akɔ́súá nyé nyɔ́nuví.','Akɔsua ist ein Mädchen.'],['Kɔdzó le Lome.','Kɔdzo ist in Lome.'],['Akɔ́súá le afíi.','Akɔsua ist hier.'],['Afíka Kpálíme le?','Wo liegt Kpalime?']] },
  { h: 'Verneinung von nyé und le',
    t: '<b>ményé … o</b>, <b>méle … o</b>. Ohne Ergänzung wird méle zu <b>mélii o</b> „ist nicht da“.',
    ex: [['Kɔsí ményé nyɔ́nuví o.','Kɔsi ist kein Mädchen.'],['Kɔdzó méle Kpálíme o.','Kɔdzo ist nicht in Kpalime.'],['Adzóá mélii o.','Adzoa ist nicht da.']] }
 ],
 sentences: [
  ['Dzatá nyé lã sésẽ́ áɖé.','Der Löwe ist ein starkes Tier.'],['Adelá áɖé wu dzatá lá.','Ein Jäger tötete den Löwen.'],
  ['Kɔdzó kpɔ́ lã áɖé le afíi.','Kɔdzo sah hier ein Tier.'],['Lã lá le atí lá gbɔ́.','Das Tier ist neben dem Baum.'],
  ['Lome nyé du gã́ áɖé le Tógó.','Lome ist eine große Stadt in Togo.'],['Afíka Kpálíme le? Kpálíme le Tógó.','Wo liegt Kpalime? Kpalime liegt in Togo.'],
  ['Ameka nyé ésia?','Wer ist das?'],['Ŋútsuví má nyé Kɔsí.','Jener Junge ist Kɔsi.'],['Tú lá ɖi ŋútɔ́.','Das Gewehr ist sehr billig.'],
  ['Avɔ̌ lá xɔ asi ŋútɔ́.','Der Stoff ist sehr teuer.'],['Adzóá ményé ɖeví o.','Adzoa ist kein Kind.'],['Akɔ́súá méle afíi o.','Akɔsua ist nicht hier.'],
  ['Akɔ́súá mélii o.','Akɔsua ist nicht da.'],['Núka nyé ésia? Ésia nyé ablegɔ́.','Was ist das? Das ist ein Stuhl.'],
  ['Yǎmeʋú eveawó le yǎ me.','Die zwei Flugzeuge sind in der Luft.']
 ]
},
{
 n: 5, title: 'Personalpronomen und Postpositionen',
 goal: 'Du kannst ich, du, er … als Subjekt und Objekt verwenden und sagen, wo sich etwas befindet.',
 sections: [
  { h: 'Subjektpronomen',
    t: 'Sie werden direkt an das Verb gehängt:<table><tr><td><b>mè-</b> ich</td><td><b>mí-</b> wir</td></tr><tr><td><b>è-</b> du</td><td><b>mì-</b> ihr</td></tr><tr><td><b>é-</b> er/sie/es</td><td><b>wó-</b> sie</td></tr></table>Varianten: <b>nyè-</b> (ich, in verneinten Sätzen), <b>nè-</b> (du, bei Wiederholung im selben Satz oder am Fragebeginn), <b>wò-</b> (er/sie, bei Wiederholung), <b>míé-/mìé-</b> (wir/ihr, Küstendialekt).',
    ex: [['mèyi','ich ging'],['èyi','du gingst'],['éyi','er/sie ging'],['míyi','wir gingen'],['mìyi','ihr gingt'],['wóyi','sie gingen'],['Éɖu nú éye wòno nú.','Er aß und trank.']] },
  { h: 'Objektpronomen',
    t: '<table><tr><td><b>-m</b> mich</td><td><b>mí</b> uns</td></tr><tr><td><b>wò</b> dich</td><td><b>mì</b> euch</td></tr><tr><td><b>-è</b> ihn/sie/es</td><td><b>wó</b> sie</td></tr></table>-m und -è werden angehängt. -è verschmilzt: ɖa + è → <b>ɖɛ</b>; ɖu + è → <b>ɖuì</b>; kplé + è → <b>kplíì</b> „mit ihm“, kplé + m → <b>kplím</b> „mit mir“.',
    ex: [['Mèkpɔ́ mì.','Ich sah euch.'],['Wókpɔ́ mí.','Sie sahen uns.'],['Mèkpɔ́è.','Ich sah ihn/sie/es.'],['Mìkpɔ́m.','Ihr saht mich.'],['Wóɖa agbeli lá. Wóɖɛ.','Sie kochten den Maniok. Sie kochten ihn.']] },
  { h: 'Logophorische Pronomen: yè, yèwó',
    t: 'In indirekter Rede verweist <b>yè</b> (Plural <b>yèwó</b>) auf die Person, deren Worte berichtet werden.',
    ex: [['Kofí bé édzó.','Kofi sagte, er (ein anderer) sei gegangen.'],['Kofí bé yèdzó.','Kofi sagte, er (Kofi selbst) sei gegangen.']] },
  { h: 'Postpositionen',
    t: 'Ortsangaben stehen <b>nach</b> dem Nomen: <b>me</b> in, <b>dzí</b> auf, <b>gbɔ́</b> bei, <b>té</b>/<b>gɔme</b> unter, <b>megbé</b> hinter, <b>ŋgɔ</b> vor, <b>xa</b> neben, <b>dome</b> zwischen, <b>títína</b> mitten in, <b>ŋú/ŋútí</b> an, <b>tǎ</b> über. Städte- und Ländernamen brauchen keine Postposition; ebenso <b>sukú</b>, <b>aƒé</b>, <b>xéxé</b>.',
    ex: [['Xeví lá le atí lá dzí.','Der Vogel ist auf dem Baum.'],['Éle xɔ lá me.','Es ist im Zimmer.'],['Kɔsí le Lome.','Kɔsi ist in Lome.'],['Míle sukú.','Wir sind in der Schule.'],['Máwú le dziƒó.','Gott ist im Himmel.']] }
 ],
 sentences: [
  ['Kɔmla kpɔ́ dzatá. Ékpɔ́ dzatá gã́ áɖé.','Kɔmla sah einen Löwen. Er sah einen großen Löwen.'],['Sukúvíáwó yɔ́ núfíálá lá.','Die Schüler riefen den Lehrer.'],
  ['Èɖu nú éye nèno nú hã́.','Du hast gegessen und auch getrunken.'],['Míwɔ dɔ̌ ŋútɔ́.','Wir haben viel gearbeitet.'],
  ['Mèyɔ́ Kɔmla. Mèyɔ́è.','Ich rief Kɔmla. Ich rief ihn.'],['Wóƒo mí, éye mífa aví.','Sie schlugen uns und wir weinten.'],
  ['Mèƒle akɔɖú lá éye mèɖui.','Ich kaufte die Banane und aß sie.'],['Míkpɔ́ dzatá lá le avě lá me.','Wir sahen den Löwen im Wald.'],
  ['Éwɔè kplím.','Er hat es mit mir gemacht.'],['Máwú le dziƒó, éye amewó le anyígbá dzí.','Gott ist im Himmel und die Menschen sind auf der Erde.'],
  ['Nyi lá le xɔ lá megbé.','Die Kuh ist hinter dem Haus.'],['Ŋútsu lá le xɔá ŋgɔ.','Der Mann ist vor dem Haus.'],
  ['Da gã́ áɖé le kpéá té.','Eine große Schlange ist unter dem Stein.'],['Míle sukúvíáwó dome.','Wir sind unter den Schülern.'],
  ['Ameka nyé ŋútsu siá?','Wer ist dieser Mann?'],['Afíka Aƒétɔ́ Káta tsó? Étsó Lome.','Woher kommt Herr Kata? Er kommt aus Lome.'],
  ['Núka nèɖu égbe?','Was hast du heute gegessen?'],['O, nyèmékpɔ́e o.','Nein, ich habe sie nicht gesehen.']
 ]
},
{
 n: 6, title: 'Vergangenheit, transitive Verben, Verlaufsform',
 goal: 'Du kannst erzählen, was passiert ist, und sagen, was gerade geschieht („ich bin am Gehen“).',
 sections: [
  { h: 'Aorist (Vergangenheit)',
    t: 'Ein Verb ohne Zeitmarkierung bezeichnet ein <b>vergangenes</b> Ereignis. Bei Zustandsverben bedeutet dieselbe Form aber Gegenwart (Kofí kɔ́ „Kofi ist groß“). Mit <b>vɔ</b> „fertig sein“ am Ende betont man, dass etwas abgeschlossen ist.',
    ex: [['mèyi','ich ging'],['mèvá','ich kam'],['Kofí ɖu mɔ́li vɔ.','Kofi hat den Reis aufgegessen.']] },
  { h: 'Transitive Verben brauchen ein Objekt',
    t: 'Ohne konkretes Objekt setzt man <b>nú</b> „etwas“ oder <b>ame</b> „jemand“ ein: ɖu nú „essen“, ɖa nú „kochen“. Feste Verbindungen lernt man als Einheit: <b>wɔ dɔ̌</b> arbeiten, <b>fa aví</b> weinen, <b>dɔ̌ alɔ̃</b> schlafen, <b>dǒ awu</b> sich anziehen, <b>le tsi</b> baden.',
    ex: [['Abrã́ ɖa nú.','Abra hat gekocht.'],['Abrã́ ɖa te.','Abra hat Yams gekocht.'],['Kofí fiã́ xɔ lá.','Kofi hat das Haus angezündet.'],['Xɔ lá fiã́.','Das Haus ist abgebrannt.']] },
  { h: 'Serielle Verben für Richtung und Ort',
    t: 'Intransitive Verben bekommen eine Ortsangabe durch ein zweites Verb: <b>yi</b> (gehen nach), <b>le</b> (sein in).',
    ex: [['Ŋútsu lá sí yi Kéta.','Der Mann floh nach Keta.'],['Ékú le Lome.','Er starb in Lome.']] },
  { h: 'Verlaufsform (Progressiv): le … -ḿ',
    t: 'Gegenwart: <b>le</b> + Verb + <b>-ḿ</b>; Vergangenheit: <b>nɔ</b> + Verb + -ḿ. Intransitive Verben werden verdoppelt: yi → <b>le yiyiḿ</b>, vá → <b>le vaváḿ</b>. Bei transitiven Verben steht das Objekt <b>vor</b> dem Verb: <b>le nú ɖuḿ</b> „ist am Essen“. Wörtlich: „ist im Gehen“ (wie „sie ist am Gehen“).',
    ex: [['mèle yiyiḿ','ich gehe gerade'],['mènɔ yiyiḿ','ich war am Gehen'],['Éle nú ɖuḿ.','Er isst gerade.'],['éle dɔ̌ wɔḿ','sie arbeitet gerade'],['Wóle dzodzóḿ.','Sie brechen gerade auf.']] },
  { h: 'Fragen und Verneinung',
    t: 'Verneinung mit Pronomen: mé- zwischen Pronomen und Verb, <b>o</b> am Ende. „Ich“ wird zu <b>nyè-</b>.',
    ex: [['nyèméwɔ dɔ̌ o','ich habe nicht gearbeitet'],['Èle dɔ̌ wɔḿa?','Arbeitest du gerade?'],['O, nyèméle dɔ̌ wɔḿ o.','Nein, ich arbeite nicht.'],['Èle náné ɖuḿa?','Isst du gerade etwas?'],['O, nyèméle nánéké ɖuḿ o.','Nein, ich esse nichts.']] }
 ],
 sentences: [
  ['Gbe ɖeká Kɔdzó yi Lome.','Eines Tages ging Kɔdzo nach Lome.'],['Ékpɔ́ xɔ nyúí geɖewó le dua me.','Er sah viele schöne Häuser in der Stadt.'],
  ['Ablɔ̌awó keke éye wódidi ŋútɔ́.','Die Straßen sind breit und sehr lang.'],['Kɔdzó le Lome yiḿ.','Kɔdzo ist auf dem Weg nach Lome.'],
  ['Kosí hã́ le yiyiḿ.','Kosi geht auch.'],['Mìfa aví le xɔ sia megbé.','Ihr habt hinter diesem Haus geweint.'],
  ['Nyɔ́nuawó le tsi leḿ.','Die Frauen baden gerade.'],['Ŋútsuawó le aha noḿ.','Die Männer trinken gerade.'],
  ['Ɖevíáwó le feféḿ.','Die Kinder spielen gerade.'],['Adzóá le alɔ̃ dɔ́ḿ.','Adzoa schläft gerade.'],
  ['Énɔ du ƒúḿ, gaké mènɔ zɔzɔḿ.','Er rannte, aber ich ging zu Fuß.'],['Èle dɔ̌ wɔḿa?','Arbeitest du gerade?'],
  ['O, nyèméle dɔ̌ wɔḿ o.','Nein, ich arbeite nicht.'],['Mìle ha dziḿa?','Singt ihr gerade?'],
  ['Wóle Kɔsí díḿ.','Sie suchen gerade Kɔsi.'],['Mídó ɣlí ŋdí sia le sukú.','Wir haben heute Morgen in der Schule geschrien.']
 ]
},
{
 n: 7, title: 'Pronomen in der Verlaufsform, „schon einmal“ und „nie“',
 goal: 'Du kannst „er sieht mich gerade“ und „ich war noch nie in …“ sagen.',
 sections: [
  { h: 'Objektpronomen in der Verlaufsform',
    t: 'In der Verlaufsform ändern sich die Objektpronomen:<table><tr><td>mich</td><td>Kɔdzó le kpɔ́<b>yè</b>ḿ.</td></tr><tr><td>dich</td><td>Akɔ́súá le ƒo<b>wò</b>ḿ.</td></tr><tr><td>ihn/sie/es</td><td>Mèle <b>é</b>kpɔ́ḿ.</td></tr><tr><td>uns</td><td>Éle <b>míá</b> kpɔ́ḿ.</td></tr><tr><td>euch</td><td>Akɔ́súá le <b>mìà</b> ƒoḿ.</td></tr><tr><td>sie</td><td>Mèle <b>wó</b> kpɔ́ḿ.</td></tr></table>Grund: wörtlich „Kɔdzo ist in meinem Sehen“.',
    ex: [['Kɔdzó le kpɔ́yèḿ.','Kɔdzo sieht mich gerade.'],['Mèle ékpɔ́ḿ.','Ich sehe ihn/sie gerade.'],['Éle míá kpɔ́ḿ.','Er sieht uns gerade.']] },
  { h: 'Hunger und Durst',
    t: 'Wörtlich „Hunger tötet mich“: <b>dɔ wu ame</b>, „Durst tötet mich“: <b>tsikɔ́ wu ame</b>.',
    ex: [['Dɔ le wuyèḿ.','Ich habe Hunger.'],['Tsikɔ́ le wuwòḿ.','Du hast Durst.'],['Dɔ le míá wuḿ ákpá.','Wir haben großen Hunger.']] },
  { h: 'kpɔ́ „schon einmal“, kpɔ́ … o „nie“',
    t: '<b>kpɔ́</b> am Satzende: „schon einmal“. Verneint mit <b>kpɔ́ o</b>: „noch nie“. <b>zi</b> = „mal“ (zi ɖeká einmal).',
    ex: [['Mède Kpándo kpɔ́.','Ich war schon einmal in Kpando.'],['Nyèméde Kpándo kpɔ́ o.','Ich war noch nie in Kpando.'],['Nyèmése nya sia kpɔ́ o.','Ich habe davon noch nie gehört.']] }
 ],
 sentences: [
  ['Wóle kpɔ́yèḿ.','Sie sehen mich gerade.'],['Tsikɔ́ le wuyèḿ.','Ich habe Durst.'],['Dɔ le wuwòḿ.','Du hast Hunger.'],
  ['Adelááwó le toawó díḿ.','Die Jäger suchen die Büffel.'],['Éle agbalẽ xlẽḿ.','Er liest gerade ein Buch.'],
  ['Míle ɣletí kplé ɣletívíwó kpɔ́ḿ le zã̌ me.','Wir sehen nachts den Mond und die Sterne.'],['Wóle du ƒúḿ le sukú yíḿ.','Sie rennen zur Schule.'],
  ['Mède Kéta kpɔ́.','Ich war schon einmal in Keta.'],['Kɔdzó mékpɔ́ dzatá kpɔ́ o.','Kɔdzo hat noch nie einen Löwen gesehen.'],
  ['Da méɖum kpɔ́ o.','Mich hat noch nie eine Schlange gebissen.'],['Nyèmése nya sia kpɔ́ o.','Ich habe davon noch nie gehört.'],
  ['Ŋútsuví lá le Kéta yiḿ égbe.','Der Junge fährt heute nach Keta.'],['Mìde Kéta kpɔ́a?','Wart ihr schon einmal in Keta?']
 ]
},
{
 n: 8, title: 'Das Ingressiv: „im Begriff sein zu“',
 goal: 'Du kannst sagen, was gleich passiert oder was du vorhast.',
 sections: [
  { h: 'Bildung mit gé',
    t: 'Wie die Verlaufsform, aber statt -ḿ folgt <b>gé</b>: <b>le … gé</b> „ist im Begriff zu“, <b>nɔ … gé</b> „war im Begriff zu“. Intransitiv verdoppelt (yiyí gé), transitiv mit Objekt davor (nú ɖu gé).',
    ex: [['Ameawó le vavá gé.','Die Leute kommen gleich.'],['míle yiyí gé','wir gehen gleich'],['Èle nú ɖu gé.','Du willst gleich essen.'],['Kɔsí le xɔ tu gé.','Kɔsi will ein Haus bauen.'],['Tsi le dzadza géa?','Wird es regnen?']] },
  { h: 'Pronomen beim Ingressiv',
    t: 'Wie im Progressiv, aber yè und wò sind eigene Wörter: Kɔdzó le kpɔ́ <b>yè</b> gé „Kɔdzo wird mich gleich sehen“.',
    ex: [['Akɔ́súá le ƒo wò gé.','Akɔsua wird dich gleich schlagen.'],['Ŋútsu lá le wó kpɔ́ gé.','Der Mann wird sie gleich sehen.']] },
  { h: 'Verneinung',
    t: 'mé- vor dem Hilfsverb: <b>méle … gé o</b>. Verschmelzungen: è + mé → <b>mě</b>, é + mé → <b>mé</b>, mí + mé → <b>míé</b>, mì + mé → <b>mìé</b>.',
    ex: [['Kɔsí méle dɔ̌ wɔ gé o.','Kɔsi wird nicht arbeiten.'],['Nyèméle dzodzó gé o.','Ich werde nicht aufbrechen.'],['Měle yiyi gé égbe o.','Du gehst heute nicht.']] }
 ],
 dialog: { title: 'Aŋkú dó go Ákúa – Aŋku trifft Akua', lines: [
  ['Aŋkú','Ákúa! Afíka yiḿ nèle?','Akua! Wohin gehst du?'],
  ['Ákúa','Mèle fíásé gã́ má me yiḿ. Mèyi nánéwó ƒle gé le afímá.','Ich gehe in jenes große Geschäft. Ich will dort ein paar Dinge kaufen.'],
  ['Aŋkú','Mèse bé mìxɔ amedzró áɖéwó. Nyateƒé wònyéa?','Ich habe gehört, ihr habt Gäste bekommen. Stimmt das?'],
  ['Ákúa','Ẽ, ényé nyateƒé. Míxɔ amedzró eve égbe ŋdí.','Ja, das stimmt. Wir haben heute Morgen zwei Gäste empfangen.'],
  ['Aŋkú','Mìle aha hã́ dze géa? Mèle aha nyúí áɖéwó dzráḿ.','Wollt ihr auch Getränke kaufen? Ich verkaufe gute Getränke.'],
  ['Ákúa','Míle aha dze gé gódóó. Děha hã́ liia?','Wir werden auf jeden Fall Getränke kaufen. Gibt es auch Palmwein?'],
  ['Aŋkú','Ao, děha méli o.','Nein, Palmwein gibt es nicht.'],
  ['Ákúa','Yoo. Akpé!','Okay. Danke!']
 ]},
 sentences: [
  ['Sukúví áɖéwó le ha dzi gé.','Einige Schüler werden gleich singen.'],['Nyè hã́ mèle gbedóxɔ lá me yi gé.','Ich gehe gleich auch in die Kapelle.'],
  ['Wóle nú ɖa gé ná sukúvíáwó.','Sie werden gleich für die Schüler kochen.'],['Aŋkú le agble yi gé égbe.','Aŋku geht heute auf die Farm.'],
  ['Éle mɔ́li ɖaḿ ná Aŋkú.','Sie kocht Reis für Aŋku.'],['Tsi le dzadza géa?','Wird es regnen?'],['Ẽ, tsi le dzadza gé.','Ja, es wird regnen.'],
  ['Kɔsí méle dɔ̌ wɔ gé o.','Kɔsi wird nicht arbeiten.'],['Wóméle vavá gé o.','Sie werden nicht kommen.'],
  ['Éle tsi le gé le fiẽ me.','Er wird am Abend baden.'],['Núka wɔḿ nèle?','Was machst du gerade?'],
  ['Nyèméle nánéké wɔḿ o.','Ich mache gerade nichts.'],['Èkpɔ́ Abrã́ égbea?','Hast du Abra heute gesehen?'],['Yoo, akpé!','Okay, danke!']
 ]
},
{
 n: 9, title: 'Farb- und Formadjektive, das Verb nɔ, Fragen mit ɖé',
 goal: 'Du kannst Farben und Formen beschreiben und kurze Fragen wie „Wo bist du?“ und „Wie heißt du?“ stellen.',
 sections: [
  { h: 'Echte Adjektive (Farbe, Form, Zustand)',
    t: 'Einige Adjektive sind keine Verben. Prädikativ brauchen sie <b>le</b> und haben oft eine gelängte Form: <b>yibɔ</b> → le <b>yibɔɔ</b> (schwarz), <b>ɣí</b> → le <b>ɣíé</b> (weiß), <b>dzĩ</b> → le <b>dzĩe</b> (rot), <b>nogo</b> → le <b>nogoo</b> (rund).',
    ex: [['Avɔ̌ lá le yibɔɔ.','Der Stoff ist schwarz.'],['avɔ̌ yibɔ lá','der schwarze Stoff'],['Kpé lá le nogoo.','Der Stein ist rund.'],['Tsi lá le kpɔtɔɔ.','Das Wasser ist schlammig.']] },
  { h: 'nɔ: war, wohnen, bleiben, existieren',
    t: '<b>nɔ</b> ist die Vergangenheit von le („war“), bedeutet aber auch „wohnen“, „bleiben“, „existieren“. <b>nɔ anyí</b> = sich setzen.',
    ex: [['Mínɔ afímá.','Wir waren dort.'],['Nyɔ́nu lá nɔ míá gbɔ́.','Die Frau blieb bei uns.'],['Ŋútsu áɖé nɔ Agu.','Ein Mann wohnte in Agu.']] },
  { h: 'Kurze Fragen mit ɖé und ɖě',
    t: '<b>… ɖé?</b> am Ende: „wo ist …?“ oder „wie steht es mit …?“. <b>Ɖě … -a?</b> „Stimmt es, dass …?“',
    ex: [['Wò ɖé?','Wo bist du?'],['Ŋkɔ́wò ɖé?','Wie heißt du?'],['Ameawó ɖé?','Wo sind die Leute?'],['Ɖě mìde Pekí etsɔa?','Stimmt es, dass ihr gestern in Peki wart?']] }
 ],
 sentences: [
  ['Avɔ̌ lá le dzĩe gaké afɔkpa lá le yibɔɔ.','Der Stoff ist rot, aber der Schuh ist schwarz.'],['Afɔkpa yibɔ lá nyó ŋútɔ́.','Der schwarze Schuh ist sehr schön.'],
  ['Kpé lá le nogoo.','Der Stein ist rund.'],['Tsi lá le kpɔtɔɔ vavã.','Das Wasser ist wirklich schlammig.'],
  ['Ŋútsu áɖé nɔ anyí gbaɖégbe.','Es war einmal ein Mann.'],['Lã geɖewó nɔ avě lá me.','Viele Tiere lebten in dem Wald.'],
  ['Wò ɖé?','Wo bist du?'],['Ŋkɔ́wò ɖé?','Wie heißt du?'],['Amedzróáwó ɖé?','Wo sind die Gäste?'],
  ['Ɖevíáwó le feféḿ le ké me.','Die Kinder spielen im Sand.'],['Wó kátã́ ɖu nú ɖíƒo.','Sie haben alle satt gegessen.'],
  ['Nyèményá o.','Ich weiß es nicht.']
 ]
},
{
 n: 10, title: 'Betonte Pronomen, Hervorhebung, Doppelfragen',
 goal: 'Du kannst betonen: „ICH war es“, „Ein HAUS haben wir gekauft“, und „Entweder-oder“-Fragen stellen.',
 sections: [
  { h: 'Absolute Pronomen',
    t: '<table><tr><td><b>nyè</b> ich</td><td><b>míáwó</b> wir</td></tr><tr><td><b>wò</b> du</td><td><b>mìàwó</b> ihr</td></tr><tr><td><b>éyà</b> er/sie</td><td><b>wóáwó</b> sie</td></tr></table>Mit dem Betonungssuffix <b>-é</b>: nyèé „ich bin es“, wòé „du bist es“, éyàé „er/sie ist es“.',
    ex: [['Nyèé wu da lá.','ICH habe die Schlange getötet.'],['Wòé kpɔ́ wó.','DU hast sie gesehen.'],['Éyàé wóyɔ́.','IHN haben sie gerufen.']] },
  { h: 'Nomen hervorheben mit -é',
    t: 'Das betonte Element bekommt <b>-é</b> und rückt an den Satzanfang. Bei erweiterten Nomen hängt -é am letzten Wort.',
    ex: [['Atíé.','Es ist wirklich ein Baum.'],['Ŋútsuvíé mèkpɔ́.','Einen JUNGEN habe ich gesehen.'],['Xɔé míƒle.','Ein HAUS haben wir gekauft.'],['Adelá eveawóé wu to lá.','Die ZWEI JÄGER haben den Büffel getötet.']] },
  { h: 'Doppelfragen: … lóó aló …-a?',
    t: '„Oder“-Fragen: <b>Ɖě … lóó aló ɖě …-a?</b>',
    ex: [['Ɖě nèƒle avɔ̌ lá lóó aló ɖě wótsɔ́e ná woa?','Hast du den Stoff gekauft oder hat man ihn dir gegeben?'],['Nyèméƒlii o, fiaé tsɔ́e nám.','Ich habe ihn nicht gekauft, der KÖNIG hat ihn mir gegeben.']] }
 ],
 sentences: [
  ['Nyèé wu da lá.','Ich habe die Schlange getötet.'],['Wóáwóé ƒo mí.','SIE haben uns geschlagen.'],['Ményé nyèé o.','Ich war es nicht.'],
  ['Agblenúé mítsɔ́ ŋlɔ agble lá.','Mit einer HACKE haben wir die Farm gejätet.'],['Xɔ gãé nèƒle.','Ein GROSSES Haus hast du gekauft.'],
  ['Fiaé wóɖóe vávã̌.','Zum KÖNIG haben sie ihn wirklich gemacht.'],['Kɔdzó sámá Kɔsí ná fia.','Kɔdzo hat Kɔsi beim König vorgeladen.'],
  ['Nyèméƒlii o.','Ich habe es nicht gekauft.'],['Ménɔ mɔ́á me o.','Es war nicht auf dem Weg.'],
  ['Amekawóé dó ɣlí le asi lá me?','Wer hat auf dem Markt geschrien?']
 ]
},
{
 n: 11, title: 'Besitz (Genitiv) und vorangestellte Possessivpronomen',
 goal: 'Du kannst „Amas Haus“, „mein Buch“, „unser Vater“ sagen und die Familie benennen.',
 sections: [
  { h: 'Besitzanzeiger ƒé',
    t: 'Besitzer + <b>ƒé</b> + Besitz. Bei <b>Verwandtschaft</b> steht nichts dazwischen. Bei Körperteilen ist ƒé Pflicht – ohne ƒé wird das Wort zur Postposition!',
    ex: [['Aŋkú ƒé xɔ mu.','Aŋkus Haus ist eingestürzt.'],['Xɔ lá ƒé gliwó tri.','Die Wände des Hauses sind dick.'],['Adzóá fofó vá.','Adzoas Vater ist gekommen.'],['Adzóá ƒé tǎ','Adzoas Kopf'],['Adzóá tǎ','über Adzoa']] },
  { h: 'Possessivpronomen vor dem Nomen',
    t: '<table><tr><td><b>nyě</b> mein</td><td><b>míáƒé</b> unser</td></tr><tr><td><b>wǒ</b> dein</td><td><b>mìàƒé</b> euer</td></tr><tr><td><b>éƒé</b> sein/ihr</td><td><b>wóƒé</b> ihr (Pl.)</td></tr></table>Ohne ƒé bei: Familie (míá fofó), Körperteilen (míá ŋkúme), Verbalnomen, Täter-Nomen, Nationalitäten und den Wörtern ŋkɔ́, de, aƒé.',
    ex: [['Nyě xɔ mu.','Mein Haus ist eingestürzt.'],['Wǒ agbalẽ bú.','Dein Buch ist verloren.'],['Míáƒé atíwó sɔgbɔ.','Unsere Bäume sind zahlreich.'],['míá fofó','unser Vater'],['éŋkɔ́','sein/ihr Name']] },
  { h: 'Familie',
    t: '<b>fofó</b> / <b>tɔ́</b> Vater, <b>dadá</b> / <b>nɔ</b> Mutter, <b>nɔví</b> Geschwister, <b>tsɛ</b> jüngerer Bruder, <b>fǒ</b> älterer Bruder, <b>ƒoe</b> jüngere Schwester, <b>tási</b> Tante (väterl.), <b>nɔɖi</b> Tante (mütterl.), <b>tɔ́ɖi</b> Onkel, <b>tɔ́gbúí</b> Großvater, <b>mamá</b> Großmutter, <b>srɔ̃</b> Ehepartner.' ,
    ex: [['Ɖevíá dadá mélii o.','Die Mutter des Kindes ist nicht da.'],['Ŋútsua srɔ̃ dzó.','Die Frau des Mannes ist gegangen.']] }
 ],
 sentences: [
  ['Aŋkú ƒé xɔ mu.','Aŋkus Haus ist eingestürzt.'],['Ameka ƒé awué nyé ésia?','Wessen Kleidung ist das?'],
  ['Amekawó ƒé gbeé nyé Eʋegbe?','Wessen Sprache ist Ewe?'],['Eʋeawó ƒé gbeé.','Es ist die Sprache der Ewe.'],
  ['Adzóá dada mélii o.','Adzoas Mutter ist nicht da.'],['Nyě agble lolo wú Yawo ƒé agble.','Meine Farm ist größer als Yawos Farm.'],
  ['Wǒ xɔ lá le dua títína.','Dein Haus ist mitten in der Stadt.'],['Míáƒé atíwó sɔgbɔ.','Unsere Bäume sind zahlreich.'],
  ['Wóƒé xɔwó ményó o.','Ihre Häuser sind nicht gut.'],['Yawo nyé lãnyilá.','Yawo ist Viehzüchter.'],['Ényé kesinɔtɔ́.','Er ist ein reicher Mann.']
 ]
},
{
 n: 12, title: 'Nachgestellte Possessivpronomen, „meins“, „wie viel?“',
 goal: 'Du kannst „mein Vater“ natürlich ausdrücken, „meins/deins“ sagen und nach Mengen und Preisen fragen.',
 sections: [
  { h: 'Possessiv hinter dem Nomen',
    t: 'Sehr gebräuchlich: <b>-nyè</b> (mein) und <b>-wò</b> (dein) werden angehängt (tieftonig): <b>xɔwò</b> = wǒ xɔ. Bei Verwandten immer so: <b>vǐnyè</b> mein Kind, <b>fofónyè</b> mein Vater, <b>dǎnyè</b> meine Mutter, <b>nɔvínyè</b> mein Geschwister, <b>tsɛnyè</b> mein jüngerer Bruder, <b>srɔ̃nyè</b> mein Ehepartner. 3. Person: -a angehängt: <b>fofóá</b> sein/ihr Vater.',
    ex: [['Xɔwò mu.','Dein Haus ist eingestürzt.'],['fofónyè','mein Vater'],['dǎwò','deine Mutter'],['tɔ́gbúínyè','mein Großvater'],['fofóá','sein/ihr Vater']] },
  { h: 'meins, deins …',
    t: '<b>tɔnyè</b> meins, <b>tɔwò</b> deins, <b>étɔ</b> seins/ihrs, <b>míá tɔ</b> unseres, <b>mìà tɔ</b> eures, <b>wó tɔ</b> ihres. <b>tɔ</b> allein = „der/die/das von …“.',
    ex: [['Tɔnyèé, ményé étɔé o.','Es ist MEINS, nicht seins.'],['Xɔ sia mélolo wú ŋútsu sia tɔ o.','Dieses Haus ist nicht größer als das dieses Mannes.']] },
  { h: 'Ordnungszahlen und Fragewörter',
    t: '<b>gbã́tɔ</b> erster, <b>evelíá</b> zweiter, <b>etɔ̃líá</b> dritter. Fragewörter: ameka? wer, núka? was, afíka? wo, áléké … le? wie, <b>nénié?</b> wie viel/wie viele, núkatǎ? warum.',
    ex: [['Ame nénié le xɔ sia me?','Wie viele Leute sind in diesem Haus?'],['Ƒe nénié nèxɔ?','Wie alt bist du? („Wie viele Jahre hast du empfangen?“)'],['Mèxɔ ƒe bláeve.','Ich bin zwanzig Jahre alt.']] }
 ],
 sentences: [
  ['Fofónyè yɔ́m.','Mein Vater rief mich.'],['Dǎnyè ná ŋdínúɖuɖu mí.','Meine Mutter gab uns Frühstück.'],
  ['Agbledede nyé dɔ̌ nyúí áɖé.','Landwirtschaft ist eine gute Arbeit.'],['Èwɔ dɔ̌ le agble me kpɔ́a?','Hast du schon einmal auf einer Farm gearbeitet?'],
  ['Xɔ gbã́tɔ nyé tɔwò.','Das erste Haus ist deins.'],['Mìà tɔ méle afíi o.','Eures ist nicht hier.'],
  ['Ame nénié le xɔ sia me?','Wie viele Leute sind in diesem Haus?'],['Ƒe nénié nèxɔ?','Wie alt bist du?'],
  ['Nénié ɖeká xɔ?','Wie viel kostet eins?'],['Kplɔ̃ nénié agbledelá lá ƒle?','Wie viele Tische hat der Bauer gekauft?']
 ]
},
{
 n: 13, title: '„Haben“: le así',
 goal: 'Du kannst sagen, was jemand hat – und was nicht.',
 sections: [
  { h: 'Etwas haben = „in der Hand sein“',
    t: 'Ewe hat kein Verb „haben“. Man sagt: X <b>le</b> (jemandes) <b>así</b> – „X ist in der Hand von …“. Mit Besitzer davor wird así zu <b>sí</b>. Vergangenheit: <b>nɔ … sí</b>.',
    ex: [['Ga le asínyè.','Ich habe Geld.'],['Sɔ́ le asíwò.','Du hast ein Pferd.'],['Ga le ésí.','Er/Sie hat Geld.'],['Xɔ le míá sí.','Wir haben ein Haus.'],['Zě le Áma sí.','Ama hat einen Topf.'],['Ga nɔ asínyè.','Ich hatte Geld.'],['Xɔ ménɔ míá sí o.','Wir hatten kein Haus.']] },
  { h: 'Körper und Familie: lii ná',
    t: 'Bei Körperteilen und Verwandten sagt man <b>lii ná</b> „existiert für“.',
    ex: [['Tǎ lii nám.','Ich habe einen Kopf.'],['Tsɛ lii nám.','Ich habe einen jüngeren Bruder.'],['Afɔ eve lii ná mí.','Wir haben zwei Füße.'],['Atsú lii ná Áma.','Ama hat einen Ehemann.']] }
 ],
 song: { title: 'Ɖevíwó ƒé ha – Das Kinderlied', lines: [
  ['Tǎ lii ná mí ná tǎmebubu.','Wir haben einen Kopf zum Denken.'],
  ['Ŋkú lii ná mí ná núkpɔ́kpɔ́.','Wir haben Augen zum Sehen.'],
  ['Nu lii ná mí ná nuƒoƒo kplé núɖuɖu.','Wir haben einen Mund zum Sprechen und Essen.'],
  ['Tó lii ná mí ná núsese.','Wir haben Ohren zum Hören.'],
  ['Así lii ná mí ná dɔ̌wɔwɔ.','Wir haben Hände zum Arbeiten.'],
  ['Afɔ lii ná mí ná zɔzɔ kplé duƒúƒú.','Wir haben Füße zum Gehen und Rennen.'],
  ['Fofó kplé dadá lii ná míá dzikpɔ́kpɔ́.','Wir haben Vater und Mutter, die für uns sorgen.']
 ]},
 sentences: [
  ['Ga le asínyè.','Ich habe Geld.'],['Xɔ le míá sí.','Wir haben ein Haus.'],['Nyi ewó le fia sí.','Der König hat zehn Kühe.'],
  ['Ga le tɔ́gbúínyè sí.','Mein Großvater hat Geld.'],['Avǔ nɔ Kwami sí.','Kwami hatte einen Hund.'],['Vǐ eve nɔ ésí.','Er hatte zwei Kinder.'],
  ['Tsɛ lii nám.','Ich habe einen jüngeren Bruder.'],['Tǎ lii nám.','Ich habe einen Kopf.'],['Núka le asíwò?','Was hast du?'],
  ['Fífíá xɔ atɔ̃́ le asínyè le Lome.','Jetzt habe ich fünf Häuser in Lome.']
 ]
},
{
 n: 14, title: 'Befehlsform und das Verb ná „geben/für“',
 goal: 'Du kannst Aufforderungen geben, verbieten und sagen, wem du etwas gibst oder für wen du etwas tust.',
 sections: [
  { h: 'Imperativ',
    t: 'Singular: das Verb allein. Hochtonige Verben bekommen dabei einen <b>steigenden</b> Ton: vá → <b>Vǎ!</b> Plural: <b>mì-</b> davor (Ton bleibt hoch): <b>Mìvá!</b>',
    ex: [['Vǎ!','Komm!'],['Yi!','Geh!'],['Dzi ha!','Sing!'],['Kofí, vǎ afíi!','Kofi, komm her!'],['Mìvá!','Kommt!'],['Mìnɔ anyí!','Setzt euch!']] },
  { h: 'Verbot',
    t: '<b>Mèga- … o!</b> (zu einer Person), <b>Mìga- … o!</b> (zu mehreren).',
    ex: [['Ʋu ʋɔtrúá!','Öffne die Tür!'],['Mègaʋu ʋɔtrúá o!','Öffne die Tür nicht!'],['Mìgaƒo nu o!','Redet nicht!'],['Ɖevíwó, mìgafé o!','Kinder, spielt nicht!']] },
  { h: 'ná: geben, lassen, für',
    t: '<b>nǎ</b> „schenken“; <b>tsɔ́ … ná …</b> „nehmen und geben“ = jemandem etwas geben; <b>Ná míá-</b> „Lasst uns …“; als Präposition <b>ná</b> „für“ (zum Vorteil). Zum Nachteil sagt man <b>ɖé</b>.',
    ex: [['Tsɔ́ gasɔ́ lá ná Áma!','Gib das Fahrrad Ama!'],['Ná míádzó.','Lass uns gehen.'],['Éle dɔ̌ wɔḿ ná Kofí.','Er arbeitet für Kofi.'],['Wówu gbɔ̃̌ nám.','Sie schlachteten für mich eine Ziege.']] }
 ],
 sentences: [
  ['Mìtsí tre!','Steht auf!'],['Mìnɔ anyí!','Setzt euch!'],['Mìgaƒo nu o!','Redet nicht!'],['Mìŋlɔ nya siawó!','Schreibt diese Wörter!'],
  ['Mìdzudzɔ núŋɔŋlɔ ázɔ̃́!','Hört jetzt auf zu schreiben!'],['Mìdo gǒ víé!','Geht ein bisschen hinaus!'],
  ['Mìƒú du vá gbɔ̌nyè!','Rennt zu mir her!'],['Nǎ blǐ koklóáwó!','Gib den Hühnern Mais!'],['Tsɔ́ gasɔ́ lá ná Áma!','Gib das Fahrrad Ama!'],
  ['Ná míádzó.','Lass uns gehen.'],['Kɔsí gblɔè nám.','Kosi hat es mir erzählt.'],['Mèƒle ʋɔtrú ná aƒé lá.','Ich habe eine Tür für das Haus gekauft.'],
  ['Áma, ɖǔ ɣe!','Ama, tanz!']
 ]
},
{
 n: 15, title: 'Gewohnheit (Habitual) und Relativsätze',
 goal: 'Du kannst sagen, was du gewöhnlich tust, und „der Mann, der …“ bilden.',
 sections: [
  { h: 'Habitual: -a / -na',
    t: 'Gewohnheit: mit Objekt <b>-a</b> ans Verb, ohne Objekt <b>-na</b>. Die Endung übernimmt den Ton des Verbs. Häufig in Sprichwörtern.',
    ex: [['Mílea tsi gbesíágbe.','Wir baden jeden Tag.'],['Wóɖua nú le fia gbɔ́.','Sie essen gewöhnlich beim Häuptling.'],['Ame kúná.','Der Mensch ist sterblich.'],['Wóyina gatrɔ́ná gbemágbe ké.','Sie gehen gewöhnlich hin und kommen am selben Tag zurück.']] },
  { h: 'Relativsätze: si … lá',
    t: '<b>si</b> (Plural <b>siwó</b>) folgt dem Bezugswort; <b>lá</b> beendet den Relativsatz. <b>amesi</b> „wer (Person)“, <b>núsi</b> „was“. <b>si ƒé</b> = „dessen/deren“.',
    ex: [['Ŋútsu si ƒle sɔ́ lá vá.','Der Mann, der das Pferd gekauft hat, ist gekommen.'],['Xɔ si míƒle lá lolo ŋútɔ́.','Das Haus, das wir gekauft haben, ist sehr groß.'],['Nyɔ́nu si nèkpɔ́ lá nyé Kofí srɔ̃.','Die Frau, die du gesehen hast, ist Kofis Ehefrau.'],['Núsi nèwɔ lá ményó o.','Was du getan hast, war nicht gut.']] }
 ],
 sentences: [
  ['Mílea tsi gbesíágbe.','Wir baden jeden Tag.'],['Wóɖua nú le fia gbɔ́.','Sie essen gewöhnlich beim Häuptling.'],['Ame kúná.','Der Mensch ist sterblich.'],
  ['Atí si mu lá wu gbɔ̃̌ eve.','Der Baum, der umfiel, tötete zwei Ziegen.'],['Xɔ si míƒle lá lolo ŋútɔ́.','Das Haus, das wir gekauft haben, ist sehr groß.'],
  ['Kofí dzrá xɔ siwó wòƒle lá.','Kofi verkaufte die Häuser, die er gekauft hatte.'],['Nyèmékpɔ́ amesi wui o.','Ich habe nicht gesehen, wer es getötet hat.'],
  ['Wɔ núsi fofówò gblɔ ná wò.','Tu, was dein Vater dir gesagt hat.'],['Amesi ƒé ga bú lá fa aví.','Der, dessen Geld verloren ging, weinte.']
 ]
},
{
 n: 16, title: 'Zukunft und unbestimmtes Subjekt („Passiv“)',
 goal: 'Du kannst über Pläne sprechen, Bedingungen formulieren und Passivsätze ausdrücken.',
 sections: [
  { h: 'Futur mit á-',
    t: 'Präfix <b>á-</b> vor dem Verb. Mit Pronomen: <b>mǎ-</b> ich werde, <b>ǎ-</b> du wirst, <b>á-</b> er/sie wird, <b>míá-</b> wir, <b>mìá-</b> ihr, <b>wóá-</b> sie. Auch in Bedingungssätzen mit <b>né … lá</b> „wenn … dann“.',
    ex: [['Kofí áɖu nú.','Kofi wird essen.'],['mǎvá','ich werde kommen'],['ǎvá','du wirst kommen'],['ává','er/sie wird kommen'],['míává','wir werden kommen'],['wóává','sie werden kommen'],['Né mǎkpɔ́e lá mǎwuii.','Wenn ich es sähe, würde ich es töten.']] },
  { h: 'Verneintes Futur',
    t: '<b>má- … o</b>; „ich“: <b>nyèmá- … o</b>.',
    ex: [['Ŋútsu lá mádzó o.','Der Mann wird nicht gehen.'],['nyèmává o','ich werde nicht kommen'],['mǎvá o','du wirst nicht kommen'],['wómává o','sie werden nicht kommen']] },
  { h: 'Futur der Verlaufsform',
    t: 'nɔ ins Futur: <b>Mǎnɔ yiyiḿ.</b> „Ich werde (gerade) gehen.“',
    ex: [['Mǎnɔ yiyiḿ.','Ich werde unterwegs sein.']] },
  { h: '„Passiv“ mit wó-',
    t: 'Ewe hat kein Passiv. Bei unbekanntem Subjekt nimmt man <b>wó-</b> „sie/man“.',
    ex: [['Wówu dzatá lá.','Man hat den Löwen getötet. / Der Löwe wurde getötet.'],['Wótu xɔa.','Das Haus wurde gebaut.']] }
 ],
 sentences: [
  ['Kofí áɖu nú.','Kofi wird essen.'],['Áma ádzi ha.','Ama wird singen.'],['Mǎvá etsɔ.','Ich werde morgen kommen.'],
  ['Wóáyi etsɔ.','Sie werden morgen gehen.'],['Míáwɔ dɔ̌ nɛ̂.','Wir werden für ihn arbeiten.'],['Ŋútsu lá mádzó o.','Der Mann wird nicht gehen.'],
  ['Nyèmává o.','Ich werde nicht kommen.'],['Né mǎnyé wò lá, mǎƒlii.','Wenn ich du wäre, würde ich es kaufen.'],
  ['Wówu dzatá lá.','Der Löwe wurde getötet.'],['Wótu xɔa.','Das Haus wurde gebaut.'],['Tǎ le ɖuyèḿ.','Ich habe Kopfschmerzen.']
 ]
},
{
 n: 17, title: 'Reflexiv, reziprok und Wortbildung',
 goal: 'Du kannst „mich selbst“, „einander“ ausdrücken und aus Verben neue Wörter bilden (Bauer, Restaurant …).',
 sections: [
  { h: 'Reflexivpronomen mit ɖókui',
    t: '<b>ɖokúínyè</b> mich selbst, <b>ɖokúíwò</b> dich selbst, <b>éɖókui</b> sich selbst, <b>míá ɖókuiwó</b> uns selbst, <b>mìà ɖókuiwó</b> euch selbst, <b>wó ɖókuiwó</b> sich selbst (Pl.). Verstärkt: <b>nyè ŋútɔ́ ɖókui</b> „ich selbst“.',
    ex: [['nyè ŋútɔ́ ɖókui','ich selbst'],['wò ŋútɔ́ ɖókui','du selbst']] },
  { h: 'Reziprok: nɔewó „einander“',
    t: '<b>míá nɔewó</b>, <b>mìà nɔewó</b>, <b>wó nɔewó</b>.',
    ex: [['Ŋútsuáwó wu wó nɔewó.','Die Männer töteten einander.']] },
  { h: 'Nomen aus Verben',
    t: '<b>Verbalnomen</b>: Verdopplung, Objekt davor: ɖu nú → <b>núɖuɖu</b> Essen. <b>Täter</b> (-lá): de agble → <b>agbledelá</b> Bauer, ɖu nú → núɖulá Esser. <b>Ort</b> (-ƒé): ɖu nú → <b>núɖuƒé</b> Restaurant, le tsi → tsileƒé Bad.',
    ex: [['yi → yiyi','gehen → das Gehen'],['ɖu nú → núɖuɖu','essen → das Essen'],['de agble → agbledede','Farm betreiben → Landwirtschaft'],['agbledelá','Bauer'],['núɖuƒé','Restaurant'],['tsileƒé','Badezimmer']] }
 ],
 sentences: [
  ['Ŋútsuáwó wu wó nɔewó.','Die Männer töteten einander.'],['Núɖuɖu lá nyó ŋútɔ́.','Das Essen ist sehr gut.'],
  ['Fofónyè nyé agbledelá.','Mein Vater ist Bauer.'],['Míɖu nú le núɖuƒé lá.','Wir haben im Restaurant gegessen.'],
  ['Agbledede nyé dɔ̌ nyúí áɖé.','Landwirtschaft ist eine gute Arbeit.'],['Éle tsileƒé.','Er ist im Badezimmer.']
 ]
}
];
