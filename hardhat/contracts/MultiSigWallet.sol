// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @notice Improved MultiSig wallet (submit, confirm, revoke, execute).
contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public threshold;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public isConfirmed;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "only owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _threshold) {
        require(_owners.length > 0, "owners required");
        require(_threshold > 0 && _threshold <= _owners.length, "invalid threshold");

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "owner is zero address");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }
        threshold = _threshold;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    fallback() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() external view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex) external view returns (
        address to,
        uint value,
        bytes memory data,
        bool executed,
        uint numConfirmations
    ) {
        Transaction storage tx_ = transactions[_txIndex];
        return (tx_.to, tx_.value, tx_.data, tx_.executed, tx_.numConfirmations);
    }

    function submitTransaction(address _to, uint _value, bytes memory _data) external onlyOwner {
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        }));
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint _txIndex) external onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        isConfirmed[_txIndex][msg.sender] = true;
        transaction.numConfirmations += 1;
        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint _txIndex) external onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");
        Transaction storage transaction = transactions[_txIndex];
        isConfirmed[_txIndex][msg.sender] = false;
        transaction.numConfirmations -= 1;
        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function executeTransaction(uint _txIndex) external onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.numConfirmations >= threshold, "cannot execute tx");

        transaction.executed = true;
        (bool success, ) = transaction.to.call{ value: transaction.value }(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }
}
