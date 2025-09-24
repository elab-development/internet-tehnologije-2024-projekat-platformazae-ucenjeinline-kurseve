import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUpDownIcon, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

import { filterOptions, sortOptions } from '../../config';
import { useStudentContext } from '../../context/StudentContext';
import {
  fetchAllCoursesService,
  fetchCoursesFilteredService,
} from '../../api/courses/courseService';

const ExploreCourses = () => {
  const [sort, setSort] = useState('price-lowtohigh');
  const [filters, setFilters] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { studentCoursesList, setStudentCoursesList, loading, setLoading } =
    useStudentContext();

  useEffect(() => {
    const fetchCourses = async () => {
      let res;
      setLoading(true);
      if (filters !== null || sort !== null) {
        const query = new URLSearchParams({
          ...filters,
          sortBy: sort,
        });
        res = await fetchCoursesFilteredService(query);
      } else {
        res = await fetchAllCoursesService();
      }
      if (res?.success) {
        setStudentCoursesList(res?.data);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [setStudentCoursesList, filters, sort, searchParams, setLoading]);

  const handleFilterOnChange = (sectionId, option) => {
    let filtersCopy = { ...filters };
    const indexOfCurrenctSection = Object.keys(filtersCopy).indexOf(sectionId);
    if (indexOfCurrenctSection === -1) {
      // first time implementing the filter
      filtersCopy = {
        ...filtersCopy,
        [sectionId]: [option.id],
      };
    } else {
      // filter already implemented
      const indexOfCurrentOption = filtersCopy[sectionId].indexOf(option.id);

      if (indexOfCurrentOption === -1) {
        // adding new filter
        filtersCopy[sectionId].push(option.id);
      } else {
        // removing filter
        filtersCopy[sectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(filtersCopy);
    sessionStorage.setItem('filters', JSON.stringify(filtersCopy));
  };

  const createSearchParams = (filterParams) => {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(',');
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    return queryParams.join('&');
  };

  useEffect(() => {
    const queryStringForFilters = createSearchParams(filters);
    setSearchParams(new URLSearchParams(queryStringForFilters));
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, []);

  function createArray(N) {
    return [...Array(N).keys()].map((i) => i + 1);
  }

  useEffect(() => {
    setTotalPages(Math.ceil(studentCoursesList?.length / 4));
    setCurrentPage(1);
  }, [studentCoursesList]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-row mb-4 text-sm gap-2 items-center'>
        <Link to='/home'>Home</Link>
        <ChevronRight className='w-3 h-3' />
        <Link to='/explore'>Explore</Link>
      </div>
      <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
      <div className='flex flex-col md:flex-row gap-4'>
        <aside className='w-full md:w-64 space-y-4'>
          <div className='space-y-4'>
            {Object.keys(filterOptions).map((item, index) => (
              <div key={index} className='p-4 space-y-4'>
                <h3 className='font-bold mb-3'>{item.toUpperCase()}</h3>
                <div className='grid gap-2 mt-2'>
                  {filterOptions[item].map((option, index) => (
                    <Label
                      key={index}
                      className='flex font-medium items-center gap-3'
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[item] &&
                          filters[item].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(item, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className='flex-1'>
          <div className='flex justify-end items-center mb-4 gap-5'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2 p-4'
                >
                  <ArrowUpDownIcon className='h-4 w-4' />
                  <span className='text-[14px] font-medium'>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[180px]'>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      className='cursor-pointer'
                      value={option.id}
                      key={option.id}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {totalPages > 0 && (
              <div className='flex flex-row gap-1'>
                {createArray(totalPages).map((x) => (
                  <div
                    key={x}
                    onClick={() => setCurrentPage(x)}
                    className={`flex items-center justify-center cursor-pointer w-8 h-8 text-sm font-semibold border rounded-lg
                      ${
                        currentPage === x
                          ? 'text-white bg-black border-none'
                          : 'text-black bg-transparent'
                      }
                    `}
                  >
                    {x}
                  </div>
                ))}
              </div>
            )}
            <span className='text-sm font-bold text-gray-600'>
              {studentCoursesList?.length}{' '}
              {studentCoursesList?.length === 1 ? 'result' : 'results'}
            </span>
          </div>
          <div className='space-y-4'>
            {loading && <Skeleton />}
            {studentCoursesList && studentCoursesList.length > 0 ? (
              studentCoursesList
                .slice(currentPage * 4 - 4, currentPage * 4)
                .map((course) => (
                  <Card
                    className='cursor-pointer bg-slate-100 hover:bg-opacity-75'
                    key={course?._id}
                    onClick={() => {
                      navigate(`/courses/${course?._id}`);
                    }}
                  >
                    <CardContent className='flex gap-4 p-4'>
                      <div className='w-60 h-32 flex-shrink-0'>
                        <img
                          src={course?.image}
                          className='w-full h-full object-cover rounded-lg'
                        />
                      </div>
                      <div className='flex-1'>
                        <CardTitle className='text-xl mb-2 line-clamp-1'>
                          {course?.title}
                        </CardTitle>
                        <p className='text-sm text-gray-600 mb-1 font-medium'>
                          Created by{' '}
                          <span className='font-bold'>
                            {course?.instructorName}
                          </span>
                        </p>
                        <p className='text-[16px] text-gray-600 mb-2 font-thin line-clamp-1'>
                          <span className='font-semibold'>
                            {course?.curriculum?.length}
                          </span>{' '}
                          Lectures -{' '}
                          <span className='font-semibold'>
                            {course?.level?.toUpperCase()}
                          </span>{' '}
                          Level
                        </p>
                        <p className='font-bold text-sm'>${course?.pricing}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <h3 className='font-extrabold text-4xl'>No Courses Found</h3>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExploreCourses;
