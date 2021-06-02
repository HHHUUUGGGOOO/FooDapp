pragma solidity >=0.4.25 <0.6.0;

import "./BaseData.sol";
import "./ownable.sol";
import "./safemath.sol";

// Create, edit, and view order here

contract OrderInterface is BaseData {
    function GetOrderbyOrderID(uint _orderID) external view returns (Order) {
        // return 
        return orderIDToOrder[_orderID];
    }

    function GetOrderbyStoreID(uint _storeID) external view returns (Order[]) {
        // return 
        return storeIDToOrder[_storeID];
    }

    function GetAllOrderInformation() external view returns (Order[]) {
        // return 
        return AllOrderList;
    }

}

contract OrderContract is BaseData, Ownable {
    // prevent overflow
    using SafeMath for uint256;
    // declare event
    event NewOrder(setTime, orderID, storeID, itemsID, itemsNumber, tips, d_score, u_score, s_score, u_rated, d_rated, s_rated, isConfirmed, isDelivering, isDelivered, isReceived, userAddr);
    event OrderDelivering(orderID);
    event OrderDelivered(orderID);
    event OrderReceived(orderID);
    event UserBeenRated(addr, orderID, score);
    event DeliverymanBeenRated(addr, orderID, score);
    event StoreBeenRated(addr, orderID, score);

    uint _idDigit   = 64;
    uint _idModulus = 10 ** _idDigit;

    // only us can withdraw the ether user sent to this contract
    function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
    }

    // only the user can modify his/her order
    modifier userOf(uint _orderId) {
        require(msg.sender == orderIDToOrder[_orderId].userAddr);
        _;
    } 

    // only the deliveryman can modify his/her order
    modifier deliveryOf(uint _orderId) {
        require(msg.sender == orderIDToOrder[_orderId].deliverymanAddr);
        _;
    }  

    function UserSetMyOrderPost(uint _storeID, uint[] memory _itemsID, uint[] memory _itemsNumber, uint _tipsValueMultiplicand) external payable returns(uint) {
        // need to pay ether
        require(msg.value == 0.001 ether);
        // create a new orderID via keccak256 (block.timestamp (= now), _storeID, address)
        uint _updateTime = now;
        uint _orderID = uint(keccak256(abi.encodePacked(_updateTime, _storeID, msg.sender))) % (_idModulus);
        Order newOrder = new Order(_updateTime, _orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand, 0, 0, false, false, false, false, false, false, msg.sender);
        // add a new order into the public set
        AllOrderList.push(newOrder);
        // add a new order to the store
        Order[] storeIDToOrderList;
        storeIDToOrderList = storeIDToOrder[_storeID];
        storeIDToOrderList.push(newOrder);
        // mapping orderID to order
        orderIDToOrder[_orderID] = newOrder;
        // fire event
        emit NewOrder(_updateTime, _orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand, 0, 0, false, false, false, false, false, false, msg.sender);
        // return orderID
        return _orderID;
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

    function SetOrderDelivered(uint _orderID) external deliveryOf(_orderId) {
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
        storeIDToStore[orderIDToOrder[_orderID].storeID].PeopleNumRateTheStar[_userToStoreScore] = storeIDToStore[orderIDToOrder[_orderID].storeID].PeopleNumRateTheStar[_userToStoreScore].add(1);
        orderIDToOrder[_orderID].storeIsRated = true;
        // fire event
        emit StoreBeenRated(msg.sender, _orderID, _userToStoreScore);
        // return;
    }

    function UserRateDeliveryman(uint _orderID, uint _userToDeliverymanScore) external userOf(_orderID) {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].userToDeliverymanScore = _userToDeliverymanScore;
        orderIDToOrder[_orderID].deliverymanIsRated = true;
        // fire event
        emit DeliverymanBeenRated(msg.sender, _orderID, _userToDeliverymanScore);
        // return;
    }

    function DeliverymanRateCustomer(uint _orderID, uint _deliverymanToUserScore) external deliveryOf(_orderId) {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].deliverymanToUserScore = _deliverymanToUserScore;
        orderIDToOrder[_orderID].userIsRated = true;
        // fire event
        emit UserBeenRated(msg.sender, _orderID, _deliverymanToUserScore);
        // return;
    }

}
