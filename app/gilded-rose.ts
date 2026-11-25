export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const CONJURED_PREFIX = 'Conjured ';

const MAX_QUALITY = 50;
const MIN_QUALITY = 0;

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      updateItem(item);
    }

    return this.items;
  }
}

/** Applique à un article la règle de son type, pour une journée. */
function updateItem(item: Item): void {
  switch (item.name) {
    case SULFURAS:
      return; // légendaire : ni date de vente, ni dégradation
    case AGED_BRIE:
      return updateAgedBrie(item);
    case BACKSTAGE_PASSES:
      return updateBackstagePasses(item);
    default:
      return item.name.startsWith(CONJURED_PREFIX) ? updateConjuredItem(item) : updateNormalItem(item);
  }
}

function updateAgedBrie(item: Item): void {
  const expired = passOneDay(item);
  raiseQuality(item, expired ? 2 : 1);
}

function updateBackstagePasses(item: Item): void {
  const daysBeforeConcert = item.sellIn;
  const expired = passOneDay(item);
  if (expired) {
    item.quality = 0;
  } else if (daysBeforeConcert <= 5) {
    raiseQuality(item, 3);
  } else if (daysBeforeConcert <= 10) {
    raiseQuality(item, 2);
  } else {
    raiseQuality(item, 1);
  }
}

function updateNormalItem(item: Item): void {
  const expired = passOneDay(item);
  lowerQuality(item, expired ? 2 : 1);
}

/** Comme un article normal, mais deux fois plus vite. */
function updateConjuredItem(item: Item): void {
  const expired = passOneDay(item);
  lowerQuality(item, expired ? 4 : 2);
}

/** Avance d'un jour et indique si la date de vente est dépassée. */
function passOneDay(item: Item): boolean {
  item.sellIn = item.sellIn - 1;
  return item.sellIn < 0;
}

/** Monte vers 50 sans le dépasser ; une qualité déjà au-dessus reste inchangée. */
function raiseQuality(item: Item, by: number): void {
  if (item.quality < MAX_QUALITY) {
    item.quality = Math.min(MAX_QUALITY, item.quality + by);
  }
}

/** Descend vers 0 sans passer dessous ; une qualité déjà négative reste inchangée. */
function lowerQuality(item: Item, by: number): void {
  if (item.quality > MIN_QUALITY) {
    item.quality = Math.max(MIN_QUALITY, item.quality - by);
  }
}
