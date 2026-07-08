const stripHTML = (value) => {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '');
  }
  if (Array.isArray(value)) {
    return value.map(stripHTML);
  }
  if (value && typeof value === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(value)) {
      clean[k] = stripHTML(v);
    }
    return clean;
  }
  return value;
};

const sanitize = (req, _res, next) => {
  if (req.body) req.body = stripHTML(req.body);
  if (req.query) req.query = stripHTML(req.query);
  if (req.params) req.params = stripHTML(req.params);
  next();
};

export default sanitize;
