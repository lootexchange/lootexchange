const api = async (collection, url, ...rest) => {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/collections/${collection}/${url}`,
    ...rest
  );
  let json = await response.json();
  return json.data;
};

export default api;
