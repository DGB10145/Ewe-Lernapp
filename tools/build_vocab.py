"""Baut data/vocab.js aus dem extrahierten Wortschatz (Basic Ewe, 2. Aufl.)
und der deutschen Übersetzung (vocab_de.txt, eine Zeile pro Eintrag)."""
import json, unicodedata, os
here = os.path.dirname(os.path.abspath(__file__))
raw = json.load(open(os.path.join(here, 'vocab_raw.json'), encoding='utf-8'))
de = open(os.path.join(here, 'vocab_de.txt'), encoding='utf-8').read().strip('\n').split('\n')
assert len(raw) == len(de)
N = lambda s: unicodedata.normalize('NFC', s)
# Korrekturen fehlerhaft extrahierter Diakritika (Index -> (ewe, en))
fix = {
 57: ('Agɔkɔ́lí', 'name of the last known Ewe king'),
 63: ('ahɔhɔ̃é', 'mirror'),
 83: ('alẽkpɔ́', 'sheep pen'),
 148: ('axlɔ̃é', 'mongoose'),
 175: ('blíbo', 'whole, the lot'),
 380: ('etɔ̃líá', 'third'),
 407: ('fiã́', 'to be burnt'),
 409: ('fiã̌ nú', 'to burn sth.'),
 467: ('gbã́', 'first (short for gbã́tɔ)'),
 549: ('hiã̌ nú', 'to need sth.'),
 690: ('mamáyɔ́ví', 'grandchild'),
 765: ('núsrɔ̃ƒé', 'school, place where one learns'),
 766: ('núsrɔ̃lá', 'student, pupil, learner'),
 844: ('sẽẽ́', 'a little while'),
 874: ('sukúdeɣi', 'school days/times'),
 910: ('tógbɔ́ bé', 'though, although'),
 938: ('trɔ̃sí', 'fetish priest/priestess'),
 939: ('trɔ̃tɔ́', 'fetish owner'),
 940: ('trɔ̃xɔ', 'fetish hut/house'),
 1009: ('ʋeʋẽ́', 'stench, stink'),
 1010: ('ʋeʋẽsese', 'smelling (v.n.)'),
 1012: ('ʋɔnudrɔ̃ƒé', 'court, court room'),
 1013: ('ʋɔnudrɔ̃lá', 'judge'),
 1016: ('ʋu', 'to shine (e.g. the sun)'),
 1085: ('xɔ́lɔ̃', 'friend'),
 1091: ('yaa', 'tasteless'),
 1112: ('zãtíƒé', 'midnight'),
 1113: ('zãtítína', 'midnight'),
 1119: ('zi gbã́tɔ', 'first time'),
}
extra = [
 ('Blǔ', 11, 'Ewe name for Twi', 'Twi (Sprache in Ghana)'),
 ('sukúdelá', 17, 'pupil, student', 'Schüler, Schulgänger'),
 ('tógbɔ́ bé … hã́', 17, 'even though', 'auch wenn, obwohl'),
 ('ʋǔ', 10, 'drum', 'Trommel'),
 ('xɔŋkɔ́', 17, 'famous, popular', 'berühmt, beliebt'),
 ('yǎme', 9, 'atmosphere, weather', 'Wetter, Atmosphäre'),
]
out = []
for i, e in enumerate(raw):
    ewe, en = fix.get(i, (e['ewe'], e['en']))
    en = en.replace('gbãt́ ɔ', 'gbã́tɔ').replace('s.o.', 'someone').replace('sth.', 'something')
    out.append({'e': N(ewe), 'l': e['l'], 'en': N(en), 'de': N(de[i])})
for ewe, l, en, d in extra:
    out.append({'e': N(ewe), 'l': l, 'en': en, 'de': d})
out.sort(key=lambda x: x['e'].lower())
for i, x in enumerate(out): x['id'] = i
js = '// Automatisch erzeugt von tools/build_vocab.py – Quelle: Dzablu-Kumah, "Basic Ewe for Foreign Students" (2. Aufl., Köln 2015)\n'
js += 'window.EWE_VOCAB = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(os.path.join(here, '..', 'data', 'vocab.js'), 'w', encoding='utf-8').write(js)
print(len(out), 'Einträge')
