pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Nmlabtoken.sol";

contract TestNmlabtoken {
  // Test balanceOf(account)
  function testInitialBalance() public {
    Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());

    uint expected = 10000;

    Assert.equal(nml.balanceOf(msg.sender), expected, "Owner should have 10000 NML initially");
  }
  // Test totalSupply()
  function testInitialSupply() public {
    Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());

    uint expected = 10000;

    Assert.equal(nml.totalSupply(), expected, "Total supply should be 10000 NML initially");
  }
  function testTransfer() public {
    Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());

    address account1 = 0x21394233503cF69e6ea73386C17aD63E94a34329;

    uint expected = 80;

    nml.transfer(account1, expected);
    Assert.equal(nml.balanceOf(account1), expected, "Account1 should have 8000 NML");
  }
  function testAllowance() public {
    // TODO
    Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());
    address account1 = 0x21394233503cF69e6ea73386C17aD63E94a34329;
    uint allowed = nml.allowance(msg.sender, account1);
    Assert.equal(allowed, 0, "_spender allowance should have initial 0 allowance");
  }
  function testApprove() public {
    // TODO
    // Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());
    // bool approved = nml.approve(msg.sender, 1000);
    // Assert.isTrue(approved, "Tokens approved");
    return;
  }
  function testTransferFrom() public {
    // TODO
    // Nmlabtoken nml = Nmlabtoken(DeployedAddresses.Nmlabtoken());
    // address account1 = 0x21394233503cF69e6ea73386C17aD63E94a34329;
    // bool result = nml.transferFrom(msg.sender, account1, 1000);
    // Assert.isTrue(result, "TransferFrom _spender to _to");
    return;
  }
}
