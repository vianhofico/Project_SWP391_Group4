const tailwindConfig = require("./tailwind.config.cjs")
const {options, parsers, printers} = require("prettier-plugin-tailwindcss")

module.exports = {
  tailwindConfig: tailwindConfig,
  plugins: [options, parsers, printers],
};
