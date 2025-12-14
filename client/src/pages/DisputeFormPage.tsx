import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router";
import * as z from "zod";
import { deliveryApi } from "@/api/delivery";
import { chargebackApi } from "@/api/chargeback";
import type { Delivery } from "@/types/delivery";

const disputeSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide at least 10 characters explaining the issue")
    .max(1000, "Reason cannot exceed 1000 characters")
    .trim(),
});

export default function DisputePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDelivery = async () => {
      if (!id) return;

      try {
        const data = await deliveryApi.getDeliveryById(parseInt(id));
        setDelivery(data);
      } catch (err) {
        console.error("Failed to load delivery:", err);
        setError("Failed to load delivery details");
      } finally {
        setIsLoading(false);
      }
    };

    loadDelivery();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationResult = disputeSchema.safeParse({
      reason: reason,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Validation failed";
      setError(errorMessage);
      return;
    }

    if (!id) {
      setError("Delivery ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      await chargebackApi.createChargebackRequest({
        reason: validationResult.data.reason,
        delivery: parseInt(id),
      });
      setSuccessMessage(
        "Your dispute has been submitted successfully. Our team will review it shortly.",
      );
      setReason("");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/deliveries/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit dispute:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit dispute. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delivery...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Delivery not found</h1>
            <Button asChild>
              <NavLink to="/deliveries">Back to Deliveries</NavLink>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="gap-2">
            <NavLink to={`/deliveries/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Item
            </NavLink>
          </Button>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Report an Issue</h1>
              <p className="text-muted-foreground">
                If you believe you were scammed or the item doesn't match the
                description, please let us know.
              </p>
            </div>

            {/* Item Card */}
            <Card className="border-border bg-card/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Item</p>
                <h2 className="text-xl font-semibold">{delivery.item.name}</h2>
              </CardContent>
            </Card>

            {/* Dispute Form */}
            <Card className="border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  {successMessage && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-400">{successMessage}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label htmlFor="reason" className="text-sm font-semibold">
                      Explain why you believe you were scammed
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please provide detailed information about the issue. Include what was promised, what you received, and any relevant details..."
                      className="w-full h-48 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {reason.length} / 1000
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild variant="outline" disabled={isSubmitting}>
                      <NavLink to={`/deliveries/${id}`}>Cancel</NavLink>
                    </Button>
                    <Button
                      type="submit"
                      disabled={!reason.trim() || isSubmitting}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Info Section */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Our team will review your report within 24-48 hours</li>
                  <li>• We may contact you for additional information</li>
                  <li>
                    • Once verified, we'll process your refund or resolution
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
