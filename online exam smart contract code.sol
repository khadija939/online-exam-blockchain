pragma solidity ^0.5.11;
//it is used for sending structured data in response. It will throw a warning for not using in production.
//otherwise we have serialize and deserialize the data
pragma experimental ABIEncoderV2;

contract OnlineExam {

//question structure, that would added by teacher, includes statement, mark, correct Index and 4 answers
    struct Question{
        uint mark;
        uint correctIndex;
        string statement;
        string [4] answers;
    }
//examSubmission structure, that will be submitted by student for each respective question, with questionId and answerIndex. markObtained will be calculated by the function
    struct ExamSubmission{
        uint questionId;
        uint answerIndex;
        uint markObtained;
    }

//Exam structure, that would be created by Authorize teacher.
//Questions array contains questions added by teacher
//studentsCount would be used for getting addresses of enrolled students 
//studentsAllowed for checking status of students enrolled
//answersSubmitted is Exam Submission array, which is holding examSubmission for each respective student
    struct Exam{
        uint startTime;
        string subject;
        address teacher;
        uint duration;
        uint date;
        Question[] questions;
        address [] studentsCount;
        mapping(address => bool) studentsAllowed;
        mapping(address => bool) tokensReceived;
        mapping(address => ExamSubmission[]) answersSubmitted;
    }
    
//ExamResult structure for returning students result with its complete submission
    struct ExamResult{
        address student;
        string stuId;
        ExamSubmission[] examSubmission;
    }

//Teacher, Student structure to be returned
struct Users{
    address userAddress;
    string    name;
    string    UniId;

}

//all Exam Structure

struct AllExam {
        uint examId;
        uint startTime;
        string subject;
        string teacher;
        uint duration;
        uint date;
        Question[] questions;
        address [] studentsCount;
}
 
struct AllExamWithResult {
        uint startTime;
        string subject;
        address teacher;
        uint duration;
        uint date;
        Question[] questions;
        ExamResult [] submissions;
}
 
    
//Token 
    string public constant tokenName = "OnlineExamToken";
    string public constant tokenSymbol = "OET";
    uint8 public constant decimals = 0;  
    uint256 totalSupply = 1000000000000;
//number of tokens against an address
    mapping(address => uint256) balances;
//owner of smart contract. Admin who will instantiate the contract.
    address public owner; 
//Authorize list of teachers with their university id added by admin/owner
    mapping( address => Users) public teachers;
//maintining count for all teachers
    address[] public totalTeachersCount;
//Authorize list of students with their university id added by Admin/owner
    mapping( address => Users ) public students;
//maintining count for all students
    address[] public totalStudentsCount;
    
//List of all exams created
    Exam[] public exams;

    event Transfer(address indexed from, address indexed to, uint tokens);

//Modifier for checking caller is Admin only
    modifier AdminOnly() {
          require(msg.sender == owner, "Caller is not Admin");
          _;
    }

//Modifier for checking caller is Teacher only
    modifier TeacherOnly(address teacher) {
        bytes memory tempEmptyStringTest = bytes(teachers[teacher].name);
          require(tempEmptyStringTest.length != 0, "Only Authorize Teacher Allowed.");
          _;
    }
//Modifier for checking caller is Student only
    modifier StudentOnly(uint examId) {      
            require(exams[examId].studentsAllowed[msg.sender], "Only Enrolled Student Allowed.");
            _;
    }
    
//Library used for addition/subtraction to avoid overflow issue/bug
    using SafeMath for uint256;

//constructor will be called, when contract first deployed
//caller of the contract would become the owner/admin and total supply of tokens would be its balance
    constructor() public {
       owner = msg.sender;
       balances[msg.sender] = totalSupply;
    }  

function remainingSupply()public view returns(uint){
            return balances[owner];
}

//getAll Teachers
function getAllTeachers() public view returns (Users[] memory){
        Users[] memory returningTeachers = new Users[](totalTeachersCount.length);
        for (uint i = 0; i<totalTeachersCount.length; i++){
                    returningTeachers[i].userAddress = totalTeachersCount[i];
                    returningTeachers[i].name = teachers[totalTeachersCount[i]].name;
                    returningTeachers[i].UniId = teachers[totalTeachersCount[i]].UniId;
            }
    return returningTeachers;
}

//getAll Students
function getAllStudents() public view  returns (Users[] memory){
    Users[] memory returningStudents = new Users[](totalStudentsCount.length);
        for (uint i = 0; i<totalStudentsCount.length; i++){
                    returningStudents[i].userAddress = totalStudentsCount[i];
                    returningStudents[i].name = students[totalStudentsCount[i]].name;
                    returningStudents[i].UniId = students[totalStudentsCount[i]].UniId;
            }
    return returningStudents;
}
//getAll Exams

function getAllExams() public view returns (AllExam[] memory){
        AllExam[] memory allExams = new AllExam[](exams.length);
            for(uint j=0; j<exams.length ; j++)
            {   
                allExams[j].examId = j;
                allExams[j].subject = exams[j].subject;
                allExams[j].teacher = teachers[exams[j].teacher].name;
                allExams[j].date =  exams[j].date;
                allExams[j].duration = exams[j].duration;
                allExams[j].startTime = exams[j].startTime;
                allExams[j].questions = exams[j].questions;
                allExams[j].studentsCount = exams[j].studentsCount;
            }
            return allExams;
}

//solidity limitation contract not deploying
// function getAllExamsWithResults() public view AdminOnly TeacherOnly returns (AllExamWithResult[] memory){

//         AllExamWithResult[] memory allExams = new AllExamWithResult[](exams.length);
//             for(uint j=0; j<exams.length ; j++)
//             {
//                 allExams[j].subject = exams[j].subject;
//                 allExams[j].teacher = exams[j].teacher;
//                 allExams[j].date =  exams[j].date;
//                 allExams[j].duration = exams[j].duration;
//                 allExams[j].startTime = exams[j].startTime;
//                 allExams[j].questions = exams[j].questions;
//       for(uint i=0; i < exams[j].studentsCount.length; i++){

//             //adding respective student address
//             allExams[i].submissions[i].student = exams[j].studentsCount[i];
//             //adding its submission in result array
//             allExams[i].submissions[i].examSubmission = exams[j].answersSubmitted[exams[j].studentsCount[i]];
//         }
//             }
//             return allExams;
// }

//fucntion for creating exam will be called by authorize teacher only
//date will be pass in as unix timestamp
//durationMinutes the duration of exam
    function createExam(string memory subject, uint date, uint durationMinutes) public TeacherOnly(msg.sender) returns (uint){
        uint examId = exams.length++; // this is increment the total number of exams
        exams[examId].subject = subject;
        exams[examId].teacher = msg.sender;
        exams[examId].date = date;
        exams[examId].duration = durationMinutes;
        return examId;
    }

//startExam will be called by teacher, to start the exam 
    function startExam(uint examId) public TeacherOnly(msg.sender) returns(bool){
        require(exams[examId].startTime == 0, 'Exam has Already Started.');
        exams[examId].startTime = now;
        return true;
    }

//Authorize teacher, enrolling students to respective exam by examId
    function addStudentsToExam(uint examId, address[] memory student) public TeacherOnly(msg.sender) returns (bool){
        for(uint i=0; i<student.length; i++){
            exams[examId].studentsAllowed[student[i]] = true; // making student allowed address value equal to true
            exams[examId].studentsCount.push(student[i]); //pushing student address in studentsCount
        }
            return true;
    }
//Teacher can see the total number of students with their address in exam
    function getStudentsOfExam(uint examId) view public TeacherOnly(msg.sender) returns (address [] memory){
            return exams[examId].studentsCount;
    }

//Teacher will add questions to rescptive exam by its Id
//other parameters are simple
    function addQuestion(uint examId, uint mark, uint correctIndex, string memory statement,
                        string memory answerOne, string memory answerTwo, string memory answerThree, string memory answerFour ) public TeacherOnly(msg.sender) returns (bool){
            
            uint qId = exams[examId].questions.length++;
            exams[examId].questions[qId].mark = mark;
            exams[examId].questions[qId].correctIndex = correctIndex;
            exams[examId].questions[qId].statement = statement;
            exams[examId].questions[qId].answers[0] = answerOne;
            exams[examId].questions[qId].answers[1] = answerTwo;
            exams[examId].questions[qId].answers[2] = answerThree;
            exams[examId].questions[qId].answers[3] = answerFour;
            return true;
    }
//Teacher can get the total questions in an exam 
    function getQuestions(uint examId) view public TeacherOnly(msg.sender) returns (Question[] memory){
            return exams[examId].questions;
    }
//Students will submitAnswer one by one for each question 
//examId for which exam, quesionId for which question and answerIndex
    function submitAnswer( uint examId, uint questionId, uint answerIndex ) public StudentOnly(examId) returns (bool){
            
            //checking exam has started or not
            require(exams[examId].startTime > 0, 'Exam has not started yet'); 
            //checking exam duration ended
            require(now < (exams[examId].startTime + exams[examId].duration), 'Exam Time Submission has ended.');
            
            //If students has already answered the question
            for(uint i=0 ; i<exams[examId].answersSubmitted[msg.sender].length ; i++){
                if(exams[examId].answersSubmitted[msg.sender][i].questionId == questionId)
                    revert('Answer Already Submitted.');
            }
            

            //getting submission id, because answersSubmitted is a mapping which has examSubmission Array
            //we need to get the count of total answers submitted to add new answer in the array
            //then simply adding the answer submitted in the array, with questionId and answerIndex
            uint subId = exams[examId].answersSubmitted[msg.sender].length++;
            exams[examId].answersSubmitted[msg.sender][subId].questionId = questionId;
            exams[examId].answersSubmitted[msg.sender][subId].answerIndex = answerIndex;
            
            //Checking if the answer submitted is correct
            //if yes add the marks for answersubmitted else 0 given
            if(exams[examId].questions[questionId].correctIndex == answerIndex)
                exams[examId].answersSubmitted[msg.sender][subId].markObtained = exams[examId].questions[questionId].mark;
            else
                exams[examId].answersSubmitted[msg.sender][subId].markObtained = 0;
            
            return true;
    }
//students will call get Exam  by providing a date
    function getExam( uint examId ) public view returns (string memory, string memory,  uint ,  Question[] memory ){
            //checking valid examId
            require(examId >= 0 && examId < exams.length , "Invalid examId.");
            //check if exam has the same student calling is enrolled or not
            require(exams[examId].studentsAllowed[msg.sender], "You are not enrolled in this exam.");
                    
            //checking if exam has started
            require(exams[examId].startTime > 0, 'Exam has not started yet.');
            
            //return subject name of exam and all its questions with statement, marks, and 4answers
            string memory subject = exams[examId].subject;
            Question[] memory q = new Question[](exams[examId].questions.length);
            for(uint j=0; j<exams[examId].questions.length ; j++)
            {
                q[j].mark = exams[examId].questions[j].mark;
                q[j].correctIndex = 9; // making corect index to 9, otherwise it will send 0
                q[j].statement = exams[examId].questions[j].statement;
                q[j].answers[0] = exams[examId].questions[j].answers[0];
                q[j].answers[1] = exams[examId].questions[j].answers[1];
                q[j].answers[2] = exams[examId].questions[j].answers[2];
                q[j].answers[3] = exams[examId].questions[j].answers[3];
            }
            return (subject, teachers[exams[examId].teacher].name, exams[examId].duration, q);
                          
    }
//Student can call getTotalMarks, to get the marks obtained by them in an eaxm by examId
    function getTotalMarks(uint examId ) public view StudentOnly(examId) returns(uint){
        uint marks = 0;
        uint qId = 0 ;
        uint answerIndex = 0;
        uint correctIndex = 0;
        //looping through all answers submitted by calling student 
        //then checking if answer is correct or not
        //and respective marks
        for (uint i=0; i < exams[examId].answersSubmitted[msg.sender].length ;i++){
            qId = exams[examId].answersSubmitted[msg.sender][i].questionId;
            answerIndex = exams[examId].answersSubmitted[msg.sender][i].answerIndex;
            correctIndex = exams[examId].questions[qId].correctIndex;
                
            if(answerIndex == correctIndex){
                marks = marks + exams[examId].questions[qId].mark;        
            }
        }
        return marks;
    }
//getResult will be called by Admin or Techer to see the result of respective exam
//it will be an with student address and their submissions
    function getResult(uint examId) public view returns (ExamResult[] memory ){
        //initializing array with the number of students count in an exam
        ExamResult[] memory result = new ExamResult[](exams[examId].studentsCount.length);    
        for(uint i=0; i < exams[examId].studentsCount.length; i++){

            //adding respective student address
            result[i].student = exams[examId].studentsCount[i];
            result[i].stuId = students[exams[examId].studentsCount[i]].UniId;
            //adding its submission in result array
            result[i].examSubmission = exams[examId].answersSubmitted[result[i].student];
        }
        return(result);
    }
//get the total supply of tokens
    function getTotalSupply() public view returns (uint256) {
	return totalSupply;
    }
//check the balance of an address, how many tokens he/she have
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
//transfer tokens from the admin account to students
//only authorize teacher can make the trasaction
    function transfer(address receiver, uint numTokens, uint examId) public TeacherOnly(msg.sender) returns (bool) {
        //checking receiving student is added by the admin or not
        bytes memory tempEmptyStringTest = bytes(students[receiver].name);
        require(tempEmptyStringTest.length != 0, "Only Enrolled Student can Receive Tokens.");
        balances[owner] = balances[owner].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        exams[examId].tokensReceived[receiver] = true;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    function checkTokenReceived(address receiver, uint examId) public view returns(bool){
        return exams[examId].tokensReceived[receiver];
    }
//admin adding the student address with its universityId
    function addStudent(address stuAddress, string memory name, string memory id) public AdminOnly returns (bool) {
        students[stuAddress].name = name;
        students[stuAddress].UniId = id;
        uint countLength =  totalStudentsCount.length++;
        totalStudentsCount[countLength] = stuAddress;
        return true;
    }
//admin removing the student address
    function removeStudent( address stuAddress) public AdminOnly returns (bool){
        delete students[stuAddress];
        for (uint i = 0; i<totalStudentsCount.length; i++){
            if(totalStudentsCount[i] == stuAddress){
                delete totalStudentsCount[i];
            }
        }
        return true;
    }
//admin adding the teacher address with its universityId
    function addTeacher(address teacherAddress, string memory name, string memory id) public AdminOnly  returns (bool){
        teachers[teacherAddress].name = name;
        teachers[teacherAddress].UniId = id;
        uint countLength =  totalTeachersCount.length++;
        totalTeachersCount[countLength] = teacherAddress;
        return true;
    }
//admin removing the teacher address 
    function removeTeacher( address teacherAddress) public AdminOnly returns (bool){
        delete teachers[teacherAddress];
        for (uint i = 0; i<totalTeachersCount.length; i++){
            if(totalTeachersCount[i] == teacherAddress){
                delete totalTeachersCount[i];
            }
        }
                return true;
    }
    
    function getTotalStudentsCount() public view returns(uint){
        return totalStudentsCount.length;
    }
    function getTotalTeachersCount() public view returns(uint){
        return totalTeachersCount.length;
    } 
}
//SafeMath library for add/sub to handle the overflow issue
//SafeMath - is a solidity math library especially designed to support safe math operations
// safe means that it prevents overflow when working with uint

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
