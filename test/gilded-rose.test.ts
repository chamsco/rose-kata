// Règles métier, valeurs attendues tirées de GildedRoseRequirements.md (et non de la sortie du code).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Item, GildedRose } from '../app/gilded-rose.ts';

const BRIE = 'Aged Brie';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE = 'Backstage passes to a TAFKAL80ETC concert';

function afterOneDay(name: string, sellIn: number, quality: number) {
  const [item] = new GildedRose([new Item(name, sellIn, quality)]).updateQuality();
  return { sellIn: item.sellIn, quality: item.quality };
}

test('un article normal perd 1 en qualité et 1 jour de vente par jour', () => {
  assert.deepEqual(afterOneDay('Elixir of the Mongoose', 5, 7), { sellIn: 4, quality: 6 });
});

test('une fois la date passée, la qualité baisse deux fois plus vite', () => {
  assert.deepEqual(afterOneDay('Elixir of the Mongoose', 0, 7), { sellIn: -1, quality: 5 });
});

test('la qualité ne devient jamais négative', () => {
  assert.equal(afterOneDay('Elixir of the Mongoose', 0, 1).quality, 0);
  assert.equal(afterOneDay('Elixir of the Mongoose', 3, 0).quality, 0);
});

test('Aged Brie gagne en qualité en vieillissant', () => {
  assert.deepEqual(afterOneDay(BRIE, 2, 0), { sellIn: 1, quality: 1 });
});

test('la qualité ne dépasse jamais 50', () => {
  for (const [name, sellIn] of [[BRIE, 2], [BRIE, -1], [BACKSTAGE, 15], [BACKSTAGE, 5]] as const) {
    assert.equal(afterOneDay(name, sellIn, 50).quality, 50, `${name} à J-${sellIn}`);
  }
  assert.equal(afterOneDay(BACKSTAGE, 5, 49).quality, 50, 'un +3 plafonné à 50');
});

test('Sulfuras ne se vend pas et ne se dégrade jamais (qualité 80)', () => {
  assert.deepEqual(afterOneDay(SULFURAS, 0, 80), { sellIn: 0, quality: 80 });
  assert.deepEqual(afterOneDay(SULFURAS, -1, 80), { sellIn: -1, quality: 80 });
});

test('Backstage : +1 au-delà de 10 jours, +2 de 10 à 6 jours, +3 de 5 à 1 jour', () => {
  const cases = [
    { sellIn: 11, gain: 1 },
    { sellIn: 10, gain: 2 },
    { sellIn: 6, gain: 2 },
    { sellIn: 5, gain: 3 },
    { sellIn: 1, gain: 3 },
  ];
  for (const { sellIn, gain } of cases) {
    assert.equal(afterOneDay(BACKSTAGE, sellIn, 20).quality, 20 + gain, `à J-${sellIn}`);
  }
});

test('Backstage : la qualité tombe à 0 après le concert', () => {
  assert.deepEqual(afterOneDay(BACKSTAGE, 0, 20), { sellIn: -1, quality: 0 });
});

test('Conjured : la qualité baisse deux fois plus vite qu\'un article normal', () => {
  assert.deepEqual(afterOneDay('Conjured Mana Cake', 3, 6), { sellIn: 2, quality: 4 });
  assert.deepEqual(afterOneDay('Conjured Mana Cake', 0, 6), { sellIn: -1, quality: 2 });
});

test('Conjured : la qualité ne devient jamais négative', () => {
  assert.equal(afterOneDay('Conjured Mana Cake', 3, 1).quality, 0);
  assert.equal(afterOneDay('Conjured Mana Cake', 0, 3).quality, 0);
});
