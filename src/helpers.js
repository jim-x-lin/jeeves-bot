const getInitials = (name) => {
  if (!name) return;
  if (!/^[a-z]+\s+[a-z]+.+$/i.test(name)) return;
  const [first, last] = name.split(/\s+/);
  return first[0].toUpperCase() + last[0].toUpperCase();
};

module.exports = {
  getInitials,
};
