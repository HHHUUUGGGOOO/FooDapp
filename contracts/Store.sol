pragma solidity >=0.4.25 <0.6.0;

import "./BaseData.sol";

// Create, edit, and view store here

contract StoreInterface {
    function UserGetAllStore(string memory _cityName) external view returns {
        // return list of all stores in the specific city
        return;
    };

}

contract StoreContract is BaseData {
    // Declare event
    event NewStore(storeID, ownerAddress, storeName, cityName, moreInfo, menu, rating);
    event OrderConfirmed(orderID);

    uint _idDigit   = 64;
    uint _idModulus = 10 ** _idDigit;

    function StoreSetStore(uint _storeID, string memory _storeName, string memory _cityName, string memory _moreInfo, string[] memory _menu) external payable returns(uint) {
        // create a new storeID via keccak256 (_storeName, _cityName), hence, only you change the storename and cityname will affect the storeID
        uint _storeID = uint(keccak256(abi.encodePacked(_storeName, _cityName))) % (_idModulus);
        // default every rating star with 0 people
        mapping (uint => uint) star;
        for (uint i = 1 ; i != 6 ; i++) {
            star[i] = 0;
        }
        // add a new store into the public set
        AllStoreList.push(Store(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu, star));
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