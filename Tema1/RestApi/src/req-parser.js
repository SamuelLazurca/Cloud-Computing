const parse = (request) => {
  if (request.url == "/products") {
    return JSON.stringify({ products: ["milk", "bread"] });
  } else return "not found";
};

module.exports = {parse}