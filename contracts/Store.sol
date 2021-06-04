pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./BaseData.sol";
import "./ownable.sol";
import "./safemath.sol";

// Create, edit, and view store here

contract StoreInterface is BaseData {
    function UserGetAllStore(string memory _cityName) external view returns (Store[]) {
        // return 
        return cityNameToStoreList[_cityName];
    }

}

contract StoreContract is BaseData, Ownable {
    // prevent overflow
    using SafeMath for uint256;
    // declare event
    event NewStore(storeID, ownerAddress, storeName, cityName, moreInfo, menu, rating);
    event OrderConfirmed(orderID);

    uint _idDigit   = 64;
    uint _idModulus = 10 ** _idDigit;

    // only us can withdraw the ether user sent to this contract
    function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
    }

    function StoreSetStore(uint _storeID, string memory _storeName, string memory _cityName, string memory _moreInfo, string[] memory _menu) external payable returns(uint) {
        // need to pay ether
        require(msg.value == 0.001 ether);
        // create a new storeID via keccak256 (_storeName, _cityName), hence, only you change the storename and cityname will affect the storeID
        uint _storeID = uint(keccak256(abi.encodePacked(_storeName, _cityName))) % (_idModulus);
        // default every rating star with 0 people
        mapping (uint => uint) star;
        for (uint i = 1 ; i != 6 ; i++) {
            star[i] = 0;
        }
        Store newStore = new Store(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu, star);
        // add a new store into the public set
        Store[] SpecificStoreList;
        SpecificStoreList = cityNameToStoreList[_cityName];
        SpecificStoreList.push(newStore);
        // mapping storeID to store
        storeIDToStore[_storeID] = newStore;
        // fire event
        emit NewStore(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu, star);
        // return storeID
        return _storeID;
    }

    function StoreSetOrderConfirm(uint _orderID) external {
        // assure call by store of the order
        orderIDToOrder[_orderID].isConfirmed = true;
        // fire event
        emit OrderConfirmed(_orderID);
        // return;
    }

}