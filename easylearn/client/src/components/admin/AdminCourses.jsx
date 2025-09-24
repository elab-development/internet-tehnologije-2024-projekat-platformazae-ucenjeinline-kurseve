/* eslint-disable react/prop-types */
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { exportToExcel } from '../../utils/xlsxExport';

const AdminCourses = ({ allCourses }) => {
  return (
    <Card>
      <CardHeader className='flex justify-between flex-row items-center'>
        <CardTitle className='text-3xl font-extrabold'>All Courses</CardTitle>
        <Button
          onClick={() => {
            exportToExcel(allCourses, 'courses');
          }}
          variant='ghost'
          className='bg-green-800 text-white'
        >
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>#Students</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCourses && allCourses.length > 0
                ? allCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className='font-medium'>
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.instructorName}</TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>${course?.pricing}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourses;
