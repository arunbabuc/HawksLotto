pragma solidity ^0.4.25;

contract HawksLottery{
    address public owner;
    address[] public players;

    constructor () public {
        owner = msg.sender;
    }

    function play() public payable{
        // thats the minimum requirement to participate in the lottery
        // multiple entries - your chances go high
        require(msg.value >= 0.01 ether);
        players.push(msg.sender);
    }

    // this is just a pseudo random number
    function randomGen() private view returns (uint) {
        return uint(keccak256(abi.encode(block.difficulty, now, players)));
    }

    function pickLucky() public restrictedToOwner {
        uint winnerIndex = randomGen() % players.length;
        players[winnerIndex].transfer(this.balance);
        // create the new player dynamic list
        players = new address[](0);
    }

    // modifier example to avoid repeated code
    // _; replaced with the remaining code of the function
    modifier restrictedToOwner() {
        require(owner == msg.sender);
        _;
    }

    // may be a function to show the players in the webApp
    function showPlayers() public view returns (address[]) {
        return players;
    }

}
