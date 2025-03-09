"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function NewSubmission() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate back to assignments after "submission"
          setTimeout(() => {
            router.push("/");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">New Submission</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Submit Assignment</CardTitle>
              <CardDescription>Complete the form below to submit your assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select required>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101: Introduction to Computer Science</SelectItem>
                    <SelectItem value="math202">MATH202: Linear Algebra</SelectItem>
                    <SelectItem value="eng305">ENG305: Technical Writing</SelectItem>
                    <SelectItem value="bio220">BIO220: Molecular Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment</Label>
                <Select required>
                  <SelectTrigger id="assignment">
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Research Paper</SelectItem>
                    <SelectItem value="2">Data Analysis Project</SelectItem>
                    <SelectItem value="3">Group Presentation</SelectItem>
                    <SelectItem value="5">Programming Assignment</SelectItem>
                    <SelectItem value="6">Literature Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Submission Title</Label>
                <Input id="title" placeholder="Enter a title for your submission" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea id="comments" placeholder="Add any comments or notes for your instructor" rows={4} />
              </div>

              <div className="space-y-2">
                <Label>Files</Label>
                <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Drag and drop your files here, or click to browse</p>
                  <p className="mt-1 text-xs text-muted-foreground">Supports PDF, DOCX, ZIP (max 20MB)</p>
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    Select Files
                  </Button>
                </div>
              </div>

              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading submission...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
