pragma solidity >=0.4.25 <0.6.0;

import "./BaseData.sol"

// Create, edit, and view store here

contract StoreInterface {

    function UserGetAllStore(string city_name) external view returns (
        // return list of all stores in the specific city
    );

}

contract StoreContract is BaseData {

    // Declare event
    event NewStore();

    function StoreSetStore(uint64 storeID, string storeName, string[] menu, string moreInfo) external payable {
        // return storeID
    }

    function StoreSetOrderConfirm(uint64 orderID) external {
        // assure call by store of the order
    }

    function RateStore(uint64 orderID, uint8 _newRate) external {
        // return new rate
    }

}