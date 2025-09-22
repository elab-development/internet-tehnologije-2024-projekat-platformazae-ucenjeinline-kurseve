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

const AdminUsers = ({ allUsers }) => {
  return (
    <Card>
      <CardHeader className='flex justify-between flex-row items-center'>
        <CardTitle className='text-3xl font-extrabold'>All Users</CardTitle>
        <Button
          onClick={() => {
            exportToExcel(allUsers, 'users');
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers && allUsers.length > 0
                ? allUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className='font-medium'>
                        {user?.userName}
                      </TableCell>
                      <TableCell> {user?.userEmail}</TableCell>
                      <TableCell>
                        {user?.role === 'user' ? 'student' : user?.role}
                      </TableCell>
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

export default AdminUsers;
