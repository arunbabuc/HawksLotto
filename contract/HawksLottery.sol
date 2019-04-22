pragma solidity ^0.4.25;

contract HawksLottery{
    address public owner;
    address[] public players;

    constructor () public {
        owner = msg.sender;
    }

    function play() public payable{
        // enforce the min requirement of 0.01 ether to play 
        require(msg.value >= 0.01 ether);
        players.push(msg.sender);
    }
}
