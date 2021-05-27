pragma solidity >=0.4.25 <0.6.0;

// Create, edit, and view store here

contract StoreInterface {

    function UserGetAllStore(string city_name) external view returns (
        // return list of all stores in the specific city
    );

}

contract StoreContract {

    // Declare event
    event NewStore();

    function StoreSetStore(string storeName, string[] intro, uint[] menu) external payable {
        // return storeID
    }

    function StoreModifyStore(uint storeID) external payable {
        // return 
    }

}