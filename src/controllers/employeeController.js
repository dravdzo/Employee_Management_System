

async function getEmployees(Employee){
  return await Employee.find();
}

async function getEmployeeById(Employee , id){
  return await Employee.findById(id);
}

async function addEmployee(Employee , employeeObject){
  return await Employee.create(employeeObject);
}

async function updateEmployee(Employee, id, employeeObject) {
    return await Employee.updateOne(
        { _id: id },
        { $set: employeeObject }
    );
}

async function deleteEmployee(Employee , id){
  return await Employee.deleteOne({_id:id});
}

async function getEmployeeByDepartment(Employee , department){
  return await Employee.find({department:department});
}

async function getActiveEmployee(Employee){
  return await Employee.find({active:true});
}

async function getEmployeeByName(Employee ,name){
  return await Employee.find({name:name});
}


