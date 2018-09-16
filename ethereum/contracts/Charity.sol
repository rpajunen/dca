pragma solidity ^0.4.17;

contract CharityFactory {
    address[] public deployedCharities;

    function createCharity(uint minimum) public {
        require(minimum > 0);
        address newCharity = new Charity(minimum, msg.sender);
        deployedCharities.push(newCharity);
    }

    function getDeployedCharities() public view returns (address[]) {
        return deployedCharities;
    }
}

contract Charity {
    struct Milestone {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Milestone[] public milestones;
    uint public milestonesCompleted;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public donors;
    uint public donorsCount;
    string public name;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    modifier donorsOnly() {
        require(donors[msg.sender]);
        _;
    }

    function Charity (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        milestonesCompleted = 0;
    }

    function donate() public payable { 
        require(msg.value > minimumContribution);

        require(donors[msg.sender] == false);
        donors[msg.sender] = true;
        donorsCount++;
    }

    function createMilestone(string description, uint value, address recipient) public managerOnly {
        Milestone memory newMilestone = Milestone({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        milestones.push(newMilestone);
    }

    function approveMilestone(uint index) public {
        Milestone storage milestone = milestones[index];

        require(donors[msg.sender]);
        require(!milestone.approvals[msg.sender]);

        milestone.approvals[msg.sender] = true;
        milestone.approvalCount++;
    }

    function finalizeMilestone(uint index) public managerOnly {
        Milestone storage milestone = milestones[index];

        require(milestone.approvalCount > (donorsCount / 2));
        require(!milestone.complete);

        milestonesCompleted++;
        uint value = milestone.value;
        milestone.value = 0;
        milestone.complete = true;
        milestone.recipient.transfer(value);
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          address(this).balance,
          milestones.length,
          donorsCount,
          milestonesCompleted,
          manager
        );
    }

    function getMilestonesCount() public view returns (uint) {
        return milestones.length;
    }
}