pragma solidity >=0.4.25 <0.6.0;

import "./BaseData.sol";

// Create, edit, and view order here

contract OrderInterface {
    function GetSpecificOrderInformation() external view returns (
        // return orderID, timestamp, fee, storeID
        
    );

    function GetAllOrderInformation(uint _storeID) external view returns (
        // return orderID, timestamp, fee, storeID, orderContent
        
    );

}

contract OrderContract is BaseData {
    // Declare event
    event NewOrder(orderID, storeID, itemsID, itemsNumber, tips, d_score, u_score, s_score, u_rated, d_rated, s_rated, isConfirmed, isDelivering, isDelivered, isReceived);
    event OrderDelivering(orderID);
    event OrderDelivered(orderID);
    event OrderReceived(orderID);
    event UserBeenRated(addr, orderID, score);
    event DeliverymanBeenRated(addr, orderID, score);
    event StoreBeenRated(addr, orderID, score);

    uint _idDigit   = 64;
    uint _idModulus = 10 ** _idDigit;

    function UserSetMyOrderPost(uint _storeID, uint[] memory _itemsID, uint[] memory _itemsNumber, uint _tipsValueMultiplicand) external payable returns(uint) {
        // create a new orderID via keccak256 (block.timestamp (= now), _storeID, address)
        uint _orderID = uint(keccak256(abi.encodePacked(now, _storeID, msg.sender))) % (_idModulus);
        // add a new order into the public set
        AllOrderList.push(Order(_orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand, 0, 0, false, false, false, false, false, false));
        // fire event
        emit NewOrder(_orderID, _storeID, _itemsID, _itemsNumber, _tipsValueMultiplicand, 0, 0, false, false, false, false, false, false);
        // return orderID
        return _orderID;
    }

    function SetOrderDelivering(uint _orderID) external payable {
        // return orderID
        orderIDToOrder[_orderID].isDelivering = true;
        // fire event
        emit OrderDelivering(_orderID);
        // return;
    }

    function SetOrderDelivered(uint _orderID) external {
        // assure call by deliveryman
        orderIDToOrder[_orderID].isDelivered = true;
        // fire event
        emit OrderDelivered(_orderID);
        // return;
    }

    function SetOrderReceived(uint _orderID) external {
        // assure call by customer
        orderIDToOrder[_orderID].isReceived = true;
        // fire event
        emit OrderReceived(_orderID);
        // return;
    }

    function UserRateStore(uint _orderID, uint _userToStoreScore) external {
        // return new rate
        orderIDToOrder[_orderID].userToStoreScore = _userToStoreScore;
        storeIDToStore[orderIDToOrder[_orderID].storeID].PeopleNumRateTheStar[_userToStoreScore]++;
        orderIDToOrder[_orderID].storeIsRated = true;
        // fire event
        emit StoreBeenRated(msg.sender, _orderID, _userToStoreScore);
        // return;
    }

    function UserRateDeliveryman(uint _orderID, uint _userToDeliverymanScore) external {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].userToDeliverymanScore = _userToDeliverymanScore;
        orderIDToOrder[_orderID].deliverymanIsRated = true;
        // fire event
        emit DeliverymanBeenRated(msg.sender, _orderID, _userToDeliverymanScore);
        // return;
    }

    function DeliverymanRateCustomer(uint _orderID, uint _deliverymanToUserScore) external {
        // rating only int (1~256) / exp
        orderIDToOrder[_orderID].deliverymanToUserScore = _deliverymanToUserScore;
        orderIDToOrder[_orderID].userIsRated = true;
        // fire event
        emit UserBeenRated(msg.sender, _orderID, _deliverymanToUserScore);
        // return;
    }

}
