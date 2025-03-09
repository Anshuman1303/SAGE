import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, FileText, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">View and submit your course assignments</p>
          </div>
          <Button asChild>
            <Link href="/assignments/new">
              <Upload className="mr-2 h-4 w-4" />
              New Submission
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{assignment.title}</CardTitle>
                  <Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Due {assignment.dueDate}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {assignment.timeEstimate}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/assignments/${assignment.id}`}>
                    <FileText className="mr-2 h-3 w-3" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Pending":
      return "secondary";
    case "Submitted":
      return "default";
    case "Late":
      return "destructive";
    case "Graded":
      return "outline";
    default:
      return "secondary";
  }
}

const assignments = [
  {
    id: "1",
    title: "Research Paper",
    description: "Submit a 5-page research paper on a topic of your choice related to the course material.",
    dueDate: "March 15, 2025",
    timeEstimate: "4-6 hours",
    status: "Pending",
  },
  {
    id: "2",
    title: "Data Analysis Project",
    description: "Analyze the provided dataset and submit your findings with visualizations.",
    dueDate: "March 20, 2025",
    timeEstimate: "3-5 hours",
    status: "Submitted",
  },
  {
    id: "3",
    title: "Group Presentation",
    description: "Prepare a 10-minute presentation with your assigned group on the given topic.",
    dueDate: "March 10, 2025",
    timeEstimate: "5-7 hours",
    status: "Late",
  },
  {
    id: "4",
    title: "Weekly Quiz",
    description: "Complete the online quiz covering material from weeks 5-6.",
    dueDate: "March 5, 2025",
    timeEstimate: "30-45 minutes",
    status: "Graded",
  },
  {
    id: "5",
    title: "Programming Assignment",
    description: "Implement the algorithms discussed in class and submit your code with documentation.",
    dueDate: "March 25, 2025",
    timeEstimate: "6-8 hours",
    status: "Pending",
  },
  {
    id: "6",
    title: "Literature Review",
    description: "Review and summarize 3 academic papers related to the course topics.",
    dueDate: "April 1, 2025",
    timeEstimate: "4-5 hours",
    status: "Pending",
  },
];
