const axios = require("axios");

const API_URL = "http://localhost:8000/api";

async function test() {
  try {
    console.log("Fetching products...");
    const listRes = await axios.get(`${API_URL}/products`);
    if (!listRes.data.success) {
      console.error("Failed to list products:", listRes.data);
      return;
    }

    const products = listRes.data.data.items;
    if (products.length === 0) {
      console.log("No products found to test detail fetch.");
      return;
    }

    const firstProduct = products[0];
    console.log("First Product Object:", JSON.stringify(firstProduct, null, 2));
    console.log(
      "Testing fetch for product ID:",
      JSON.stringify(firstProduct.id),
    );

    if (!firstProduct.id) {
      console.error("ID is missing!");
      return;
    }

    try {
      const brandsRes = await axios.get(`${API_URL}/products/brands`);
      console.log("Brands fetch success:", brandsRes.data.success);
    } catch (err) {
      console.error("Brands fetch failed:", err.message);
    }

    try {
      const url = `${API_URL}/products/${firstProduct.id}`;
      console.log("Fetching URL:", url);
      const detailRes = await axios.get(url);
      console.log("Fetch success:", detailRes.data.success);
      console.log("Data:", detailRes.data.data);
    } catch (detailErr) {
      console.error(
        "Fetch detailed failed status:",
        detailErr.response ? detailErr.response.status : "No response",
      );
      console.error(
        "Fetch detailed failed headers:",
        detailErr.response ? detailErr.response.headers : "No headers",
      );
      console.error(
        "Fetch detailed failed data type:",
        typeof detailErr.response.data,
      );
      // Log first 100 chars of data if string
      if (typeof detailErr.response.data === "string") {
        console.log("Partial data:", detailErr.response.data.substring(0, 200));
      }
    }
  } catch (err) {
    console.error(
      "List failed:",
      err.response ? err.response.data : err.message,
    );
  }
}

test();
