// Stand-in for an Eloquent model. The array lives in this module, which is a
// singleton for the life of the process (PHP-FPM would not share this across
// requests). Phase 4 replaces these functions with Prisma — controllers stay.

const products = [
  {
    id: 1,
    name: 'Canvas Tote',
    description: 'Heavy cotton tote bag',
    price: 24.5,
    stock: 40,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Ceramic Mug',
    description: '12oz stoneware mug',
    price: 16,
    stock: 25,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// Like a MySQL AUTO_INCREMENT. Deleted ids are not reused.
let nextId = 3;

function copy(product) {
  return { ...product };
}

export function list() {
  return products.map(copy);
}

// Like Product::find($id) — null when missing, not an exception.
export function find(id) {
  const product = products.find((item) => item.id === id);
  return product ? copy(product) : null;
}

export function create(input) {
  const now = new Date().toISOString();
  const product = {
    id: nextId++,
    name: input.name,
    description: input.description,
    price: input.price,
    stock: input.stock,
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  return copy(product);
}

export function update(id, input) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const product = {
    ...products[index],
    ...input,
    id: products[index].id,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  products[index] = product;
  return copy(product);
}

export function remove(id) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  return true;
}
