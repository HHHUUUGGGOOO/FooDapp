pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

import "./BaseData.sol";
import "./ownable.sol";
// import "./safemath.sol";

// Create, edit, and view store here

contract Store_Order is BaseData, ownable {
    // prevent overflow
    // using SafeMath for uint256;

    /* ---------------------------------------- Store ---------------------------------------- */

    // declare event
    event NewStore(uint storeID, address ownerAddress, string storeName, string cityName, string moreInfo, string menu);
    event OrderConfirmed(uint orderID);

    uint _idDigit   = 64;
    uint _idModulus = 10 ** _idDigit;

    // only us can withdraw the ether user sent to this contract
    function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
    }

    function UserGetAllStore(string memory _cityName) public view returns(uint[] memory) {
        // return storeID[]
        return cityNameToStoreList[_cityName];
    }

    function AddressGetStoreID() public view returns(uint[] memory) {
        // return 
        return ownerAddrToStoreID[msg.sender];
    }

    function StoreSetStore(uint _storeID, string calldata _storeName, string calldata _cityName, string calldata _moreInfo, string calldata _menu) external payable returns(uint) {
        if (_storeID == uint(0)){
            // need to pay ether
            require(msg.value == 0.001 ether);
            // create a new storeID via keccak256 (_storeName, _cityName), hence, only you change the storename and cityname will affect the storeID
            storeid++;
            _storeID = storeid;
            // default every rating star with 0 people
            for (uint i = 1 ; i != 6 ; i++) {
                PeopleNumRateTheStar[_storeID][i] = 0;
            }
            Store memory newStore = Store(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu);
            // add a new store into the public set
            cityNameToStoreList[_cityName].push(_storeID);
            // mapping storeID to store
            storeIDToStore[_storeID] = newStore;
            ownerAddrToStoreID[msg.sender].push(_storeID);
            // fire event
            emit NewStore(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu);
            // return storeID
            return _storeID;
        } else if (_storeID > uint(0)) {
            // if want to modify
            require(msg.sender == storeIDToStore[_storeID].ownerAddress);
            storeIDToStore[_storeID].storeName = _storeName;
            storeIDToStore[_storeID].cityName = _cityName;
            storeIDToStore[_storeID].moreInfo = _moreInfo;
            storeIDToStore[_storeID].menu = _menu;
            // fire event
            emit NewStore(_storeID, msg.sender, _storeName, _cityName, _moreInfo, _menu);
            // return storeID
            return _storeID;
        }
    }

    function StoreSetOrderConfirm(uint _orderID) external {
        // assure call by store of the order
        orderIDToOrder[_orderID].isConfirmed = true;
        // fire event
        emit OrderConfirmed(_orderID);
        // return;
    }

    /* ---------------------------------------- Order ---------------------------------------- */

    // declare new order event
    event NewOrderBasic(uint setTime, uint orderID, uint storeID, uint[] itemsID, uint[] itemsNumber, uint tips);
    event NewOrderScore(uint d_score, uint u_score, uint s_score);
    event NewOrderBoolandAddr(bool isConfirmed, bool isDelivering, bool isDelivered, bool isReceived, address userAddr, address deliveryAddr);
    // declare other event
    event OrderDelivering(uint orderID);
    event OrderDelivered(uint orderID);
    event OrderReceived(uint orderID);
    event UserBeenRated(address addr, uint orderID, uint score);
    event DeliverymanBeenRated(address addr, uint orderID, uint score);
    event StoreBeenRated(address addr, uint orderID, uint score);

    function GetOrderbyStoreID(uint _storeID) external view returns (uint[] memory) {
        // return 
        return storeIDToOrder[_storeID];
    }

    function GetAllOrderInformation() external view returns (uint[] memory) {
        // return 
        return AllOrderList;
    }

    // only the user can modify his/her order
    modifier userOf(uint _orderID) {
        require(msg.sender == orderIDToOrder[_orderID].userAddr);
        _;
    } 

    // only the deliveryman can modify his/her order
    modifier deliveryOf(uint _orderID) {
        require(msg.sender == orderIDToOrder[_orderID].deliverymanAddr);
        _;
    }  

    function UserSetMyOrderPost(uint _orderID, uint _storeID, uint[] calldata _itemsID, uint[] calldata _itemsNumber, uint _tipsValueMultiplicand) external payable returns(uint) {
        if (_orderID == uint(0)) {
            // need to pay ether
            require(msg.value == 0.001 ether);
            // create a new orderID via keccak256 (block.timestamp (= now), _storeID, address)
            uint _updateTime = now;
            orderid++;
            _orderID = orderid;
            Order memory newOrder = Order(_updateTime, _orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand, 0, 0, 0, false, false, false, false, msg.sender, address(0));
            // add a new order into the public set
            AllOrderList.push(_orderID);
            // add a new order to the store
            storeIDToOrder[_storeID].push(_orderID);
            // mapping orderID to order
            orderIDToOrder[_orderID] = newOrder;
            // fire event
            emit NewOrderBasic(_updateTime, _orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand);
            emit NewOrderScore(0, 0, 0);
            emit NewOrderBoolandAddr(false, false, false, false, msg.sender, address(0));
            // return orderID
            return _orderID;
        } else if (_orderID > uint(0)) {
            // if want to modify
            require(msg.sender == orderIDToOrder[_orderID].userAddr);
            orderIDToOrder[_orderID].setTime = now;
            orderIDToOrder[_orderID].storeID = _storeID;
            orderIDToOrder[_orderID].itemsID = _itemsID;
            orderIDToOrder[_orderID].itemsNumber = _itemsNumber;
            orderIDToOrder[_orderID].tipsValueMultiplicand = _tipsValueMultiplicand;
            // fire new order event
            emit NewOrderBasic(orderIDToOrder[_orderID].setTime, _orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand);
            // return orderID
            return _orderID;
        }
        
    }

    function SetOrderDelivering(uint _orderID) external payable {
        // need to pay ether
        require(msg.value == 0.001 ether);
        // return orderID
        orderIDToOrder[_orderID].deliverymanAddr = msg.sender;
        orderIDToOrder[_orderID].isDelivering = true;
        // fire event
        emit OrderDelivering(_orderID);
        // return;
    }

    function SetOrderDelivered(uint _orderID) external deliveryOf(_orderID) {
        // assure call by deliveryman
        orderIDToOrder[_orderID].isDelivered = true;
        // fire event
        emit OrderDelivered(_orderID);
        // return;
    }

    function SetOrderReceived(uint _orderID) external userOf(_orderID) {
        // assure call by customer
        orderIDToOrder[_orderID].isReceived = true;
        // fire event
        emit OrderReceived(_orderID);
        // return;
    }

    function UserRateStore(uint _orderID, uint _userToStoreScore) external userOf(_orderID) {
        // return new rate
        orderIDToOrder[_orderID].userToStoreScore = _userToStoreScore;
        PeopleNumRateTheStar[orderIDToOrder[_orderID].storeID][_userToStoreScore]++;
        // fire event
        emit StoreBeenRated(msg.sender, _orderID, _userToStoreScore);
        // return;
    }

    function UserRateDeliveryman(uint _orderID, uint _userToDeliverymanScore) external userOf(_orderID) {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].userToDeliverymanScore = _userToDeliverymanScore;
        // fire event
        emit DeliverymanBeenRated(msg.sender, _orderID, _userToDeliverymanScore);
        // return;
    }

    function DeliverymanRateCustomer(uint _orderID, uint _deliverymanToUserScore) external deliveryOf(_orderID) {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].deliverymanToUserScore = _deliverymanToUserScore;
        // fire event
        emit UserBeenRated(msg.sender, _orderID, _deliverymanToUserScore);
        // return;
    }

}
