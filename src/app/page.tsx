import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Users, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Student Learning Portal</h1>
          <p className="text-muted-foreground text-lg">Access your courses, watch lectures, and submit assignments</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image src={course.image || "https://placehold.co/600x400"} alt={course.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{course.instructor}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground">{course.description}</p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Video className="mr-1 h-3.5 w-3.5" />
                    {course.videoCount} videos
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BookOpen className="mr-1 h-3.5 w-3.5" />
                    {course.assignmentCount} assignments
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="mr-1 h-3.5 w-3.5" />
                    {course.studentCount} students
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button className="w-full" asChild>
                  <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const courses = [
  {
    id: "cs101",
    title: "CS101: Introduction to Computer Science",
    description: "Learn the fundamentals of computer science, including algorithms, data structures, and programming basics.",
    instructor: "Dr. Alan Turing",
    status: "Active",
    videoCount: 24,
    assignmentCount: 8,
    studentCount: 156,
    image: "https://placehold.co/600x400",
  },
  {
    id: "math202",
    title: "MATH202: Linear Algebra",
    description: "Study vector spaces, linear transformations, matrices, and their applications in solving systems of linear equations.",
    instructor: "Dr. Katherine Johnson",
    status: "Active",
    videoCount: 18,
    assignmentCount: 6,
    studentCount: 124,
    image: "https://placehold.co/600x400",
  },
  {
    id: "eng305",
    title: "ENG305: Technical Writing",
    description: "Develop skills in writing clear, concise, and effective technical documents for various professional contexts.",
    instructor: "Prof. Jane Smith",
    status: "Active",
    videoCount: 12,
    assignmentCount: 10,
    studentCount: 89,
    image: "https://placehold.co/600x400",
  },
  {
    id: "bio220",
    title: "BIO220: Molecular Biology",
    description: "Explore the molecular basis of biological activity, including DNA structure, replication, and protein synthesis.",
    instructor: "Dr. Rosalind Franklin",
    status: "Active",
    videoCount: 22,
    assignmentCount: 7,
    studentCount: 112,
    image: "https://placehold.co/600x400",
  },
  {
    id: "hist101",
    title: "HIST101: World History",
    description: "Survey major events and developments in world history from ancient civilizations to the modern era.",
    instructor: "Prof. Howard Zinn",
    status: "Upcoming",
    videoCount: 20,
    assignmentCount: 5,
    studentCount: 78,
    image: "https://placehold.co/600x400",
  },
  {
    id: "phys301",
    title: "PHYS301: Quantum Mechanics",
    description: "Study the fundamental theory of nature at the small scale where classical physics does not apply.",
    instructor: "Dr. Richard Feynman",
    status: "Upcoming",
    videoCount: 16,
    assignmentCount: 8,
    studentCount: 64,
    image: "https://placehold.co/600x400",
  },
];
