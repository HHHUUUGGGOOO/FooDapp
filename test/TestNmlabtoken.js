const Nmlabtoken = artifacts.require("Nmlabtoken");

contract('Nmlabtoken', (accounts) => {
  it('testInitialBalance', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const balance = await NmlabtokenInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
  
  it('testTotalSupply', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const totalSupply = await NmlabtokenInstance.totalSupply();

    assert.equal(totalSupply, 10000, "Total supply wasn't 10000 NML");
  });
  it('testApprove', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const expected = 50; 
    await NmlabtokenInstance.approve(accounts[1], expected);
    await NmlabtokenInstance.approve(accounts[0], expected);
    // const balance0 = await NmlabtokenInstance.balanceOf.call(accounts[0]);
    // const balance1 = await NmlabtokenInstance.balanceOf.call(accounts[1]);
    // assert.equal(ok, true, "Approve should be ok");
  });

  it('testAllowance', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const expected = 50; 
    const value = await NmlabtokenInstance.allowance(accounts[0], accounts[1]);
    // const balance0 = await NmlabtokenInstance.balanceOf.call(accounts[0]);
    // const balance1 = await NmlabtokenInstance.balanceOf.call(accounts[1]);
    assert.equal(Number(value), expected, "Allowance1 should be 50 NML");
    const value0 = await NmlabtokenInstance.allowance(accounts[0], accounts[0]);
    assert.equal(Number(value0), expected, "Allowance0 should be 50 NML");
  });

  it('testTransferFrom', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const expected = 10; 
    const old_balance0 = await NmlabtokenInstance.balanceOf.call(accounts[0]);
    const old_balance1 = await NmlabtokenInstance.balanceOf.call(accounts[1]);
    await NmlabtokenInstance.transferFrom(accounts[0], accounts[1], expected);
    const balance0 = await NmlabtokenInstance.balanceOf.call(accounts[0]);
    const balance1 = await NmlabtokenInstance.balanceOf.call(accounts[1]);
    assert.equal(old_balance0-balance0, expected, "account0 should transfer 10 NML");
    assert.equal(balance1-old_balance1, expected, "account1 should get 10 NML");
  });

  it('testTransfer', async () => {
    const NmlabtokenInstance = await Nmlabtoken.deployed();
    const expected = 10; 
    await NmlabtokenInstance.transfer(accounts[2], expected);
    // const balance0 = await NmlabtokenInstance.balanceOf.call(accounts[0]);
    const balance2 = await NmlabtokenInstance.balanceOf.call(accounts[2]);
    assert.equal(Number(balance2), expected, "Account2 should get 10 NML");
  });
});
