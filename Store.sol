pragma solidity >=0.4.25 <0.6.0;

// Create, edit, and view store here

contract StoreInterface {

    function UserGetAllStore() external view returns (
        // return list of all stores
    );

}

contract StoreContract {

    // Declare event
    event NewStore();

    function StoreSetStore() external payable {
        // return storeID
    }

}