pragma solidity >=0.4.25 <0.6.0;

import "./BaseData.sol"

// Create, edit, and view store here

contract StoreInterface {

    function UserGetAllStore() external view returns (
        // return list of all stores
    );

}

contract StoreContract is BaseData {

    // Declare event
    event NewStore();

    function StoreSetStore(uint64 storeID) external payable {
        // return storeID
    }

    function StoreSetOrderConfirm(uint64 orderID) external {
        // assure call by store of the order.
    }

    function RateStore(uint64 orderID, uint8 _newRate) external {
        // return new rate
    }

    function GetAllOrderDetailInformation(uint64 storeID) external {
        // returns a list of orders.
    }

}