pragma solidity ^0.4.17;

contract CharityFactory {
    // variable for storing all the addresse's of deployed charities
    address[] public deployedCharities;

    // deploys a new instance of a charity and stores the resulting address
    function createCharity(uint minimum, string name) public {
        require(minimum > 0);
        address newCharity = new Charity(minimum, msg.sender, name);
        deployedCharities.push(newCharity);
    }

    // returns a list of all deployed charitites
    function getDeployedCharities() public view returns (address[]) {
        return deployedCharities;
    }
}

contract Charity {
    /*
    -struct is a way to define new types
    -this is struct definition -> it needs to be initialized
    */
    struct Milestone {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    /*
    variables and function modifiers used by this contract:
    -requests: an array of type requests (struct)
    -manager: manager of the contract
    -minimunContribution: minimun contribution
    -donors: mapping of donors (mapping is reference type variable, default value is false)
    -donorsCount: count of donors
    */ 
    Milestone[] public milestones;
    uint public milestonesCompleted;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public donors;
    uint public donorsCount;
    string public name;

    // function modifier that requires that msg.sender is manager
    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    modifier donorsOnly() {
        require(donors[msg.sender]);
        _;
    }

    // Campaign constructor with arguments: minimum contribution and creator
    constructor (uint minimum, address creator, string _name) public {
        manager = creator;
        minimumContribution = minimum;
        milestonesCompleted = 0;
        name = _name;
    }

    /*
    -function for users to contribute to a campaign
    -must be marked payable because money is trasferred
    */
    function donate() public payable {
        /*
        require statement to chech minimum contribition is met
        msg.value = how much money is in the transaction
        minimum contribution > 0.1
        */ 
        require(msg.value > minimumContribution); // donation is greater than minimum conttribtion

        /*
        rwquire: if donor has already donated
        add msg.sender to donors
        and increase donors count by one
        */
        require(donors[msg.sender] == false); // only one donation per address
        donors[msg.sender] = true;
        donorsCount++;
    }

    /*
    -function to create new requests
    -arguments in constructor: description, value, recipient
    -modifier: onlyManager
    */
    function createMilestone(string description, uint value, address recipient) public managerOnly {
        /*
        create new request and assign key-value pairs
        alternative syntax to create struct: Request(description, value, recipient, false); (in this case arguments must be in correct order)
        we don't need to initialize reference type variables (mappings)
        memory keyword must be used because this struct exist only in this function (later it is stored to an array(storage))
        */
        Milestone memory newMilestone = Milestone({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        // add this newly created request and push it to the requests array
        milestones.push(newMilestone);
    }

    /*
    -function for approving request
    -takes argument index (which request the user wants to approve)
    */
    function approveMilestone(uint index) public {
        // create local variable request and mark it with keyword storage because we want to manipulate data in the storage (outside of this function)
        Milestone storage milestone = milestones[index];
        /*
        require statements:
        -user who wants to approve is listed in the donors mapping
        -user who wants to approve hasn't approved the request yet
        */
        require(donors[msg.sender]); // sender is a donor
        require(!milestone.approvals[msg.sender]); // and sender hasn't approved this yet
        /*
        access request struct:
        -set msg.sender to be true in approvals
        -increment approvals count by one
        */
        milestone.approvals[msg.sender] = true;
        milestone.approvalCount++;
    }

    /*
    -function for finalizing requests
    -takes argument index (which request the user wants to finalize)
    -only manager can finalize
    */
    function finalizeMilestone(uint index) public managerOnly {
        // create local variable request and mark it with keyword storage because we want to manipulate data in the storage (outside of this function)
        Milestone storage milestone = milestones[index];

        /*
        to finalize request the following require statements must be met:
        -minimum 50% has approved the request
        -request is not complete (request.complete = false)
        */
        require(milestone.approvalCount > (donorsCount / 2));
        require(!milestone.complete);

        /*
        -access the recipient of the request and transfer the amount specified by request's value
        -set request's complete to be true
        */
        milestonesCompleted++;
        uint value = milestone.value;
        milestone.value = 0;
        milestone.complete = true;
        milestone.recipient.transfer(value);
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, uint, address, string
      ) {
        return (
          minimumContribution,
          address(this).balance,
          milestones.length,
          donorsCount,
          milestonesCompleted,
          manager,
          name
        );
    }

    function getMilestonesCount() public view returns (uint) {
        return milestones.length;
    }
}