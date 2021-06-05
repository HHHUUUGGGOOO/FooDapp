const TodoApp = artifacts.require("Store_Order");

module.exports = function(deployer) {
  deployer.deploy(TodoApp);
};
