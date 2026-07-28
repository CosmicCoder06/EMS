let employees = [];
let employeeIdCounter = 1004;
let editingId = null;
let currentPage = 1;
let itemsPerPage = 5;
let sortColumn = null;
let sortDirection = 'asc';
let currentPhotoBase64 = '';

const employeeForm = document.getElementById('employeeForm');
const empNameInput = document.getElementById('empName');
const empEmailInput = document.getElementById('empEmail');
const empDeptSelect = document.getElementById('empDept');
const empPositionInput = document.getElementById('empPosition');
const empSalaryInput = document.getElementById('empSalary');
const empPhotoInput = document.getElementById('empPhoto');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

const searchNameInput = document.getElementById('searchName');
const filterDeptSelect = document.getElementById('filterDept');
const tableBody = document.getElementById('employeeTableBody');

const darkModeToggle = document.getElementById('darkModeToggle');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');

const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const importJsonInput = document.getElementById('importJsonInput');

function loadInitialData() {
  const savedEmployees = localStorage.getItem('employees');
  const savedCounter = localStorage.getItem('empCounter');

  if (savedEmployees) {
    employees = JSON.parse(savedEmployees);
    employeeIdCounter = savedCounter ? parseInt(savedCounter) : 1005;
  } else {
    employees = [
      {
        id: 'EMP-1001',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@company.com',
        department: 'IT & Development',
        position: 'Senior Engineer',
        salary: 85000,
        photo: ''
      },
      {
        id: 'EMP-1002',
        name: 'Priya Patel',
        email: 'priya.patel@company.com',
        department: 'Human Resources',
        position: 'HR Manager',
        salary: 70000,
        photo: ''
      },
      {
        id: 'EMP-1003',
        name: 'Amit Kumar',
        email: 'amit.kumar@company.com',
        department: 'Marketing & Sales',
        position: 'Sales Executive',
        salary: 52000,
        photo: ''
      }
    ];
    employeeIdCounter = 1004;
    saveDataToLocalStorage();
  }
}

function saveDataToLocalStorage() {
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('empCounter', employeeIdCounter.toString());
}

function updateStats() {
  const total = employees.length;
  document.getElementById('statTotal').textContent = total;

  if (total > 0) {
    const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
    const avg = Math.round(totalSalary / total);
    document.getElementById('statAvgSalary').textContent = '$' + avg.toLocaleString();

    const departments = new Set(employees.map(emp => emp.department));
    document.getElementById('statDepts').textContent = departments.size;

    const highest = Math.max(...employees.map(emp => Number(emp.salary)));
    document.getElementById('statHighest').textContent = '$' + highest.toLocaleString();
  } else {
    document.getElementById('statAvgSalary').textContent = '$0';
    document.getElementById('statDepts').textContent = '0';
    document.getElementById('statHighest').textContent = '$0';
  }
}

function getFilteredEmployees() {
  const nameQuery = searchNameInput.value.toLowerCase().trim();
  const deptFilter = filterDeptSelect.value;

  return employees.filter((emp) => {
    const matchesName = emp.name.toLowerCase().includes(nameQuery);
    const matchesDept = (deptFilter === 'all') || (emp.department === deptFilter);
    return matchesName && matchesDept;
  });
}

function getSortedEmployees(list) {
  if (!sortColumn) return list;

  let sorted = [...list];
  sorted.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (sortColumn === 'salary') {
      valA = Number(valA);
      valB = Number(valB);
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    valA = String(valA).toLowerCase();
    valB = String(valB).toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

function renderTable(employeeList) {
  tableBody.innerHTML = '';

  if (employeeList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="no-records">No matching employee records found.</td>
      </tr>
    `;
    pageInfo.textContent = 'Page 0 of 0';
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }

  let totalPages = Math.ceil(employeeList.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let pageItems = employeeList.slice(startIndex, endIndex);

  pageItems.forEach((employee) => {
    const row = document.createElement('tr');

    let photoHtml = '';
    if (employee.photo) {
      photoHtml = `<img src="${employee.photo}" class="profile-photo" alt="Photo">`;
    } else {
      photoHtml = `<div class="no-photo">👤</div>`;
    }

    row.innerHTML = `
      <td>${photoHtml}</td>
      <td>${employee.id}</td>
      <td>${employee.name}</td>
      <td>${employee.email}</td>
      <td>${employee.department}</td>
      <td>${employee.position}</td>
      <td>$${parseInt(employee.salary).toLocaleString()}</td>
      <td>
        <button class="btn-action btn-edit" data-id="${employee.id}">Edit</button>
        <button class="btn-action btn-delete" data-id="${employee.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', (event) => {
      const empId = event.target.getAttribute('data-id');
      deleteEmployee(empId);
    });
  });

  document.querySelectorAll('.btn-edit').forEach((button) => {
    button.addEventListener('click', (event) => {
      const empId = event.target.getAttribute('data-id');
      startEditEmployee(empId);
    });
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

function filterAndRenderEmployees() {
  let filtered = getFilteredEmployees();
  let sorted = getSortedEmployees(filtered);
  renderTable(sorted);
  updateStats();
  updateSortIndicators();
}

function registerEmployee(event) {
  event.preventDefault();

  const name = empNameInput.value.trim();
  const email = empEmailInput.value.trim();
  const department = empDeptSelect.value;
  const position = empPositionInput.value.trim();
  const salary = parseFloat(empSalaryInput.value);

  if (!name || !email || !department || !position || isNaN(salary)) {
    alert('Please fill out all fields correctly!');
    return;
  }

  if (editingId) {
    let emp = employees.find(e => e.id === editingId);
    if (emp) {
      emp.name = name;
      emp.email = email;
      emp.department = department;
      emp.position = position;
      emp.salary = salary;
      if (currentPhotoBase64) {
        emp.photo = currentPhotoBase64;
      }
      alert(`Employee ${name} updated successfully!`);
    }
    editingId = null;
    submitBtn.textContent = 'Submit Record';
  } else {
    const newEmployee = {
      id: `EMP-${employeeIdCounter}`,
      name: name,
      email: email,
      department: department,
      position: position,
      salary: salary,
      photo: currentPhotoBase64
    };

    employees.push(newEmployee);
    employeeIdCounter++;
    alert(`Employee ${name} registered successfully with ID: ${newEmployee.id}`);
  }

  currentPhotoBase64 = '';
  saveDataToLocalStorage();
  filterAndRenderEmployees();
  employeeForm.reset();
}

function deleteEmployee(empId) {
  const confirmDelete = confirm(`Are you sure you want to delete employee record ${empId}?`);
  if (!confirmDelete) return;

  const index = employees.findIndex((emp) => emp.id === empId);

  if (index !== -1) {
    employees.splice(index, 1);
    saveDataToLocalStorage();
    filterAndRenderEmployees();
  }
}

function startEditEmployee(empId) {
  let emp = employees.find(e => e.id === empId);
  if (!emp) return;

  empNameInput.value = emp.name;
  empEmailInput.value = emp.email;
  empDeptSelect.value = emp.department;
  empPositionInput.value = emp.position;
  empSalaryInput.value = emp.salary;
  currentPhotoBase64 = emp.photo || '';

  editingId = empId;
  submitBtn.textContent = 'Update Record';

  document.getElementById('registration').scrollIntoView({ behavior: 'smooth' });
}

empPhotoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentPhotoBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

resetBtn.addEventListener('click', () => {
  editingId = null;
  currentPhotoBase64 = '';
  submitBtn.textContent = 'Submit Record';
});

function initDarkMode() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.body.classList.add('dark-theme');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('darkMode', isDark);
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

document.querySelectorAll('.sortable').forEach((th) => {
  th.addEventListener('click', () => {
    const column = th.getAttribute('data-column');
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
    currentPage = 1;
    filterAndRenderEmployees();
  });
});

function updateSortIndicators() {
  document.querySelectorAll('.sortable').forEach((th) => {
    let existing = th.querySelector('.sort-indicator');
    if (existing) existing.remove();

    if (th.getAttribute('data-column') === sortColumn) {
      let indicator = document.createElement('span');
      indicator.className = 'sort-indicator';
      indicator.textContent = sortDirection === 'asc' ? ' ▲' : ' ▼';
      th.appendChild(indicator);
    }
  });
}

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    filterAndRenderEmployees();
  }
});

nextPageBtn.addEventListener('click', () => {
  let filtered = getFilteredEmployees();
  let totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    filterAndRenderEmployees();
  }
});

exportJsonBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(employees, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employees.json';
  a.click();
  URL.revokeObjectURL(url);
});

exportCsvBtn.addEventListener('click', () => {
  let csv = 'ID,Name,Email,Department,Position,Salary\n';
  employees.forEach((emp) => {
    csv += `"${emp.id}","${emp.name}","${emp.email}","${emp.department}","${emp.position}",${emp.salary}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employees.csv';
  a.click();
  URL.revokeObjectURL(url);
});

importJsonInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        employees = imported;
        let maxId = 1004;
        employees.forEach((emp) => {
          let num = parseInt(emp.id.replace('EMP-', ''));
          if (num >= maxId) maxId = num + 1;
        });
        employeeIdCounter = maxId;
        saveDataToLocalStorage();
        currentPage = 1;
        filterAndRenderEmployees();
        alert('Data imported successfully!');
      } else {
        alert('Invalid JSON format. Expected an array.');
      }
    } catch (err) {
      alert('Error reading JSON file.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
});

employeeForm.addEventListener('submit', registerEmployee);
searchNameInput.addEventListener('input', () => {
  currentPage = 1;
  filterAndRenderEmployees();
});
filterDeptSelect.addEventListener('change', () => {
  currentPage = 1;
  filterAndRenderEmployees();
});

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  loadInitialData();
  filterAndRenderEmployees();
});
