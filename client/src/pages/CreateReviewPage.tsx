import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/star-rating.tsx";
import { ArrowLeft, Package } from "lucide-react";
import { NavLink } from "react-router";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock item data - in real app this would come from URL params or API
  const item = {
    id: 1,
    title: "Vintage Rolex Submariner 1960s",
    image: "/vintage-rolex-watch.jpg",
    purchasePrice: 12500,
    seller: "John Smith",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("[v0] Review submitted:", { rating, comment, itemId: item.id });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="container py-12">
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="pt-12 pb-12 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <Package className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Thank You for Your Review!
                  </h1>
                  <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Your feedback helps our community make informed decisions
                    and improves the marketplace for everyone.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button asChild>
                    <NavLink to="/dashboard">Go to Dashboard</NavLink>
                  </Button>
                  <Button variant="outline" asChild>
                    <NavLink to="/browse">Browse More Items</NavLink>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <Button variant="ghost" asChild className="mb-4">
              <NavLink to="/deliveries">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Deliveries
              </NavLink>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Leave a Review
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your experience with this item
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Item Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-24 w-24 object-cover rounded-lg border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Seller: {item.seller}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Purchase Price: ${item.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
                <CardDescription>
                  Help others by sharing your honest feedback about this item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div className="space-y-3">
                    <Label className="text-base">
                      Rating <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        size="lg"
                      />
                      {rating > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click on the stars to rate your experience
                    </p>
                  </div>

                  {/* Optional Comment */}
                  <div className="space-y-3">
                    <Label htmlFor="comment" className="text-base">
                      Comment{" "}
                      <span className="text-muted-foreground text-sm">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="Tell us more about your experience with this item..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      Share details about the item condition, shipping, or
                      overall satisfaction
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button type="button" variant="outline" size="lg" asChild>
                      <NavLink to="/dashboard">Cancel</NavLink>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1 leading-relaxed">
                  <li>Be honest and objective in your review</li>
                  <li>
                    Focus on the item quality, accuracy of description, and
                    seller communication
                  </li>
                  <li>Avoid including personal information in your comments</li>
                  <li>Keep your review respectful and constructive</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
