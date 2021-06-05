pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

import "./BaseData.sol";
import "./ownable.sol";
// import "./safemath.sol";

// Create, edit, and view store here

contract StoreInterface is BaseData {
    function UserGetAllStore(string memory _cityName) public view returns(uint[] memory) {
        // return storeID[]
        return cityNameToStoreList[_cityName];
    }

    function AddressGetStoreID() public view returns(uint[] memory) {
        // return 
        return ownerAddrToStoreID[msg.sender];
    }
}

contract StoreContract is BaseData, Ownable {
    // prevent overflow
    // using SafeMath for uint256;

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
}
