pragma solidity ^0.4.2;

contract DappToken{
    //constructor 
    //set the tokens
    //read the total number of tokens
    //add name
    //add symbol
    uint256 public totalSupply;

    // initializing name
    string public name = "Dapp Token";

    //initializing symbol
    string public symbol = "Dapp";

    // initializing standard
    string public standard = "Dapp Token v1.0";

    // transfers must emit transfer events
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    function DappToken (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        //allocate the initial supply
    }
    // transfer
    function transfer(address _to, uint256 _value) public returns (bool success){
    // exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value);

    // transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

    // transfer event
        Transfer(msg.sender, _to, _value);

    // return boolean

        return true;
    }
} 