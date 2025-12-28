import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionsListFixed() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Enrollments</CardTitle>
          <CardDescription className="text-balance">
            Latest course enrollments and purchases.
          </CardDescription>
        </div>
        <Button size="sm" className="ml-auto shrink-0 gap-1 px-4" asChild>
          <Link to="/dashboard/my-learning" className="flex items-center gap-2">
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">React Advanced Patterns</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Advanced Development
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Premium</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-12-23
              </TableCell>
              <TableCell className="text-right">$89.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">TypeScript Masterclass</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Programming Fundamentals
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Standard</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  In Progress
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-12-24
              </TableCell>
              <TableCell className="text-right">$59.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Full Stack Development</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Web Development
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                Premium
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  Enrolled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-12-25
              </TableCell>
              <TableCell className="text-right">$129.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">UI/UX Design Principles</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Design & Creative
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Standard</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-12-26
              </TableCell>
              <TableCell className="text-right">$75.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Python for Data Science</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Data & Analytics
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Premium</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  In Progress
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-12-27
              </TableCell>
              <TableCell className="text-right">$99.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
