/* eslint-disable @next/next/no-img-element */
"use client";
import Container from "~/_components/Container";
import * as React from "react";
import { Calendar } from "~/components/ui/calendar";
import { Text } from "~/_components/Text";
import { format } from "date-fns";
import Box from "~/_components/Box";
import { FiDownload } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import { PiLineVerticalBold } from "react-icons/pi";
import BoxGrid from "~/_components/BoxGrid";
import { PiLineVertical } from "react-icons/pi";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useGetAllStudents } from "~/APIs/hooks/useGrades";
import { useGetAllAttendances, useGetAllAttendancesSumm, useGetAllHomeWorks, useGetAllMaterials, useGetAllSchedule } from "~/APIs/hooks/useHomeWork";
import Spinner from "~/_components/Spinner";

function CalendarDemo({
  onDateSelect,
}: {
  onDateSelect: (date: Date) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateSelect(newDate);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="flex w-fit justify-center rounded-md max-[1080px]:w-full"
    />
  );
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);
  const { data: students, isLoading: isStudents } = useGetAllStudents();
  
  const formattedDate = React.useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );

  // Get homeworks based on selected student and date
  const { data: homeworks, isLoading: isHomeworksLoading } = useGetAllHomeWorks(
    selectedStudent,
    formattedDate
  );
  const { data: materials, isLoading: isMaterials } = useGetAllMaterials(
    selectedStudent,
    formattedDate
  );
  const { data: attendance, isLoading: isAttendee } = useGetAllAttendances(
    selectedStudent,
    formattedDate
  );
  const { data: attendanceSumm, isLoading: isAttendeeSumm } = useGetAllAttendancesSumm(
    selectedStudent
  );
  
  const { data: schedule, isLoading: isSchedule } = useGetAllSchedule(
    selectedStudent,
    formattedDate
  );
  
  // Set first student as default when students data is loaded
  useEffect(() => {
    if (students?.data?.length && !selectedStudent) {
      setSelectedStudent(students.data[0].studentId.toString());
    }
  }, [students?.data, selectedStudent]);

  function convertToAmPm(time24: string): string {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    const match = timeRegex.exec(time24);

    if (!match) {
      throw new Error(
        "Invalid time format. Please use HH:MM:SS in 24-hour format.",
      );
    }

    const [hoursStr, minutes] = match;
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const formatTime = (startTime: string, endTime: string): string => {
    const formatHour = (time: string): string => {
      const [hours] = time.split(':');
      const hour = parseInt(hours || '0');
      const period = hour >= 12 ? 'pm' : 'am';
      const formattedHour = hour > 12 ? hour - 12 : hour;
      return `${formattedHour}:00 ${period}`;
    };

    return `${formatHour(startTime)}-${formatHour(endTime)}`;
  };


  const formatTime1 = (time: any) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${String(formattedHour).padStart(2, '0')}:${minutes} ${period}`;
  };

  const getStatusColor = (status: any) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'bg-success text-white';
      case 'ABSENT':
        return 'bg-red-500 text-white';
      case 'LATE':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLineColor = (status: any) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'text-success';
      case 'ABSENT':
        return 'text-red-500';
      case 'LATE':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Container>
      <div className="flex w-full mb-5">
        <Select 
          value={selectedStudent ?? ""} 
          onValueChange={setSelectedStudent}
        >
          <SelectTrigger className="w-[250px] border bg-white border-[#f0efef]">
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          {students?.data?.length && (
            <SelectContent>
              {students?.data?.map((student:any) => (
                <SelectItem key={student.studentId} value={student.studentId.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      </div>
      <div className="mb-4 flex w-full gap-10 max-[1080px]:grid">
        <div className="flex overflow-auto md:overflow-visible">
          <CalendarDemo onDateSelect={handleDateSelect} />
        </div>

        <Box className="overflow-auto">
          <div className="flex justify-between">
            <Text font={"semiBold"} size={"xl"} className="mb-3">
              Today Classes
            </Text>
            
          </div>

          <table className="w-full border-separate border-spacing-y-2 overflow-x-auto p-4 text-left text-sm">
      <thead className="text-xs uppercase text-textPrimary">
        <tr>
          <th scope="col" className="whitespace-nowrap px-6 py-3">
            Subject
          </th>
          <th scope="col" className="whitespace-nowrap px-6 py-3">
            Teacher
          </th>
          <th scope="col" className="whitespace-nowrap px-6 py-3">
            Time
          </th>
          <th scope="col" className="whitespace-nowrap px-6 py-3">
            Day
          </th>
        </tr>
      </thead>
      <tbody className="rounded-lg">
        {schedule?.data?.map((item: { id: React.Key | null | undefined; day: string; courseName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; teacherName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; startTime: any; endTime: any; }) => (
          <tr 
            key={item.id}
            className="bg-bgSecondary font-semibold transition hover:bg-primary hover:text-white"
          >
            <th
              scope="row"
              className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium"
            >
              {item.courseName}
            </th>
            <td className="whitespace-nowrap px-6 py-4">
              {item.teacherName}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              {formatTime(item.startTime, item.endTime)}
            </td>
            <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">
              {item.day}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
          
        </Box>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/5 xl:w-1/3 rounded-xl bg-bgPrimary p-4 shadow h-fit">
          <Text font={"bold"} size={"xl"}>
            Today&apos;s Attendance
          </Text>

          {isMaterials && ( <Spinner/> )}
          {
            attendance?.data?.content?.map((attendance: any, idx: number)=>(
              <div key={idx} className="mt-4 flex items-center justify-between rounded-xl border border-borderPrimary p-4">
      <div className="flex">
        <div>
          <Text font="semiBold" className="mt-1">
            {formatTime1(attendance.startTime)}
          </Text>
          <Text font="semiBold" color="gray" className="mt-1">
            {formatTime1(attendance.endTime)}
          </Text>
        </div>
        <PiLineVerticalBold 
          size={60} 
          className={getLineColor(attendance.status)}
        />
        <div>
          <Text font="semiBold" className="mt-1">
            {attendance.courseName}
          </Text>
        </div>
      </div>
      <div className={`flex h-fit items-center justify-center rounded-full px-4 py-2 ${getStatusColor(attendance.status)}`}>
        {attendance.status?.charAt(0)?.toUpperCase() + 
          attendance.status?.slice(1)?.toLowerCase()}
      </div>
    </div>
            ))
          }
          <Text font={"bold"} size={"lg"} className="mt-4">
            Attendance Summary
          </Text>
          <Text font={"semiBold"} color={"gray"} className="mb-4">
            Last 30 Days
          </Text>
          <BoxGrid>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Total Classes
              </Text>
              <Text font={"semiBold"}>{attendanceSumm?.data?.numberOfAttendances}</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Presence
              </Text>
              <Text font={"semiBold"}>{attendanceSumm?.data?.numberOfPresentAttendances}</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Absence
              </Text>
              <Text font={"semiBold"}>{attendanceSumm?.data?.numberOfAbsentAttendances}</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Late
              </Text>
              <Text font={"semiBold"}>{attendanceSumm?.data?.numberOfLateAttendances}</Text>
            </Box>
          </BoxGrid>
        </div>
        <div className="grid w-full h-full gap-10">
        <div className="w-full rounded-xl bg-bgPrimary p-4 shadow h-fit" >
          <Text font={"bold"} size={"xl"} className="mb-8">
            Today&apos;s Materials
          </Text>
          <div>
            {isMaterials ? (
            <Spinner/>
          ) : materials?.data?.content?.length ? (
            materials.data?.content?.map((material: any, index: number) => (
              <div key={index} className="mt-4">
                <Text size={"xl"} className="mb-2">
                  Science
                </Text>
                <div className="flex rounded-xl border border-borderPrimary p-2">
                  <PiLineVertical size={125} className="-ml-12 text-primary" />
                  <div className="-ml-10 mt-2 w-[90%]">
                    <Text size={"xl"}>{material.courseName}</Text>
                    <Text size={"md"}>{material.startTime}</Text>
                    <Text size={"md"}>{material.endTime}</Text>

                  </div>
                </div>
              </div>
              ))
            ) : (
                <Text>No materials assigned for this date</Text>
            )}
          </div>
        </div>

             <div className="w-full rounded-xl bg-bgPrimary p-4 shadow h-fit">
        <Text font={"bold"} size={"xl"} className="mb-8">
          Today&apos;s Homework
        </Text>
        <div>
          {isHomeworksLoading ? (
            <Spinner/>
          ) : homeworks?.data?.content?.length ? (
            homeworks.data?.content?.map((homework: any, index: number) => (
              <div key={homework.id} className={index > 0 ? "mt-4" : ""}>
                <div className="flex rounded-xl border border-borderPrimary p-2">
                  <PiLineVertical size={125} className="-ml-12 text-primary" />
                  <div className="-ml-10 mt-2 w-[90%]">
                    <Text size={"xl"} font={"medium"}>{homework.title}</Text>
                    <Text size={"lg"} >{homework.courseName}</Text>
                    <Text font={"semiBold"} color={homework.done ? "success" : "error"}>
                      Deadline: {format(new Date(homework.deadline), "dd MMM (EEEE)")}
                    </Text>
                    <Text color={"gray"} className="my-1">
                      {homework.description}
                    </Text>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Text>No homework assigned for this date</Text>
          )}
        </div>
        
        </div>
      </div>
      </div>
    </Container>
  );
};

export default Schedule;
