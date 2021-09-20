const withTM = require("next-transpile-modules")(["@lootexchange/sdk"]);

module.exports = withTM({
  reactStrictMode: true,
});
