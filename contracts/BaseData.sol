pragma solidity >=0.4.25 <0.6.0;

contract BaseData{
    struct Store {
        uint                    storeID;            
        address                 ownerAddress;
        string                  storeName;               // array, struct, string parameters in a function need to be stored in "memory"
        string                  cityName;
        string                  moreInfo;
        string[]                menu;
        mapping (uint => uint)  PeopleNumRateTheStar;   // e.g. 1 star: 20, 2 star: 11, ..., 5 star: 1 
        // bool      isActive;
    }

    struct Order {
        uint      orderID;                 // Will be recycled if over 2^64
        uint      storeID;                 // Will be recycled if over 2^64
        uint[]    itemsID;                 // Expect a store only has 65536 items available
        uint[]    itemsNumber;
        uint      tipsValueMultiplicand;   // That is, their are only 65536 number of tip available
        uint      userToDeliverymanScore;                   
        uint      deliverymanToUserScore;
        uint      userToStoreScore;
        bool      userIsRated;             // deliveryman has rated user
        bool      deliverymanIsRated;      // user has rated deliveryman
        bool      storeIsRated;
        bool      isConfirmed;
        bool      isDelivering;
        bool      isDelivered;
        bool      isReceived;
    }

    // mapping (address => uint8) public userAddressToCustomerRating;
    // mapping (address => uint8) public userAddressToDeliverymanRating;
    // mapping (address => uint8) public userAddressToStoreRating;
    mapping (uint => Store)     public storeIDToStore;
    mapping (uint => Order)     public orderIDToOrder;
    mapping (uint => Order[])   public storeIDToOrder;
    mapping (string => Store[]) public cityNameToStoreList;
    
    Order[] public AllOrderList;        

}