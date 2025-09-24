/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';
import { DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const InstructorDashboardView = ({ listOfCourses }) => {
  const [studentsData, setStudentsData] = useState({});
  const [revenueData, setRevenueData] = useState({});

  const calculateTotalStudentsAndProfit = () => {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += studentCount * course.pricing;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentId: student.studentId,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalStudents,
      totalProfit,
      studentList,
    };
  };

  useEffect(() => {
    if (listOfCourses) {
      let studentsDataCopy = listOfCourses.map((course, index) => ({
        name: course.title,
        value: course.students.length,
        fill: colors[index % colors.length],
      }));
      setStudentsData(studentsDataCopy);

      let revenueDataCopy = listOfCourses.map((course, index) => ({
        name: course.title,
        value: course.students.length * course.pricing,
        fill: colors[index % colors.length],
      }));
      setRevenueData(revenueDataCopy);
    }
  }, [listOfCourses]);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Students
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {calculateTotalStudentsAndProfit().totalStudents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {calculateTotalStudentsAndProfit().totalProfit}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table className='w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTotalStudentsAndProfit().studentList?.map(
                  (student, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-semibold'>
                        {student.courseTitle}
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {student.studentName}
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {student.studentEmail}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className='flex flex-wrap my-8 gap-8'>
        <Card className='w-[300px] h-[300px]'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Students by Course
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <PieChart width={250} height={250} className='w-full h-full'>
              <Pie
                data={studentsData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
              />
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
        <Card className='w-[300px] h-[300px]'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Revenue by Course
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <PieChart width={250} height={250} className='w-full h-full'>
              <Pie
                data={revenueData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
              />
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboardView;
