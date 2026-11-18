const orders = {
  A1042: 'Shipped. Estimated delivery in two business days.',
  B2077: 'Processing. Estimated dispatch tomorrow.',
};

const products = [
  { name: 'Studio Headphones', price: 89, tags: 'audio wireless' },
  { name: 'Travel Headphones', price: 129, tags: 'audio wireless' },
  { name: 'Desk Microphone', price: 69, tags: 'audio voice usb' },
  { name: 'Compact Keyboard', price: 55, tags: 'wireless office' },
  { name: 'Travel Charger', price: 29, tags: 'usb power' },
];

export const documents = [
  ['Returns', 'You can return unused items within 30 days of delivery. Start your return from the Orders page. Refunds typically arrive within five business days after inspection.'],
  ['Shipping', 'Standard shipping takes three to five business days after dispatch. Express shipping takes one to two business days.'],
  ['Warranty', 'Hardware includes a one-year warranty for manufacturing defects. Keep your order confirmation as proof of purchase.'],
  ['Account access', 'Use the password reset link on the sign-in page. The reset email expires after 30 minutes.'],
];

const stop = new Set('a an and are can do does for how i in is it me of on the to what when where my find show under below please about policy much long'.split(' '));
const words = (text) => (text.toLowerCase().match(/[a-z]+/g) ?? [])
  .filter((word) => !stop.has(word))
  .map((word) => word.replace(/s$/, ''));

export function search(query) {
  const orderId = query.match(/\b[a-z]\d{4}\b/i)?.[0]?.toUpperCase();
  if (orderId || /\border\b/i.test(query)) {
    return {
      orderId,
      trace: 'Route → Order lookup',
      answer: orderId ? orders[orderId] ?? 'No sample order matches ' + orderId + '.' : 'Enter a sample order ID, such as A1042.',
    };
  }
  const limit = query.match(/(?:under|below|less than)\s*\$?(\d+(?:\.\d+)?)/i);
  const terms = words(query.replace(limit?.[0] ?? '', ' ').replace(/\b(less|than|products|items)\b/gi, ''));
  const results = products.filter(({ name, tags, price }) => (
    (!limit || price < Number(limit[1])) && terms.every((term) => words(name + ' ' + tags).includes(term))
  )).sort((a, b) => a.price - b.price);
  return {
    trace: 'Route → Catalog search' + (limit ? ' → Price below $' + limit[1] : ''),
    answer: results.map(({ name, price }) => name + ' — $' + price).join('\n') || 'No matching products in the sample catalog.',
  };
}

export function retrieve(query) {
  const terms = [...new Set(words(query))];
  const ranked = documents.map(([title, body]) => {
    const titleWords = words(title);
    const bodyWords = words(body);
    const score = terms.reduce((sum, word) => sum + (titleWords.includes(word) ? 4 : 0) + Number(bodyWords.includes(word)), 0);
    return { title, body, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
  if (!ranked.length) return 'I couldn’t find a matching passage in the sample documents.';
  const top = ranked[0];
  return top.body + '\n\nSource: ' + top.title;
}

export function voice(query, previousOrder) {
  if (/\b(order|[a-z]\d{4})\b/i.test(query)) return search(query);
  if (previousOrder && /\b(it|again|status)\b/i.test(query)) return search(previousOrder);
  return { answer: retrieve(query) };
}
