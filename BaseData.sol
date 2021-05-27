pragma solidity >=0.4.25 <0.6.0;

contract BaseData{
    struct Store {
        uint64 storeID;
        address ownerAddress;
        string name;
        string[] menu;
        string moreInfo;
        bool isActive;
    }

    struct Order {
        uint64 orderID;                 // Will be recycled if over 2^64
        uint64 storeID;                 // Will be recycled if over 2^64
        uint16[] itemsID;               // Expect a store only has 65536 items available
        uint16 tipsValueMultiplicand;   // That is, their are only 65536 number of tip available
    }

    mapping (address => uint8) userAddressToCustomerRating;
    mapping (address => uint8) userAddressToDeliverymanRating;
    mapping (uint64 => uint8) userAddressToStoreRating;
    mapping (uint64 => Store) storeIDToStore;
    mapping (uint64 => Order) orderIDToOrder;
}