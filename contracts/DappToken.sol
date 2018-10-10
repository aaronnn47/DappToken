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
    // approve event

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    // transfer event

    mapping(address => uint256) public balanceOf;
    
    //allowance
    mapping(address => mapping(address => uint256)) public allowance;

    function DappToken (uint256 _initialSupply) public {

        balanceOf[msg.sender] = _initialSupply;

        //allocate the initial supply
        totalSupply = _initialSupply;
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

    // Delegated Transfer
    
    // approve function

    function approve(address _spender, uint256 _value) public returns (bool success){
        //allowance 
        allowance[msg.sender][_spender] = _value;

        //approve event
        Approval(msg.sender, _spender, _value);

        return true;
    }

    // transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        
        // require _from has enough tokens
        require(_value <= balanceOf[_from]);
        // require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);
        // change the balanceOf
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // update the allowance
        allowance[_from][msg.sender] -= _value;
        //transfer event
        Transfer(_from,_to,_value);

        //return a boolean
        return true;
    }
} 