const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
};

export { generateId, formatDate };