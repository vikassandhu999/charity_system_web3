pragma solidity ^0.4.17;

// A master contract that will be deployed by the organization
contract CharityCreator {
    // we have addresses of all the deployed contracts of fundraisers/charity
    address[] public deployedCampaigns;
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function createCharity(string memory name, uint256 minimum) public {
        address newCharity = new Charity(name, minimum, msg.sender);
        deployedCampaigns.push(newCharity);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function isContractOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}

// A fundraiser contract, that will be deployed by organization dynamically
contract Charity {
    // request to widthdraw money from fundraiser
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    //stores all the requests
    Request[] public requests;

    string public name;
    address public manager;
    uint256 public minimumContribution;

    mapping(address => bool) public approvers;

    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        string memory _name,
        uint256 minimum,
        address creator
    ) public {
        name = _name;
        manager = creator;
        minimumContribution = minimum;
    }

    // get current balance of the fundraiser
    function getCurrentAmount() public view returns (uint256) {
        return address(this).balance;
    }

    // normal people can contribute to the contract
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    // organization manager can create a widthdrawal request
    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    // total number of widthdrawal requests in the fundraiser
    function numberOfRequests() public view returns (uint256) {
        return requests.length;
    }

    // normal people can approve request
    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    // once approved, manager can finalize request and actual money will be widthdrawn
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    // check if the address asked exists
    function checkIfAddressExists(address current, uint256 index) public view returns (bool) {
        Request storage request = requests[index];
        if(request.approvals[current]) {
            return true;
        } else {
            return false;
        }
        return false;
    }

    // check if the curent index is finalised
    function checkIfRequestFinalised(uint256 index) public view returns (bool) {
        Request storage request = requests[index];
        return request.complete;
    }

    // check if the address can improve
    function canPersonApprove(address current) public view returns (bool) {
        if(approvers[current]) {
            return true;
        } else {
            return false;
        }
        return false;
    }

}
