import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    courseId: string;
    batch: string;
    price: string;
}

interface EnrollmentForm {
    fullName: string;
    email: string;
    phone: string;
    questions: string;
    paymentMethod: string;
}

export function EnrollmentDialog({ isOpen, onClose, courseTitle, courseId, batch, price }: EnrollmentDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [formData, setFormData] = useState<EnrollmentForm>({
        fullName: '',
        email: '',
        phone: '',
        questions: '',
        paymentMethod: 'UPI'
    });

    // Phone number validation (Indian format)
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length === 10;
    };

    // Email validation
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form validation
    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            errors.phone = 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Format phone number (remove non-digits and limit to 10 digits)
        if (name === 'phone') {
            const cleanPhone = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleanPhone }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleReviewEnrollment = () => {
        if (validateForm()) {
            setShowConfirmation(true);
        } else {
            toast({
                title: "Validation Error",
                description: "Please fix the errors in the form before proceeding.",
                variant: "destructive"
            });
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        try {
            // Submit enrollment
            const enrollmentResponse = await api.post('/api/enrollments', {
                ...formData,
                courseId: courseId,
                courseTitle: courseTitle,
                batch: batch,
                price: price,
                status: 'pending'
            });

            if (enrollmentResponse.data) {
                // Close confirmation dialog first
                setShowConfirmation(false);

                // Show success modal
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            toast({
                title: "❌ Enrollment Failed",
                description: "There was an issue processing your enrollment. Please try again or contact support.",
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDialogClose = () => {
        setShowConfirmation(false);
        setShowSuccessModal(false);
        setValidationErrors({});
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            questions: '',
            paymentMethod: 'UPI'
        });
        onClose();
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] w-[95%] sm:w-[90%] md:w-[85%] mx-auto max-h-[95vh] overflow-y-auto">
                <DialogHeader className="space-y-3 px-1">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary leading-tight">
                        Enroll in {courseTitle}
                    </DialogTitle>
                    <DialogDescription className="text-sm md:text-base">
                        <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border">
                            <p className="text-sm sm:text-base">Please fill out the form below to enroll in this course.</p>
                            <p className="mt-2 font-medium text-primary text-sm sm:text-base">Batch starting: {batch}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); handleReviewEnrollment(); }} className="space-y-4 sm:space-y-5 px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`h-10 sm:h-11 text-sm sm:text-base ${
                                    validationErrors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                }`}
                            />
                            {validationErrors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`h-10 sm:h-11 text-sm sm:text-base ${
                                    validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                }`}
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className={`h-10 sm:h-11 text-sm sm:text-base ${
                                    validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                }`}
                            />
                            {validationErrors.phone && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                            )}
                            <p className="text-gray-500 text-xs">Format: 10 digits starting with 6, 7, 8, or 9</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method *</Label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                className="w-full h-10 sm:h-11 px-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm sm:text-base"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="UPI">UPI Payment</option>
                                <option value="QR Code">QR Code Payment</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="questions" className="text-sm font-medium">Questions or Comments (Optional)</Label>
                        <Textarea
                            id="questions"
                            name="questions"
                            placeholder="Any questions for the instructor?"
                            value={formData.questions}
                            onChange={handleChange}
                            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Price Summary */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-base sm:text-lg font-semibold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="text-muted-foreground text-sm sm:text-base font-normal">Total Course Fee:</span>
                                <span className="text-primary text-xl sm:text-2xl font-bold">₹{parseFloat(price).toLocaleString()}</span>
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full sm:w-auto min-w-[160px] h-10 sm:h-11 bg-pink-600 hover:bg-pink-700"
                                size="lg"
                            >
                                Review Enrollment
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Confirmation Dialog */}
                {showConfirmation && (
                    <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] w-[95%] sm:w-[90%] md:w-[85%] mx-auto max-h-[95vh] overflow-y-auto">
                            <DialogHeader className="space-y-2 px-1">
                                <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                                    Confirm Enrollment
                                </DialogTitle>
                                <DialogDescription className="text-sm md:text-base">
                                    Review details before confirming
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 px-1">
                                {/* Simple Course Info */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-bold text-lg mb-3">{courseTitle}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Batch:</span>
                                            <span className="font-medium">{batch}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Fee:</span>
                                            <span className="font-bold text-primary">₹{parseFloat(price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Simple Personal Details */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-bold text-base mb-3">Your Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Name:</span>
                                            <span className="font-medium">{formData.fullName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Email:</span>
                                            <span className="font-medium break-all">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phone:</span>
                                            <span className="font-medium">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment:</span>
                                            <span className="font-medium">{formData.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions if any */}
                                {formData.questions && (
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-bold text-base mb-2">Questions</h3>
                                        <p className="text-sm text-muted-foreground">{formData.questions}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowConfirmation(false)}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto min-w-[120px] h-10 sm:h-11 border-pink-600 text-pink-600 hover:bg-pink-50"
                                        size="lg"
                                    >
                                        ← Back to Edit
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto min-w-[160px] h-10 sm:h-11 bg-pink-600 hover:bg-pink-700"
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-sm sm:text-base">Processing...</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm sm:text-base">✅ Confirm & Enroll</span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={() => {
            setShowSuccessModal(false);
            // Reset form and close main dialog
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                questions: '',
                paymentMethod: 'UPI'
            });
            setValidationErrors({});
            onClose();
        }}>
            <DialogContent className="sm:max-w-[400px] w-[95%] sm:w-[90%] mx-auto">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl font-bold text-pink-600 flex items-center justify-center gap-2">
                        🎉 Enrollment Successful!
                    </DialogTitle>
                    <DialogDescription className="text-center mt-4">
                        Your course enrollment has been confirmed successfully.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 text-center space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <p className="text-pink-800 font-medium mb-2">✅ Enrollment Confirmed</p>
                        <p className="text-pink-700 text-sm">
                            You will receive a confirmation message on WhatsApp shortly with all the course details.
                        </p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium">Course:</span> {courseTitle}</p>
                        <p><span className="font-medium">Batch:</span> {batch}</p>
                        <p><span className="font-medium">Student:</span> {formData.fullName}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                    </div>
                </div>

                <DialogFooter className="justify-center">
                    <Button 
                        onClick={() => {
                            setShowSuccessModal(false);
                            // Reset form and close main dialog
                            setFormData({
                                fullName: '',
                                email: '',
                                phone: '',
                                questions: '',
                                paymentMethod: 'UPI'
                            });
                            setValidationErrors({});
                            onClose();
                        }}
                        className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}