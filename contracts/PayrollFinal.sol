//solium-disable linebreak-style
pragma solidity ^0.4.14;

contract PayrollFinal{
    struct Employee{
        address id;
        uint salary;
        uint lastPayday;
    }


    uint constant payDuration = 10 seconds;

    uint totalSalary = 0;
    address owner;
    mapping(address => Employee) employees;
    
    function Payroll() public{
        owner =msg.sender;
    }
    
    function _partialPaid(Employee employee) private{
        uint payment = employee.salary*(now-employee.lastPayday)/payDuration;
        employee.id.transfer(payment);
    }
    
    
    function addEmployee(address employeeId, uint salary) public{
        require(msg.sender == owner);
        var employee = employees[employeeId];
        assert(employee.id == 0x0);
        
        totalSalary += salary * 1 ether;
        employees[employeeId] = Employee(employeeId, salary * 1 ether, now);
    }
    
    function removeEmployee(address employeeId) public{
        require(msg.sender == owner);
        var employee = employees[employeeId];
        assert(employee.id != 0x0);
        
        _partialPaid(employee);
        totalSalary -= employees[employeeId].salary;
        delete employees[employeeId];
       
    }
    
    function updateEmployee(address employeeId, uint salary) public{
        require(msg.sender == owner);
        var employee = employees[employeeId];
        assert(employee.id != 0x0);
        
        _partialPaid(employee);
        totalSalary -= employees[employeeId].salary;
        employees[employeeId].salary = salary * 1 ether;
        totalSalary += employees[employeeId].salary;
        employees[employeeId].lastPayday = now;
    }
    
    function addFund() public payable returns(uint) {
        return this.balance;
    }
    
    function calculateRunway() public returns (uint){
        
        return this.balance / totalSalary;
    }
    
    function hasEnoughFund() public returns (bool){
        return calculateRunway() > 0;
    }
    
    function getPaid() public{
        var employee = employees[msg.sender];
        assert(employee.id != 0x0);
        
        uint nextPayday = employee.lastPayday + payDuration;
        assert(nextPayday < now);
        
        employees[msg.sender].lastPayday = nextPayday;
        employee.id.transfer(employee.salary);
    }
}