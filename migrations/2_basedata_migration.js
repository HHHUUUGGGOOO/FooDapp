const TodoApp = artifacts.require("BaseData");

module.exports = function(deployer) {
  deployer.deploy(TodoApp);
};
