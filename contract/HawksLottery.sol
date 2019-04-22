pragma solidity ^0.4.25;

contract HawksLottery{
    address public owner;
    address[] public players;

    constructor () public {
        owner = msg.sender;
    }

    function play() public payable{
        players.push(msg.sender);
    }
}
