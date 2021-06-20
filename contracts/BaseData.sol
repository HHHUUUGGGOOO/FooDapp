pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract BaseData{
    // store active time ?
    struct Store {
        uint                storeID;            
        address             ownerAddress;
        string              storeName;     // array, struct, string parameters in a function need to be stored in "memory"
        string              cityName;
        string              moreInfo;
        string              menu;    
    }
    
    // We can assign the limited 16 variables
    struct Order {
        uint      setTime;
        uint      orderID;                 // Will be recycled if over 2^64
        uint      storeID;                 // Will be recycled if over 2^64
        uint[]    itemsNumber;
        uint      tipsValueMultiplicand;   // That is, their are only 65536 number of tip available
        uint      userToDeliverymanScore;                   
        uint      deliverymanToUserScore;
        uint      userToStoreScore;
        bool      isConfirmed;
        bool      isDelivering;
        bool      isDelivered;
        bool      isReceived;
        address   userAddr;
        address   deliverymanAddr;
        uint      totalPrice;
    }
    
    mapping (uint => uint[])                     public storeIDToItemsPrice;
    mapping (uint => Store)                      public storeIDToStore;      
    mapping (uint => Order)                      public orderIDToOrder;
    mapping (uint => uint[])                     public storeIDToOrder;       // => Order[] --> => uint[]
    mapping (string => uint[])                   public cityNameToStoreList;  // => Store[] is not supported (struct dynamic array) --> => uint[]
    mapping (uint => mapping (uint => uint))     public PeopleNumRateTheStar; // storeID to its rate, e.g. 1 star: 20 people, ..., 5 star: 1 people
    mapping (address => uint[])                  public ownerAddrToStoreID;
    mapping (address => uint[])                  public userAddrToOrderID;
    mapping (address => uint[])                  public deliverymanAddrToOrderID;
    mapping (address => string)                  public userAddrToTargetPlace;
    
    uint[] public AllOrderList;   // Order[] --> uint[]  
    uint[] public AllStoreList;
    uint   public storeid = 0;
    uint   public orderid = 0; 

}