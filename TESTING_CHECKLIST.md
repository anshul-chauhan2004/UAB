# Real-Time Synchronization - Testing Checklist

## ✅ Pre-Testing Setup

- [ ] Server is running (`npm run dev`)
- [ ] Browser opened at http://localhost:3000
- [ ] Browser console is open (F12)
- [ ] No existing localStorage data (or clear it: Application > Local Storage > Clear All)

## 🧪 Test Suite 1: Teacher Course Management

### Test 1.1: Teacher Login
- [ ] Navigate to Login page
- [ ] Select "Teacher" role from dropdown
- [ ] Enter credentials and login
- [ ] Verify redirect to Teacher Dashboard
- [ ] Verify header shows "Teacher Dashboard"

### Test 1.2: Teacher Adds Course
- [ ] Click "Add Courses" tab
- [ ] Browse available courses
- [ ] Click "Add Course" on "Introduction to Programming" (CS101)
- [ ] Verify success alert appears
- [ ] Click "My Courses" tab
- [ ] Verify CS101 appears in course list
- [ ] Verify enrollment count shows "0/50 enrolled"

### Test 1.3: Teacher Adds Multiple Courses
- [ ] Go back to "Add Courses" tab
- [ ] Add 2-3 more courses
- [ ] Verify all courses appear in "My Courses"
- [ ] Check "Overview" tab - verify course count updates

### Test 1.4: Teacher Views Student List (Empty)
- [ ] In "My Courses" tab
- [ ] Click "View Students (0)" button on CS101
- [ ] Verify modal opens
- [ ] Verify message "No students enrolled yet"
- [ ] Click X to close modal

## 🧪 Test Suite 2: Student Course Enrollment

### Test 2.1: Student Login (Software Engineering)
- [ ] Logout from teacher account
- [ ] Navigate to Login page
- [ ] Select "Student" role
- [ ] Login with student credentials
- [ ] Verify redirect to Student Dashboard
- [ ] Verify header shows "Student Dashboard"

### Test 2.2: Student Sees Teacher's Courses
- [ ] Click "Browse Courses" tab
- [ ] Verify CS101 (added by teacher) is visible
- [ ] Verify other teacher-added Computer Science courses are visible
- [ ] Verify courses match student's stream (Software Engineering)

### Test 2.3: Student Enrolls in Course
- [ ] Find CS101 in Browse Courses
- [ ] Click "Enroll" button
- [ ] Verify success alert
- [ ] Click "My Courses" tab
- [ ] Verify CS101 appears in enrolled courses
- [ ] Verify enrollment date is shown
- [ ] Verify credits show "4"
- [ ] Verify GPA shows "-"

### Test 2.4: Prevent Duplicate Enrollment
- [ ] Go back to "Browse Courses"
- [ ] Try to enroll in CS101 again
- [ ] Verify error message "Already enrolled"
- [ ] Verify no duplicate entries in "My Courses"

### Test 2.5: Student Enrolls in Multiple Courses
- [ ] Enroll in 2-3 more courses
- [ ] Verify all appear in "My Courses"
- [ ] Check "Overview" tab
- [ ] Verify "Enrolled Courses" count updates

## 🧪 Test Suite 3: Real-Time Synchronization

### Test 3.1: Teacher Sees Updated Enrollment Count
- [ ] Logout from student account
- [ ] Login as teacher (same teacher from Test 1)
- [ ] Navigate to "My Courses" tab
- [ ] Find CS101 course card
- [ ] **Verify enrollment count shows "1/50 enrolled"** ✨
- [ ] Verify count updated in real-time

### Test 3.2: Teacher Views Enrolled Student
- [ ] Click "View Students (1)" button on CS101
- [ ] Verify modal opens
- [ ] **Verify student name appears in table** ✨
- [ ] **Verify student email appears** ✨
- [ ] **Verify enrollment date appears** ✨
- [ ] Close modal

### Test 3.3: Multiple Students Enroll
- [ ] Open incognito/private window
- [ ] Login as different student (Software Engineering stream)
- [ ] Enroll in CS101
- [ ] Return to teacher window
- [ ] Refresh "My Courses" tab
- [ ] **Verify enrollment count shows "2/50"** ✨
- [ ] Click "View Students (2)"
- [ ] **Verify both students appear in list** ✨

### Test 3.4: Overview Statistics Update
- [ ] In teacher dashboard, click "Overview" tab
- [ ] Check "Total Students" stat card
- [ ] **Verify count shows total across all courses** ✨
- [ ] Add more courses and have students enroll
- [ ] Verify count updates accordingly

## 🧪 Test Suite 4: Course Capacity Management

### Test 4.1: Check Capacity Enforcement
- [ ] Find a course with low capacity (e.g., 5 students)
- [ ] Have teacher add this course
- [ ] Have 5 different students enroll
- [ ] Try to enroll 6th student
- [ ] **Verify "Course is full" error message** ✨
- [ ] Verify enrollment doesn't go over capacity

### Test 4.2: Visual Capacity Indicator
- [ ] Login as student
- [ ] Browse courses
- [ ] Find course that's almost full
- [ ] Verify enrollment count shows correctly (e.g., "4/5 enrolled")

## 🧪 Test Suite 5: Stream-Based Filtering

### Test 5.1: Software Engineering Student
- [ ] Login as Software Engineering student
- [ ] Go to "Browse Courses"
- [ ] **Verify sees Computer Science courses** ✨
- [ ] **Verify doesn't see Business courses** ✨
- [ ] **Verify doesn't see Medicine courses** ✨

### Test 5.2: Business Student
- [ ] Login as Business/Finance student
- [ ] Go to "Browse Courses"
- [ ] **Verify sees Business courses** ✨
- [ ] **Verify sees Finance courses** ✨
- [ ] **Verify doesn't see Computer Science courses** ✨

### Test 5.3: Engineering Student
- [ ] Login as Mechanical Engineering student
- [ ] Go to "Browse Courses"
- [ ] **Verify sees Engineering courses** ✨
- [ ] **Verify sees Mechanical courses** ✨
- [ ] **Verify doesn't see Nursing courses** ✨

## 🧪 Test Suite 6: Unenrollment

### Test 6.1: Student Unenrolls
- [ ] Login as student
- [ ] Go to "My Courses"
- [ ] Find a enrolled course
- [ ] Click "Unenroll" button
- [ ] Verify confirmation alert
- [ ] Verify course removed from "My Courses"
- [ ] Verify still appears in "Browse Courses"

### Test 6.2: Enrollment Count Updates After Unenrollment
- [ ] Login as teacher
- [ ] Go to "My Courses"
- [ ] Find the course student just unenrolled from
- [ ] **Verify enrollment count decreased by 1** ✨
- [ ] Click "View Students"
- [ ] **Verify student no longer in list** ✨

## 🧪 Test Suite 7: Course Removal

### Test 7.1: Teacher Removes Course
- [ ] Login as teacher
- [ ] Have a student enroll in a course first
- [ ] Go to "My Courses"
- [ ] Click "Remove" on that course
- [ ] Verify confirmation alert
- [ ] Verify course removed from "My Courses"
- [ ] Verify course still in "Add Courses" catalog

### Test 7.2: Removed Course Affects Students
- [ ] Login as student who was enrolled in removed course
- [ ] Go to "My Courses"
- [ ] **Verify course no longer appears** ✨
- [ ] Go to "Browse Courses"
- [ ] **Verify course no longer available** ✨

### Test 7.3: Teacher Can Re-add Removed Course
- [ ] Login as teacher
- [ ] Go to "Add Courses"
- [ ] Find the previously removed course
- [ ] Click "Add Course"
- [ ] Verify success
- [ ] Verify course back in "My Courses"
- [ ] Verify enrollment count reset to 0

## 🧪 Test Suite 8: UI/UX Features

### Test 8.1: Search and Filter (Teacher)
- [ ] Login as teacher
- [ ] Go to "Add Courses" tab
- [ ] Type "Computer" in search box
- [ ] Verify only Computer Science courses show
- [ ] Select "Engineering" from department filter
- [ ] Verify only Engineering courses show
- [ ] Clear filters and verify all courses show

### Test 8.2: Responsive Design
- [ ] Resize browser window to mobile size (< 768px)
- [ ] Verify tabs become scrollable horizontally
- [ ] Verify course cards stack vertically
- [ ] Verify modal is still usable
- [ ] Verify stats grid shows 2 columns instead of 4

### Test 8.3: Modal Interactions
- [ ] Login as teacher with enrolled students
- [ ] Click "View Students" button
- [ ] Try clicking outside modal
- [ ] **Verify modal closes** ✨
- [ ] Reopen modal
- [ ] Click X button
- [ ] **Verify modal closes** ✨
- [ ] Verify backdrop fades smoothly

### Test 8.4: Loading States
- [ ] Login to any dashboard
- [ ] Observe loading spinner
- [ ] Verify spinner disappears when data loaded
- [ ] Verify smooth transition to content

## 🧪 Test Suite 9: Edge Cases

### Test 9.1: No Courses Added by Teacher
- [ ] Login as teacher (new account)
- [ ] Verify "My Courses" shows empty state
- [ ] Verify message "You haven't added any courses yet"
- [ ] Verify "Add Your First Course" button works

### Test 9.2: Student with No Matching Courses
- [ ] Have teacher add only Business courses
- [ ] Login as Computer Science student
- [ ] Go to "Browse Courses"
- [ ] Verify appropriate message or empty state

### Test 9.3: Student Not Enrolled in Any Course
- [ ] Login as new student
- [ ] Go to "My Courses"
- [ ] Verify empty state or message
- [ ] Verify "Browse Courses" button works

### Test 9.4: Special Characters in Names
- [ ] Register student with name containing special characters
- [ ] Enroll in a course
- [ ] Login as teacher
- [ ] View enrolled students
- [ ] Verify special characters display correctly

## 🧪 Test Suite 10: Data Persistence

### Test 10.1: Refresh Page
- [ ] Login as teacher
- [ ] Add courses
- [ ] Refresh page (F5)
- [ ] **Verify courses still appear** ✨
- [ ] Verify enrollment counts preserved

### Test 10.2: Browser Close and Reopen
- [ ] Login and perform some actions
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to app
- [ ] Login again
- [ ] **Verify all data persisted** ✨

### Test 10.3: Multiple Browser Tabs
- [ ] Open app in two tabs
- [ ] Login as teacher in Tab 1
- [ ] Login as student in Tab 2
- [ ] Add course in Tab 1
- [ ] Refresh Tab 2
- [ ] **Verify course appears in Tab 2** ✨

## 📊 Test Results Summary

### Pass/Fail Count
- Total Tests: ____
- Passed: ____
- Failed: ____
- Skipped: ____

### Critical Issues Found
1. _______________________________
2. _______________________________
3. _______________________________

### Minor Issues Found
1. _______________________________
2. _______________________________
3. _______________________________

### Observations
_______________________________
_______________________________
_______________________________

### Recommendations
_______________________________
_______________________________
_______________________________

---

## 🎯 Quick Smoke Test (5 minutes)

If you're short on time, run this abbreviated test:

1. **Teacher adds course** (1 min)
   - Login as teacher
   - Add CS101 course
   - Verify appears in My Courses with 0 enrollments

2. **Student enrolls** (2 min)
   - Login as Software Engineering student
   - Find CS101 in Browse Courses
   - Enroll
   - Verify appears in My Courses

3. **Teacher sees enrollment** (2 min)
   - Login as teacher
   - Check CS101 enrollment count = 1
   - Click "View Students"
   - Verify student appears in list

✅ If all 3 steps pass, core functionality is working!

---

**Testing Date**: _____________
**Tester Name**: _____________
**Browser**: _____________
**OS**: _____________
**Test Environment**: Development / Staging / Production
