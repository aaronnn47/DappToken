pragma solidity ^0.4.2;

contract DappToken{
    //constructor 
    //set the tokens
    //read the total number of tokens
    uint256 public totalSupply;
    
    function DappToken () public {
        totalSupply = 1000000;
    }
} 