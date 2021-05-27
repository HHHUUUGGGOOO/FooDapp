pragma solidity >=0.4.25 <0.6.0;

// Create, edit, and view order here

contract OrderInterface {

    function GetAllOrderBasicInformation() external view returns (
        // return orderID, timestamp, fee, store
    );

    function GetAllOrderDetailInformation() external view returns (
        // return orderID, timestamp, fee, store, orderContent
    );

}

contract OrderContract {

    // Declare event
    event NewOrder();

    function UserSetMyOrderPost() external payable {
        // return orderID
    }

    function SetOrderDelivering() external payable {
        // return orderID
    }

}