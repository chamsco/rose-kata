// Filet de sécurité du refactoring : le nouveau code doit se comporter exactement
// comme le legacy, pour toute combinaison de nom, sellIn et qualité, y compris
// les entrées hors spec (qualité négative ou > 50), pour ne casser aucun client.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Item, GildedRose } from '../app/gilded-rose.ts';
import * as Legacy from './legacy-gilded-rose.ts';

const NAMES = [
  'Aged Brie',
  'Sulfuras, Hand of Ragnaros',
  'Backstage passes to a TAFKAL80ETC concert',
  'Elixir of the Mongoose',
  '+5 Dexterity Vest',
  // Les articles « Conjured ... » ont volontairement changé de règle : ils sont
  // couverts par gilded-rose.test.ts, pas par l'oracle. Ces variantes, elles,
  // doivent rester des articles normaux (choix : préfixe exact « Conjured »).
  'Conjured',
  'conjured mana cake',
  'Mana Cake Conjured',
  // Noms piégeux : casse, préfixes, et noms qui existent sur Object.prototype.
  'aged brie',
  'Aged Brie ',
  'Backstage passes',
  'Sulfuras',
  'constructor',
  'toString',
  '',
];
const SELL_INS = range(-3, 13);
const QUALITIES = [...range(-2, 55), 80];

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function grid(): Array<[string, number, number]> {
  return NAMES.flatMap((n) => SELL_INS.flatMap((s) => QUALITIES.map((q) => [n, s, q] as [string, number, number])));
}

test('le code se comporte comme le legacy sur toutes les combinaisons (2 jours)', () => {
  const cases = grid();
  const current = new GildedRose(cases.map(([n, s, q]) => new Item(n, s, q)));
  const legacy = new Legacy.GildedRose(cases.map(([n, s, q]) => new Legacy.Item(n, s, q)));

  for (let day = 1; day <= 2; day++) {
    current.updateQuality();
    legacy.updateQuality();
    cases.forEach(([n, s, q], i) => {
      const got = { sellIn: current.items[i].sellIn, quality: current.items[i].quality };
      const want = { sellIn: legacy.items[i].sellIn, quality: legacy.items[i].quality };
      assert.deepEqual(got, want, `jour ${day}, départ "${n}" sellIn=${s} qualité=${q}`);
    });
  }
});
