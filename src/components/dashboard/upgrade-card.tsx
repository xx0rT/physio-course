import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Prémium přístup</CardTitle>
        <CardDescription>
          Odemkněte všechny pokročilé kurzy, individuální konzultace a prioritní podporu fyzioterapeutů.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Button size="sm" className="w-full" asChild>
          <Link to="/checkout">
            Upgradovat
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
