import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Event } from '@/types/event';
import api from '@/lib/api';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequirements: string;
    address?: string;
    city?: string;
    postalCode?: string;
    deliveryInstructions?: string;
}

interface BookingModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ event, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequirements: '',
        address: '',
        city: '',
        postalCode: '',
        deliveryInstructions: ''
    });
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'online'>('online');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'WhatsApp number is required';
        } else if (!validatePhone(formData.phone)) {
            errors.phone = 'Please enter a valid 10-digit WhatsApp number (starting with 6-9)';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            setFormData(prev => ({
                ...prev,
                [name]: cleanPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);

            // Calculate total amount - only UPI payment now
            const totalAmount = event.price || 0;

            // Prepare enrollment data
            const enrollmentData = {
                eventId: event.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                paymentMethod: 'online',
                paymentAmount: totalAmount,
                transactionId: Date.now().toString()
            };

            // Submit enrollment
            const response = await api.post('/api/events_enrollments', enrollmentData);
        
            if (response.data.success) {
                setShowSuccessModal(true);
            } else {
                setErrorMessage('Unable to complete booking. Please try again.');
            }
        } catch (error: any) {
            console.error('Booking error:', error);
            setErrorMessage(
                error.response?.data?.error ||
                'There was an error processing your booking. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px] md:max-w-[600px] w-[95%] sm:w-[90%] mx-auto max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl font-bold">Book Event: {event.title}</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            {event.event_date} at {event.event_time}
                        </DialogDescription>
                    </DialogHeader>

                {step === 1 ? (
                    // Step 1: Personal Details
                    <>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First name *</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your first name"
                                        className={`h-10 sm:h-11 ${validationErrors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    />
                                    {validationErrors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last name *</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your last name"
                                        className={`h-10 sm:h-11 ${validationErrors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    />
                                    {validationErrors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className={`h-10 sm:h-11 ${validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                                />
                                {validationErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-sm font-medium">WhatsApp Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter 10-digit WhatsApp number"
                                    maxLength={10}
                                    className={`h-10 sm:h-11 ${validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                                />
                                {validationErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                                )}
                                <p className="text-gray-500 text-xs">Format: 10 digits starting with 6, 7, 8, or 9</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="specialRequirements" className="text-sm font-medium">Special Requirements</Label>
                                <Input
                                    id="specialRequirements"
                                    name="specialRequirements"
                                    value={formData.specialRequirements}
                                    onChange={handleInputChange}
                                    placeholder="Any special requirements?"
                                    className="h-10 sm:h-11"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={onClose} className="border-pink-600 text-pink-600 hover:bg-pink-50">Cancel</Button>
                            <Button
                                onClick={() => {
                                    if (validateForm()) {
                                        setStep(2);
                                    }
                                }}
                                className="bg-pink-600 hover:bg-pink-700"
                            >
                                Continue to Payment
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    // Step 2: Payment
                    <>
                        <div className="space-y-4 py-4">
                            {/* Payment Method Section */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-lg">Payment Method</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-primary/5 border-primary/20">
                                        <input
                                            type="radio"
                                            id="upi"
                                            name="paymentMethod"
                                            value="online"
                                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                            checked={true}
                                            readOnly
                                        />
                                        <Label htmlFor="upi" className="font-medium">UPI Payment Only</Label>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                                    <h5 className="font-medium text-base mb-4">UPI Payment Details</h5>
                                    <div className="text-center space-y-4">
                                        <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg border">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=YOUR_UPI_ID@ybl&pn=FLOWER_SHOP&am=${event.price || 0}&cu=INR&tn=${event.title}`}
                                                alt="UPI QR Code"
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <p className="text-sm font-medium">Scan QR code with any UPI app</p>
                                        
                                        <div className="text-center">
                                            <p className="text-sm mb-2">Or pay using UPI ID</p>
                                            <div className="flex items-center justify-center gap-2 bg-white p-3 rounded border">
                                                <span className="font-medium text-primary">YOUR_UPI_ID@ybl</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText('YOUR_UPI_ID@ybl');
                                                        alert('UPI ID copied to clipboard!');
                                                    }}
                                                    className="text-pink-600 hover:bg-pink-50"
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span>Event Price:</span>
                                        <span className="font-medium">₹{event.price || 0}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-lg text-primary">₹{event.price || 0}</span>
                                    </div>
                                </div>

                                {errorMessage && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errorMessage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto border-pink-600 text-pink-600 hover:bg-pink-50">
                                Back
                            </Button>
                            <Button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
                            >
                                {loading ? "Processing..." : "Confirm Payment"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={() => {
            setShowSuccessModal(false);
            onClose();
        }}>
            <DialogContent className="sm:max-w-[400px] w-[95%] sm:w-[90%] mx-auto">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl font-bold text-pink-600 flex items-center justify-center gap-2">
                        🎉 Booking Successful!
                    </DialogTitle>
                    <DialogDescription className="text-center mt-4">
                        Your event booking has been confirmed successfully.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 text-center space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <p className="text-pink-800 font-medium mb-2">✅ Booking Confirmed</p>
                        <p className="text-pink-700 text-sm">
                            You will receive a confirmation message on WhatsApp shortly with all the event details.
                        </p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium">Event:</span> {event.title}</p>
                        <p><span className="font-medium">Date:</span> {event.event_date}</p>
                        <p><span className="font-medium">Time:</span> {event.event_time}</p>
                        <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                    </div>
                </div>

                <DialogFooter className="justify-center">
                    <Button 
                        onClick={() => {
                            setShowSuccessModal(false);
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
