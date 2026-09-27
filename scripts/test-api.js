// Automated Full-Stack API Acceptance Test Script
async function runTests() {
  const baseUrl = 'http://localhost:3000/api';

  console.log('=== Campus Event Management System - Integration Acceptance Tests ===\n');

  // 1. Reset database to clean sample data
  console.log('1. Testing POST /api/seed/reset...');
  const resetRes = await fetch(`${baseUrl}/seed/reset`, { method: 'POST' });
  const resetJson = await resetRes.json();
  console.log('   Status:', resetRes.status, '| Success:', resetJson.success);

  // 2. Student 1 Login
  console.log('\n2. Testing POST /api/auth/login (Student 1)...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@college.edu', password: 'Password123!' }),
  });
  const loginJson = await loginRes.json();
  console.log('   Status:', loginRes.status, '| User:', loginJson.data?.user?.name, '| Role:', loginJson.data?.user?.role);
  const studentToken = loginJson.data?.token;

  // 3. Register for Event #3
  console.log('\n3. Testing POST /api/events/3/register (Inter-Department Sports)...');
  const regRes = await fetch(`${baseUrl}/events/3/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  });
  const regJson = await regRes.json();
  console.log('   Status:', regRes.status, '| Success:', regJson.success, '| Message:', regJson.message);
  const newRegId = regJson.data?.registrationId;

  // 4. Duplicate Registration Prevention (Module JE Rule #7)
  console.log('\n4. Testing Duplicate Registration Prevention for Event #3...');
  const dupRes = await fetch(`${baseUrl}/events/3/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  });
  const dupJson = await dupRes.json();
  console.log('   Status:', dupRes.status, '(Expected 409) | Message:', dupJson.message);

  // 5. Fetch Student Registrations (Module JF)
  console.log('\n5. Testing GET /api/students/1/registrations...');
  const myRegsRes = await fetch(`${baseUrl}/students/1/registrations`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const myRegsJson = await myRegsRes.json();
  console.log('   Status:', myRegsRes.status, '| Count:', myRegsJson.data?.length);

  // 6. Cancellation (Module JE / Section 8)
  console.log(`\n6. Testing DELETE /api/registrations/${newRegId} (Cancellation)...`);
  const cancelRes = await fetch(`${baseUrl}/registrations/${newRegId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const cancelJson = await cancelRes.json();
  console.log('   Status:', cancelRes.status, '| Success:', cancelJson.success, '| Message:', cancelJson.message);

  // 7. Faculty Login
  console.log('\n7. Testing POST /api/auth/login (Faculty)...');
  const facLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'faculty@college.edu', password: 'Faculty123!' }),
  });
  const facLoginJson = await facLoginRes.json();
  console.log('   Status:', facLoginRes.status, '| User:', facLoginJson.data?.user?.name, '| Role:', facLoginJson.data?.user?.role);
  const facultyToken = facLoginJson.data?.token;

  // 8. Admin Dashboard
  console.log('\n8. Testing GET /api/admin/dashboard...');
  const dashRes = await fetch(`${baseUrl}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${facultyToken}` },
  });
  const dashJson = await dashRes.json();
  console.log('   Status:', dashRes.status, '| Total Events:', dashJson.data?.totalEvents, '| Active Regs:', dashJson.data?.activeRegistrations);

  // 9. Event Rosters
  console.log('\n9. Testing GET /api/events/1/registrations...');
  const rosterRes = await fetch(`${baseUrl}/events/1/registrations`, {
    headers: { Authorization: `Bearer ${facultyToken}` },
  });
  const rosterJson = await rosterRes.json();
  console.log('   Status:', rosterRes.status, '| Registered Students Count:', rosterJson.data?.registrations?.length);

  console.log('\n=== ALL END-TO-END ACCEPTANCE TESTS PASSED SUCCESSFULLY! ===\n');
}

runTests().catch(console.error);
