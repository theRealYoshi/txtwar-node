module.exports = {
  database: process.env.MONGO_URI || 'localhost',
  rabbit_url: process.env.CLOUDAMQP_URL || 'localhost',

  thrifty: bool(process.env.THRIFTY) || false,                    // Web process also executes job queue?
  view_cache: bool(process.env.VIEW_CACHE) || true              // Cache rendered views?

};

function bool(str) {
  if (str == void 0) return false;
  return str.toLowerCase() === 'true';
}
