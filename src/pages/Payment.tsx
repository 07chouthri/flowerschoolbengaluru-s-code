import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/lib/api';

interface PaymentDetails {
  enrollmentId: string;
  courseTitle: string;
  studentName: string;
  amount: string;
  batch: string;
}

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const enrollmentId = searchParams.get('enrollment');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/api/enrollments/${enrollmentId}`);
        setPaymentDetails({
          enrollmentId: response.data.id,
          courseTitle: response.data.courseTitle,
          studentName: response.data.fullname,
          amount: amount || '0',
          batch: response.data.batch
        });
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      fetchDetails();
    }
  }, [enrollmentId, amount]);

  const handlePayment = async () => {
    try {
      // Initialize payment gateway here
      // For now, we'll just update the status
      await api.patch(`/api/enrollments/${enrollmentId}/status`, {
        status: 'confirmed'
      });

      // Show success message
      alert('Payment successful! You will receive a confirmation message shortly.');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again or contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Details Not Found</h1>
          <p>Unable to load payment details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">Please review the details below</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course</span>
            <span className="font-semibold">{paymentDetails.courseTitle}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Student Name</span>
            <span className="font-semibold">{paymentDetails.studentName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Batch</span>
            <span className="font-semibold">{paymentDetails.batch}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-primary">₹{parseFloat(paymentDetails.amount).toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full" size="lg" onClick={handlePayment}>
            Pay Now
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Secure payment powered by Razorpay
          </p>
        </div>
      </Card>
    </div>
  );
}