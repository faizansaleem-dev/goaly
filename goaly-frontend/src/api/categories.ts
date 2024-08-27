export const getCategories = async (token: string) => {
  const response = await fetch("http://localhost:3000/category", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};
