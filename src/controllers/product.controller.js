import { ApiError } from '../utils/ApiError.js';
import * as productService from '../services/product.service.js';

// Light checks so bad input is a 400, not a 500.
// Phase 3 moves this into src/validators (Laravel Form Requests).

function parseId(raw) {
  if (!/^[1-9]\d*$/.test(raw)) {
    throw new ApiError(400, 'Product id must be a positive integer');
  }
  return Number(raw);
}

function parseName(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ApiError(400, 'name must be a non-empty string');
  }
  return value.trim();
}

function parseDescription(value) {
  if (typeof value !== 'string') {
    throw new ApiError(400, 'description must be a string');
  }
  return value;
}

function parsePrice(value) {
  if (typeof value === 'boolean' || value === null || value === '') {
    throw new ApiError(400, 'price must be a number greater than or equal to 0');
  }
  const price = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(price) || price < 0) {
    throw new ApiError(400, 'price must be a number greater than or equal to 0');
  }
  return price;
}

function parseStock(value) {
  if (typeof value === 'boolean' || value === null || value === '') {
    throw new ApiError(400, 'stock must be an integer greater than or equal to 0');
  }
  const stock = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(stock) || stock < 0) {
    throw new ApiError(400, 'stock must be an integer greater than or equal to 0');
  }
  return stock;
}

// `partial` is true for PATCH. PUT requires name and price, like a full save.
function readProductBody(body, { partial }) {
  const source = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const payload = {};

  if (source.name !== undefined) {
    payload.name = parseName(source.name);
  } else if (!partial) {
    throw new ApiError(400, 'name is required');
  }

  if (source.price !== undefined) {
    payload.price = parsePrice(source.price);
  } else if (!partial) {
    throw new ApiError(400, 'price is required');
  }

  if (source.description !== undefined) {
    payload.description = parseDescription(source.description);
  } else if (!partial) {
    payload.description = '';
  }

  if (source.stock !== undefined) {
    payload.stock = parseStock(source.stock);
  } else if (!partial) {
    payload.stock = 0;
  }

  if (partial && Object.keys(payload).length === 0) {
    throw new ApiError(400, 'Provide at least one of: name, description, price, stock');
  }

  return payload;
}

function json(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

export async function index(_req, res) {
  const data = productService.list();
  res.json({ success: true, data, meta: { count: data.length } });
}

export async function show(req, res) {
  const product = productService.find(parseId(req.params.id));
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  json(res, product);
}

export async function store(req, res) {
  const product = productService.create(readProductBody(req.body, { partial: false }));
  json(res, product, 201);
}

export async function update(req, res) {
  const partial = req.method === 'PATCH';
  const product = productService.update(
    parseId(req.params.id),
    readProductBody(req.body, { partial }),
  );
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  json(res, product);
}

export async function destroy(req, res) {
  const removed = productService.remove(parseId(req.params.id));
  if (!removed) {
    throw new ApiError(404, 'Product not found');
  }
  // 204 must not include a body.
  res.status(204).end();
}
