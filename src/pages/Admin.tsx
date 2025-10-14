import React, { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Calendar as CalendarIcon,
  GraduationCap,
  BarChart3,
  Settings,
  Plus,
  Upload,
  Eye,
  Edit,
  Trash2,
  X,
  Home,
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Clock
} from "lucide-react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import flowerSchoolLogo from "@/assets/flower-school-logo.png";
import api from '@/lib/api';

// Import event types
import { Event, EventFormData, EventType } from '@/types/event';

// TypeScript interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imagefirst?: string;
  imagesecond?: string;
  imagethirder?: string;
  imagefoure?: string;
  stockquantity: number;
  instock: boolean;
  featured: boolean;
  createdat?: string;
}

interface Order {
  id: string;
  ordernumber: string;
  customername: string;
  email: string;
  phone: string;
  status: string;
  paymentstatus: string;
  paymentmethod: string;
  total: number;
  subtotal: number;
  deliverycharge: number;
  discountamount: number;
  deliveryaddress: string;
  occasion?: string;
  requirements?: string;
  items: OrderItem[];
  createdat: string;
  updatedat?: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Class {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  sessions: number;
  features: string[];
  nextbatch: string;
  category: string;
  image?: string;
  createdat?: string;
}

interface StudentFeedback {
  id: string;
  student_name: string;
  course_name: string;
  feedback_text: string;
  rating: number;
  created_at?: string;
}

interface StatusFeedback {
  id: string;
  title: string;
  status: string;
  description: string;
  priority: string;
  assigned_to: string;
  created_by: string;
  created_at?: string;
}

interface OfficeTiming {
  id: string;
  office_day: string;
  open_time: string;
  close_time: string;
  is_holiday: boolean;
}

interface DashboardData {
  grand_total_orders: number;
  total_orders: number;
  total_products: number;
  max_feedback_rating: number;
  total_unique_enrollments: number;
  total_completed_batches: number;
  subscriber_emails: string[];
}

interface SidebarItem {
  title: string;
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface EventEnrollment {
  email: string;
  event_title: string;
  event_date: string;
}

interface ClassEnrollment {
  name: string;
  email: string;
  phone: string;
  batch: string;
  status_question: string;
  course_title: string;
}

interface Student {
  name: string;
  email: string;
  source: string;
}

interface Impact {
  id: string;
  title: string;
  value: string;
  created_at?: string;
}




const Admin = () => {
  const { toast } = useToast();

  // Helper function to determine instock status
  const getInstockStatus = (product: any): boolean => {
    // Check both instock and inStock properties (API inconsistency)
    const instockValue = product.instock ?? product.inStock;
    const stockQuantity = parseInt(product.stockquantity ?? product.stockQuantity) || 0;

    // Convert to boolean and ensure stock quantity > 0
    const isInStock = (instockValue === true || instockValue === 'true' || instockValue === 1);
    return isInStock && stockQuantity > 0;
  };

  // Helper function to format product data consistently
  const formatProductData = (products: any[]): Product[] => {
    return products.map(product => ({
      ...product,
      price: parseFloat(product.price) || 0,
      stockquantity: parseInt(product.stockquantity ?? product.stockQuantity) || 0,
      instock: getInstockStatus(product)
    }));
  };

  // Refresh functions
  const refreshProducts = async () => {
    setIsProductsLoading(true);
    try {
      const productsResponse = await api.get('/api/admin/products');
      if (productsResponse.status === 200 && productsResponse.data) {
        const formattedProducts = formatProductData(productsResponse.data);
        setProducts(formattedProducts);
        setLastRefreshTime(new Date());
        toast({
          title: "Success",
          description: "Products refreshed successfully",
        });
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    } finally {
      setIsProductsLoading(false);
    }
  };

  const refreshOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const ordersResponse = await api.get('/api/admin/orders');
      if (ordersResponse.status === 200 && ordersResponse.data) {
        setOrders(ordersResponse.data);
        toast({
          title: "Success",
          description: "Orders refreshed successfully",
        });
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast({
        title: "Error",
        description: "Failed to refresh orders",
        variant: "destructive",
      });
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const refreshClasses = async () => {
    setIsClassesLoading(true);
    try {
      const classesResponse = await api.get('/api/admin/AdminClasses');
      if (classesResponse.status === 200 && classesResponse.data) {
        const formattedClasses = Array.isArray(classesResponse.data) ?
          classesResponse.data.map(cls => {
            let features = cls.features;
            if (typeof features === 'string') {
              try {
                features = JSON.parse(features);
              } catch {
                features = [];
              }
            }
            return {
              ...cls,
              features: Array.isArray(features) ? features : [],
              price: parseFloat(cls.price) || 0,
              sessions: parseInt(cls.sessions) || 0
            };
          }) : [];
        setClasses(formattedClasses);
        setLastRefreshTime(new Date());
        toast({
          title: "Success",
          description: "Classes refreshed successfully",
        });
      }
    } catch (error) {
      console.error('Error refreshing classes:', error);
      toast({
        title: "Error",
        description: "Failed to refresh classes",
        variant: "destructive",
      });
    } finally {
      setIsClassesLoading(false);
    }
  };
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [classImageFile, setClassImageFile] = useState<string>('');
  const [editClassImageFile, setEditClassImageFile] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Status feedback state variables
  const [statusFeedback, setStatusFeedback] = useState<StatusFeedback[]>([]);
  const [showStatusFeedbackForm, setShowStatusFeedbackForm] = useState(false);
  const [selectedStatusFeedback, setSelectedStatusFeedback] = useState<StatusFeedback | null>(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);

  // Student feedback state variables
  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<StudentFeedback | null>(null);
  const [isDeleteFeedbackModalOpen, setIsDeleteFeedbackModalOpen] = useState(false);

  // Office timings state variables
  const [officeTimings, setOfficeTimings] = useState<OfficeTiming[]>([]);
  const [showOfficeTimingForm, setShowOfficeTimingForm] = useState(false);
  const [selectedOfficeTiming, setSelectedOfficeTiming] = useState<OfficeTiming | null>(null);
  const [isEditOfficeTimingModalOpen, setIsEditOfficeTimingModalOpen] = useState(false);
  const [isDeleteOfficeTimingModalOpen, setIsDeleteOfficeTimingModalOpen] = useState(false);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Class management state variables
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isViewClassModalOpen, setIsViewClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [isClassesLoading, setIsClassesLoading] = useState(false);

  // Event class enrollments state variables
  const [eventEnrollments, setEventEnrollments] = useState<EventEnrollment[]>([]);
  const [classEnrollments, setClassEnrollments] = useState<ClassEnrollment[]>([]);
  const [isEventClassEnrollmentsLoading, setIsEventClassEnrollmentsLoading] = useState(false);

  // Calendar Events state variables
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isViewEventModalOpen, setIsViewEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [eventImageFile, setEventImageFile] = useState<string>('');
  const [editEventImageFile, setEditEventImageFile] = useState<string>('');

  // Calendar state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Students state variables
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);

  // Impact management state
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [isImpactsLoading, setIsImpactsLoading] = useState(false);
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [impactTitle, setImpactTitle] = useState('');
  const [impactValue, setImpactValue] = useState('');
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);

  // Instructors state variables
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [isViewInstructorModalOpen, setIsViewInstructorModalOpen] = useState(false);
  const [isEditInstructorModalOpen, setIsEditInstructorModalOpen] = useState(false);
  const [isDeleteInstructorModalOpen, setIsDeleteInstructorModalOpen] = useState(false);
  const [isInstructorsLoading, setIsInstructorsLoading] = useState(false);
  const [instructorImageFile, setInstructorImageFile] = useState<string>('');
  const [editInstructorImageFile, setEditInstructorImageFile] = useState<string>('');

  // Custom Alert Modal state
  const [alertModal, setAlertModal] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: '', message: '' });

  // Helper function to format time objects to strings
  const formatTimeValue = (timeValue: any): string => {
    if (!timeValue) return '';
    if (typeof timeValue === 'string') return timeValue;
    if (typeof timeValue === 'object') {
      // Handle PostgreSQL time/interval objects
      if (timeValue.hours !== undefined && timeValue.minutes !== undefined) {
        const hours = String(timeValue.hours).padStart(2, '0');
        const minutes = String(timeValue.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      if (timeValue.seconds !== undefined) {
        // Handle duration intervals
        const hours = Math.floor(timeValue.seconds / 3600);
        const minutes = Math.floor((timeValue.seconds % 3600) / 60);
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      }
      // If it's an object but we can't parse it, try to stringify it safely
      return JSON.stringify(timeValue);
    }
    return String(timeValue);
  };

  // Function to get base64 size in MB
  const getBase64Size = (base64String: string): number => {
    const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
    const base64Length = base64String.length;
    const actualLength = (base64Length * 0.75) - padding;
    return actualLength / (1024 * 1024); // Convert to MB
  };

  // Compress image function - more aggressive compression to avoid header size limit

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewOrderModalOpen, setIsViewOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newProductCategories, setNewProductCategories] = useState<string[]>([]);
  const [editProductCategories, setEditProductCategories] = useState<string[]>([]);
  const [typedCategory, setTypedCategory] = useState<string>('');

  // Predefined category groups for quick-select in the admin product form
  const allCategories: { id: string; name: string; groups: { title: string; items: string[] }[] }[] = [
    {
      id: 'occasion',
      name: 'Occasion',
      groups: [
        {
          title: 'Celebration Flowers',
          items: [
            'Birthday Flowers', 'Anniversary Flowers', 'Wedding Flowers', "Valentine's Day Flowers", "Mother's Day Flowers", 'Get Well Soon Flowers', 'Congratulations Flowers'
          ]
        },
        {
          title: 'Special Occasions',
          items: [
            'Sympathy & Funeral Flowers', 'New Baby Flowers', 'Graduation Flowers', 'Housewarming Flowers', 'Retirement Flowers', 'Christmas Flowers', 'New Year Flowers'
          ]
        }
      ]
    },
    {
      id: 'flower-types',
      name: 'Flowers',
      groups: [
        { title: 'Popular Flowers', items: ['Tulips', 'Lilies', 'Carnations', 'Orchids', 'Sunflowers', 'Mixed Flowers', 'Roses'] },
        { title: 'Specialty Flowers', items: ["Baby's Breath", 'Chrysanthemum', 'Hydrangea', 'Anthurium', 'Calla Lilies', 'Gerberas', 'Peonies'] }
      ]
    },
    {
      id: 'arrangements',
      name: 'Arrangements',
      groups: [
        { title: 'Popular Arrangements', items: ['Bouquets (hand-tied, wrapped)', 'Flower Baskets', 'Flower Boxes', 'Vase Arrangements', 'Floral Centerpieces', 'Flower Garlands', 'Lobby Arrangements'] },
        { title: 'Specialty Arrangements', items: ['Exotic Arrangements', "Floral Cross Arrangement", "Baby's Breath Arrangement", 'Gladiolus Arrangement', 'Wine Bottle Arrangements', 'Floral Wreaths', 'Custom Arrangements'] }
      ]
    }
  ];

  // State for quick-select dropdowns
  const [selectedAllCategoryId, setSelectedAllCategoryId] = useState<string>('');
  const [selectedAllCategoryItem, setSelectedAllCategoryItem] = useState<string>('');


  const getCategoryArray = (category: any): string[] => {
    if (!category) return [];
    if (Array.isArray(category)) return category.map(String);
    if (typeof category === 'string') {
      const str = category.trim();
      if (!str) return [];
      
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed.map((v: any) => String(v));
      } catch {
       
      }
    
      if (str.includes(',')) {
        return str.split(',').map(s => s.trim()).filter(Boolean);
      }

      return [str];
    }
  
    return [String(category)];
  };



    // Comma-separated category list with show more / show less
    const CategoryList: React.FC<{ cats: string[]; maxVisible?: number }> = ({ cats, maxVisible = 2 }) => {
      const [expanded, setExpanded] = useState(false);
      if (!cats || cats.length === 0) return <span className="text-sm text-muted-foreground">Uncategorized</span>;
      const visible = expanded ? cats : cats.slice(0, maxVisible);
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            {visible.join(', ')}
            {(!expanded && cats.length > maxVisible) ? ',' : ''}
          </div>
          {cats.length > maxVisible && (
            <button
              type="button"
              className="text-xs text-primary underline mt-1"
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? 'Show less' : `Show more (${cats.length - maxVisible})`}
            </button>
          )}
        </div>
      );
    };

    // Description with read more / show less toggle
    const DescriptionWithToggle: React.FC<{ description?: string | null; maxLines?: number }> = ({ description, maxLines = 2 }) => {
      const [expanded, setExpanded] = useState(false);
      if (!description) return <div className="text-sm text-muted-foreground mt-2">No description available</div>;

      return (
        <div className="mt-2 text-sm text-muted-foreground">
          <div className={cn('text-sm', !expanded ? `line-clamp-${maxLines}` : '')}>
            {String(description)}
          </div>
          <button
            type="button"
            className="mt-1 inline-flex items-center text-xs text-primary hover:underline"
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {!expanded ? (
              <>
                <ChevronRight className="h-3 w-3 mr-1" />
                Read more
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show less
              </>
            )}
          </button>
        </div>
      );
    };

    useEffect(() => {
    if (selectedProduct) {
      setEditProductCategories(Array.isArray(selectedProduct.category)
        ? (selectedProduct.category as string[])
        : getCategoryArray(selectedProduct.category));
    } else {
      setEditProductCategories([]);
    }
  }, [selectedProduct]);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsDashboardLoading(true);
      const response = await api.get('/api/getDashboardData');
      if (response.status === 200 && response.data) {
        setDashboardData(response.data);
        console.log('Dashboard data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsDashboardLoading(false);
    }
  };

  // Function to fetch event class enrollments data
  const fetchEventClassEnrollments = async () => {
    try {
      setIsEventClassEnrollmentsLoading(true);
      const response = await api.get('/api/getEventClassEnrollments');
      if (response.status === 200 && response.data) {
        setEventEnrollments(response.data.eventClassEnrollments || []);
        setClassEnrollments(response.data.classEnrollments || []);
        console.log('Event Class Enrollments data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching event class enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event class enrollments data",
        variant: "destructive",
      });
    } finally {
      setIsEventClassEnrollmentsLoading(false);
    }
  };

  // Impact API functions
  const fetchImpacts = async () => {
    try {
      setIsImpactsLoading(true);
      const response = await api.get('/api/impacts');
      if (response.status === 200 && response.data) {
        // Accept either array or wrapped object
        const data = Array.isArray(response.data) ? response.data : (response.data.data || response.data.impacts || []);
        setImpacts(data);
      }
    } catch (error) {
      console.error('Error fetching impacts:', error);
      toast({ title: 'Error', description: 'Failed to fetch impacts', variant: 'destructive' });
      setImpacts([]);
    } finally {
      setIsImpactsLoading(false);
    }
  };

  const refreshImpacts = async () => {
    await fetchImpacts();
    toast({ title: 'Success', description: 'Impacts refreshed successfully' });
  };

  const handleCreateImpact = async () => {
    if (!impactTitle.trim()) {
      toast({ title: 'Validation', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = { title: impactTitle.trim(), value: impactValue.trim() };
      let response;
      if (editingImpactId) {
        response = await api.put(`/api/impacts/${editingImpactId}`, payload);
      } else {
        // Re-check local impacts count to avoid creating more than 4 (race-case guard)
        if (impacts.length >= 4) {
          toast({ title: 'Limit reached', description: 'Maximum of 4 impacts allowed. Delete one to add another.', variant: 'destructive' });
          return;
        }
        response = await api.post('/api/impacts', payload);
      }

      if (response.status === 201 || response.status === 200) {
        await fetchImpacts();
        setImpactTitle('');
        setImpactValue('');
        setShowImpactForm(false);
        setEditingImpactId(null);
        toast({ title: 'Success', description: editingImpactId ? 'Impact updated' : 'Impact created' });
      }
    } catch (error) {
      console.error('Error creating impact:', error);
      toast({ title: 'Error', description: 'Failed to create impact', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImpact = async (id?: string) => {
    if (!id) return;
    // Use in-app toast confirmation instead of native browser confirm
    toast({ title: 'Deleting', description: 'Deleting impact...', variant: 'default' });
    setIsLoading(true);
    try {
      await api.delete(`/api/impacts/${id}`);
      setImpacts(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Success', description: 'Impact deleted' });
    } catch (error) {
      console.error('Error deleting impact:', error);
      toast({ title: 'Error', description: 'Failed to delete impact', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch events
  const fetchEvents = async () => {
    try {
      setIsEventsLoading(true);
      console.log('Fetching events from /api/get/events...');
      const response = await api.get('/api/get/events');

      if (response.status === 200) {
        // Handle both response formats - array directly or wrapped in success object
        let eventsData = response.data;

        if (Array.isArray(eventsData)) {
          console.log('Events data is array, setting:', eventsData.length, 'events');
          setEvents(eventsData);
        } else if (eventsData.success && eventsData.events) {
          console.log('Events data has success wrapper:', eventsData.events.length, 'events');
          setEvents(eventsData.events);
        } else if (eventsData.events) {
          console.log('Events data has events property:', eventsData.events.length, 'events');
          setEvents(eventsData.events);
        } else {
          console.log('No events data found, setting empty array');
          setEvents([]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events data",
        variant: "destructive",
      });
      setEvents([]); // Set empty array on error
    } finally {
      setIsEventsLoading(false);
    }
  };

  // Function to refresh events
  const refreshEvents = async () => {
    await fetchEvents();
    toast({
      title: "Success",
      description: "Events refreshed successfully",
    });
  };

  // Function to fetch students
  const fetchStudents = async () => {
    try {
      setIsStudentsLoading(true);
      console.log('Fetching students from /api/getStudents...');
      const response = await api.get('/api/getStudents');

      if (response.status === 200 && response.data.success) {
        console.log('Students data received:', response.data.data.length, 'students');
        setStudents(response.data.data);
      } else {
        console.log('No students data found, setting empty array');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students data",
        variant: "destructive",
      });
      setStudents([]);
    } finally {
      setIsStudentsLoading(false);
    }
  };

  // Function to refresh students
  const refreshStudents = async () => {
    await fetchStudents();
    toast({
      title: "Success",
      description: "Students refreshed successfully",
    });
  };

  // Function to fetch instructors
  const fetchInstructors = async () => {
    try {
      setIsInstructorsLoading(true);
      console.log('Fetching instructors from /api/instructors...');
      const response = await api.get('/api/instructors');

      if (response.status === 200 && response.data.success) {
        console.log('Instructors data received:', response.data.data.length, 'instructors');
        setInstructors(response.data.data);
      } else {
        console.log('No instructors data found, setting empty array');
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch instructors data",
        variant: "destructive",
      });
      setInstructors([]);
    } finally {
      setIsInstructorsLoading(false);
    }
  };

  // Function to refresh instructors
  const refreshInstructors = async () => {
    await fetchInstructors();
    toast({
      title: "Success",
      description: "Instructors refreshed successfully",
    });
  };

  // Custom alert function to replace window.alert
  const showAlert = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // Check authentication first
      const token = localStorage.getItem('sessionToken');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';

      if (!token || !isAdmin) {
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch dashboard data first
        await fetchDashboardData();

        setIsProductsLoading(true);
        setIsOrdersLoading(true);

        // Fetch products
        const productsResponse = await api.get('/api/admin/products');
        if (productsResponse.status === 200 && productsResponse.data) {
          const formattedProducts = formatProductData(productsResponse.data);
          setProducts(formattedProducts);
        }
        setIsProductsLoading(false);

        // Fetch orders
        const ordersResponse = await api.get('/api/admin/orders');
        if (ordersResponse.status === 200 && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
        setIsOrdersLoading(false);

        // Fetch student feedback
        const feedbackResponse = await api.get('/api/Feedback');
        if (feedbackResponse.status === 200 && feedbackResponse.data) {
          setStudentFeedback(feedbackResponse.data.data || []);
        }

        // Fetch status feedback
        const statusFeedbackResponse = await api.get('/api/Feedback');
        if (statusFeedbackResponse.status === 200 && statusFeedbackResponse.data) {
          setStatusFeedback(statusFeedbackResponse.data.data || []);
        }

        // Fetch office timings
        const officeTimingsResponse = await api.get('/api/office-timing');
        if (officeTimingsResponse.data.success) {
          setOfficeTimings(officeTimingsResponse.data.data);
        }

        // Fetch classes
        setIsClassesLoading(true);
        console.log('Loading classes from API...');
        const classesResponse = await api.get('/api/admin/AdminClasses');
        console.log('Classes API response:', classesResponse);
        if (classesResponse.status === 200 && classesResponse.data) {
          try {
            console.log('Raw classes data:', classesResponse.data);
            // Ensure classes data is properly formatted
            const formattedClasses = Array.isArray(classesResponse.data) ?
              classesResponse.data.map(cls => {
                try {
                  // Parse features if it's a JSON string
                  let features = cls.features;
                  if (typeof features === 'string') {
                    try {
                      features = JSON.parse(features);
                    } catch {
                      features = [];
                    }
                  }
                  return {
                    ...cls,
                    features: Array.isArray(features) ? features : [],
                    price: parseFloat(cls.price) || 0,
                    sessions: parseInt(cls.sessions) || 0
                  };
                } catch (mapError) {
                  console.error('Error processing individual class:', mapError);
                  return {
                    ...cls,
                    features: [],
                    price: 0,
                    sessions: 0
                  };
                }
              }) : [];
            console.log('Formatted classes:', formattedClasses);
            setClasses(formattedClasses);
          } catch (processingError) {
            console.error('Error processing classes data:', processingError);
            setClasses([]);
          }
        }
        setIsClassesLoading(false);

        // Fetch event class enrollments
        await fetchEventClassEnrollments();

        // Fetch events for calendar
        await fetchEvents();
        // Fetch impacts
        await fetchImpacts();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
        // Set empty arrays to prevent undefined errors
        setProducts([]);
        setOrders([]);
        setClasses([]);
        setStatusFeedback([]);
        setOfficeTimings([]);
      }
    };

    checkAuthAndFetchData();
  }, []);

  // Fetch students when the students tab is selected
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab]);

  // Fetch impacts when impact tab is selected
  useEffect(() => {
    if (activeTab === 'impact') {
      fetchImpacts();
    }
  }, [activeTab]);

  // Fetch instructors when the instructors tab is selected
  useEffect(() => {
    if (activeTab === "instructors") {
      fetchInstructors();
    }
  }, [activeTab]);

  


  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", id: "dashboard", icon: LayoutDashboard, description: "Overview & Stats" },
    { title: "Products", id: "products", icon: Package, description: "Manage Inventory" },
    { title: "Orders", id: "orders", icon: ShoppingCart, description: "Customer Orders" },
    { title: "Classes", id: "classes", icon: GraduationCap, description: "Educational Programs" },
    { title: "Event Class Enrollments", id: "event-class-enrollments", icon: Users, description: "Event & Class Registrations" },
    { title: "Student Feedback", id: "feedback", icon: MessageSquare, description: "Student Reviews" },
    { title: "Office Hours", id: "office-timing", icon: Clock, description: "Business Hours" },
    { title: "Calendar", id: "calendar", icon: CalendarIcon, description: "Schedule & Events" },
    { title: "Students", id: "students", icon: Users, description: "Student Management" },
    { title: "Instructors", id: "instructors", icon: Users, description: "Instructor Management" },
    { title: "Impact", id: "impact", icon: BarChart3, description: "Site impact values" },
  ];

  // Dynamic stats based on real dashboard data
  const stats = dashboardData ? [
    {
      title: "Total Revenue",
      value: `₹${(dashboardData.grand_total_orders || 0).toLocaleString()}`,
      change: "+18%",
      color: "text-green-600",
      description: "Total sales from all orders"
    },
    {
      title: "Total Orders",
      value: String(dashboardData.total_orders || 0),
      change: "+12%",
      color: "text-blue-600",
      description: "Total orders placed"
    },
    {
      title: "Active Students",
      value: String(dashboardData.total_unique_enrollments || 0),
      change: "+7%",
      color: "text-purple-600",
      description: "Students enrolled in programs"
    },
    {
      title: "Classes Completed",
      value: String(dashboardData.total_completed_batches || 0),
      change: "+23%",
      color: "text-orange-600",
      description: "Workshops and masterclasses completed"
    },
    {
      title: "Customer Rating",
      value: `${(dashboardData.max_feedback_rating || 0).toFixed(1)}/5`,
      change: "+0.2",
      color: "text-yellow-600",
      description: "Highest customer rating"
    },
    {
      title: "Total Products",
      value: String(dashboardData.total_products || 0),
      change: "+5%",
      color: "text-pink-600",
      description: "Products in inventory"
    },
  ] : [
    { title: "Loading...", value: "...", change: "", color: "text-gray-600", description: "Fetching dashboard data" },
  ];


  const classesData = [
    { id: 1, name: "Basic Flower Arrangement", instructor: "Sarah Johnson", date: "2024-01-15", students: 8, capacity: 12, status: "Active" },
    { id: 2, name: "Wedding Bouquet Masterclass", instructor: "Emily Chen", date: "2024-01-20", students: 6, capacity: 8, status: "Active" },
    { id: 3, name: "Kids Floral Art Workshop", instructor: "Mike Rodriguez", date: "2024-01-22", students: 12, capacity: 15, status: "Active" },
  ];

  const formatTime = (timeString: string | undefined | null): string => {
    if (!timeString || typeof timeString !== 'string') return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes || '00'} ${ampm}`;
    } catch (error) {
      return '';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Admin Dashboard</h1>
                <p className="text-muted-foreground font-sans">Welcome back! Here's what's happening with your flower business.</p>
              </div>
              <Button
                variant="outline"
                onClick={fetchDashboardData}
                disabled={isDashboardLoading}
              >
                {isDashboardLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl font-bold font-sans">{stat.value}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${stat.color} bg-current/10`}>
                        {stat.change}
                      </div>
                    </div>
                    <p className="font-medium text-foreground mb-1 font-sans">{stat.title}</p>
                    <p className="text-xs text-muted-foreground font-sans">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subscriber Emails Section */}
            {dashboardData && dashboardData.subscriber_emails && dashboardData.subscriber_emails.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-sans">
                    <Mail className="h-5 w-5" />
                    Website Subscribers ({dashboardData.subscriber_emails.length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-sans">
                    {dashboardData.subscriber_emails.length > 20
                      ? `Showing first 20 of ${dashboardData.subscriber_emails.length} email addresses`
                      : "Email addresses of users who subscribed to our newsletter"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {dashboardData.subscriber_emails.slice(0, 20).map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm"
                        >
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "products":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Product Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {lastRefreshTime ? String(lastRefreshTime.toLocaleTimeString()) : 'Never'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshProducts}
                  disabled={isProductsLoading}
                >
                  {isProductsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="font-sans">Refresh</span>
                    </>
                  )}
                </Button>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="font-sans">Add Product</span>
                </Button>
              </div>
            </div>

            {showProductForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New Product</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowProductForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                                            const categoriesToSend = newProductCategories.length
                        ? newProductCategories
                        : formData.getAll('category').map(c => c?.toString() || '').filter(Boolean);

                      // First create the product without images
                    const productData = {
                        name: formData.get('name')?.toString() || '',
                        description: formData.get('description')?.toString() || '',
                        price: parseFloat(formData.get('price')?.toString() || '0'),
                        // send categories as an array
                        category: categoriesToSend,
                        stockquantity: Math.max(0, parseInt(formData.get('stockQuantity')?.toString() || '0')),
                        instock: formData.get('instock') === 'true',
                        featured: formData.get('featured') === 'on',
                      };

                      // Create product first
                      const response = await api.post('/api/admin/products', productData);

                      if (response.status === 201) {
                        const createdProduct = response.data;

                        // Now upload images one by one
                        if (imageFiles.length > 0) {
                          await uploadImagesOneByOne(createdProduct.id, imageFiles);
                        }

                        // Refresh products list
                        const updatedProducts = await api.get('/api/admin/products');
                        const formattedUpdatedProducts = formatProductData(updatedProducts.data);
                        setProducts(formattedUpdatedProducts);

                        setShowProductForm(false);
                        setImageFiles([]);
                setNewProductCategories([]); 
                        toast({
                          title: "Success",
                          description: "Product created successfully with images",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error creating product:', error);
                      toast({
                        title: "Error",
                        description: "Failed to create product. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>

                    {/* Image Upload Section */}
                    <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <Label>Product Images (Upload up to 5)</Label>
                        <span className="text-sm text-muted-foreground">
                          {imageFiles.length}/5 images
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files;
                              if (!files || !files[0]) return;

                              const file = files[0];

                              // Check limit
                              if (imageFiles.length >= 5) {
                                toast({
                                  title: "Error",
                                  description: "Maximum 5 images allowed",
                                  variant: "destructive",
                                });
                                return;
                              }

                              try {
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    title: "Error",
                                    description: "Image must be less than 10MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                setIsLoading(true);
                                toast({
                                  title: "Processing",
                                  description: "Compressing image...",
                                });

                                const reader = new FileReader();
                                reader.onload = () => {
                                  setImageFiles(prev => [...prev, reader.result as string]);
                                  toast({
                                    title: "Success",
                                    description: `Image added (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
                                  });
                                };
                                reader.onerror = () => {
                                  toast({
                                    title: "Error",
                                    description: "Failed to read image",
                                    variant: "destructive",
                                  });
                                };
                                reader.readAsDataURL(file);
                              } catch (error) {
                                console.error('Error processing image:', error);
                                toast({
                                  title: "Error",
                                  description: "Failed to process image",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsLoading(false);
                              }

                              e.target.value = '';
                            }}
                          />

                          {imageFiles.length > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => setImageFiles([])}
                            >
                              Clear All
                            </Button>
                          )}
                        </div>

                        {/* Image Previews */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {imageFiles.map((image, index) => (
                            <div key={index} className="relative group aspect-square">
                              <div className="absolute inset-0 rounded-lg overflow-hidden border border-border">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                                {index + 1}
                              </span>
                            </div>
                          ))}

                          {imageFiles.length < 5 && (
                            <label className="aspect-square border-2 border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                  // Same upload logic as above
                                  const files = e.target.files;
                                  if (!files || !files[0]) return;

                                  const file = files[0];

                                  // Check limit
                                  if (imageFiles.length >= 5) {
                                    toast({
                                      title: "Error",
                                      description: "Maximum 5 images allowed",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  try {
                                    if (file.size > 10 * 1024 * 1024) {
                                      toast({
                                        title: "Error",
                                        description: "Image must be less than 10MB",
                                        variant: "destructive",
                                      });
                                      return;
                                    }

                                    setIsLoading(true);
                                    toast({
                                      title: "Processing",
                                      description: "Compressing image...",
                                    });

                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      setImageFiles(prev => [...prev, reader.result as string]);
                                      toast({
                                        title: "Success",
                                        description: `Image added (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
                                      });
                                    };
                                    reader.onerror = () => {
                                      toast({
                                        title: "Error",
                                        description: "Failed to read image",
                                        variant: "destructive",
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  } catch (error) {
                                    console.error('Error processing image:', error);
                                    toast({
                                      title: "Error",
                                      description: "Failed to process image",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setIsLoading(false);
                                  }

                                  e.target.value = '';
                                }}
                              />
                              <Plus className="h-6 w-6 text-primary/60" />
                              <span className="text-sm text-muted-foreground">Add Image</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rest of the form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-sans">Product Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="price" className="font-sans">Price</Label>
                        <Input id="price" name="price" type="number" step="0.01" min="0" required />
                      </div>
                    </div>

 <div>
                   <Label className="font-sans">Categories</Label>
                  <div className="flex gap-2 mt-2 items-center">
                    {/* Quick-select: choose a predefined category set */}
                    <Select value={selectedAllCategoryId} onValueChange={(val) => {
                      setSelectedAllCategoryId(val);
                      setSelectedAllCategoryItem('');
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select category set" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* When a category set is selected, show its grouped items in a second select */}
                    <Select value={selectedAllCategoryItem} onValueChange={(val) => setSelectedAllCategoryItem(val)}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select item to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAllCategoryId ? (
                          allCategories.find(c => c.id === selectedAllCategoryId)?.groups.flatMap(g => g.items).map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">Select a category set first</div>
                        )}
                      </SelectContent>
                    </Select>

                    <Button type="button" onClick={() => {
                      const v = selectedAllCategoryItem.trim();
                      if (!v) return;
                      if (!newProductCategories.includes(v)) {
                        setNewProductCategories(prev => [...prev, v]);
                      }
                      setSelectedAllCategoryItem('');
                    }}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-4"></div>
                    <div className="mt-4">
                      <Input
                        id="categoryInput"
                        value={typedCategory}
                        onChange={(e) => setTypedCategory(e.target.value)}
                        placeholder="Type category and press Add or Enter"
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') return;
                          e.preventDefault();
                          const v = typedCategory.trim();
                          if (!v) return;
                          if (!newProductCategories.includes(v)) {
                            setNewProductCategories(prev => [...prev, v]);
                          }
                          setTypedCategory('');
                        }}
                      />
                         <div className="mt-4"></div>
                      <Button
                        type="button"
                        onClick={() => {
                          const v = typedCategory.trim();
                          if (!v) return;
                          if (!newProductCategories.includes(v)) {
                            setNewProductCategories(prev => [...prev, v]);
                          }
                          setTypedCategory('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                      </div>

                    
                      <div className="flex gap-2 flex-wrap mt-3">
                        {newProductCategories.map((cat) => (
                          <div key={cat} className="inline-flex items-center gap-2 bg-muted/20 px-2 py-1 rounded">
                            <span className="text-sm">{cat}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setNewProductCategories(prev => prev.filter(c => c !== cat))}
                              title="Remove category"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {/* keep hidden input so FormData includes categories (legacy handling) */}
                            <input type="hidden" name="category" value={cat} />
                          </div>
                        ))}
                      </div>
                  

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input id="stockQuantity" name="stockQuantity" type="number" min="0" required />
                      </div>
                      <div>
                        <Label htmlFor="instock">Stock Status</Label>
                        <Select name="instock" defaultValue="true">
                          <SelectTrigger>
                            <SelectValue placeholder="Select stock status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">In Stock</SelectItem>
                            <SelectItem value="false">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="font-sans">Description</Label>
                      <Textarea id="description" name="description" required className="font-sans" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="featured" name="featured" />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading} className="font-sans">
                        {isLoading ? "Creating Product..." : "Create Product"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowProductForm(false)} className="font-sans">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product List</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.length} {products.length === 1 ? 'product' : 'products'} total
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {isProductsLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground font-sans">Loading products...</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products && Array.isArray(products) && products.map((product) => (
                      <div
                        key={product?.id || Math.random()}
                        className="group relative bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden relative">
                          {product.image ? (
                            <img
                              src={product.image.startsWith('data:') ? product.image : `data:image/jpeg;base64,${product.image}`}
                              alt={product.name || 'Product'}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                          )}

                          {/* Quick Action Buttons Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="View Details"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="Edit Product"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="Delete Product"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                            <Badge
                              variant={product.instock ? "default" : "destructive"}
                              className="shadow-sm"
                            >
                              {product.instock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.featured && (
                              <Badge variant="secondary" className="shadow-sm">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium line-clamp-2 font-sans">{product.name || 'Unnamed Product'}</h3>
                            <p className="font-bold text-lg font-sans">₹{product.price || 0}</p>
                          </div>
                              <div className="sm:col-span-3 text-sm lg:text-base">
                                {(() => {
                                  const cats = getCategoryArray(product.category);
                                  return cats.length ? <CategoryList cats={cats} maxVisible={3} /> : 'N/A';
                                })()}
                              </div>
                              {/* Product description with toggle */}
                              <DescriptionWithToggle description={product.description} maxLines={2} />
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Stock: {product.stockquantity || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {product.id ? product.id.slice(0, 8) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {products.length === 0 && !isProductsLoading && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-sans">No products found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Order Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {lastRefreshTime ? String(lastRefreshTime.toLocaleTimeString()) : 'Never'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={refreshOrders}
                disabled={isOrdersLoading}
              >
                {isOrdersLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {isOrdersLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Loading orders...</p>
                      </div>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg bg-card hover:shadow-lg transition-all duration-200"
                      >
                        {/* Order Header */}
                        <div className="p-4 border-b border-border bg-muted/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold font-sans">Order #{order.ordernumber}</h3>
                              <p className="text-sm text-muted-foreground font-sans">{order.customername}</p>
                            </div>
                            <Badge
                              variant={
                                order.status === 'completed' ? 'default' :
                                  order.status === 'pending' ? 'secondary' :
                                    order.status === 'cancelled' ? 'destructive' :
                                      order.status === 'delivered' ? 'default' :
                                        'outline'
                              }
                              className="ml-2"
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.createdat ? String(new Date(order.createdat).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })) : 'Unknown date'}
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-4">
                          <div className="space-y-3 mb-4">
                            {/* Order Items */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Order Items ({(order.items && Array.isArray(order.items)) ? order.items.length : 0})</h4>
                              {(order.items && Array.isArray(order.items) && order.items.length > 0) ? (
                                <div className="space-y-1">
                                  {order.items.slice(0, 2).map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="truncate flex-1 mr-2">{item.productName || 'Unknown Product'}</span>
                                      <span className="text-muted-foreground">
                                        {item.quantity || 0}x ₹{item.unitPrice || 0}
                                      </span>
                                    </div>
                                  ))}
                                  {order.items && order.items.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{order.items.length - 2} more items
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No items</p>
                              )}
                            </div>

                            {/* Order Total */}
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold text-lg font-sans">₹{order.total}</span>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{order.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {order.phone}
                            </p>
                            <p className="text-xs">
                              Payment: {order.paymentmethod} | {order.paymentstatus}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsViewOrderModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsEditOrderModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* View Order Details Modal */}
            <Dialog open={isViewOrderModalOpen} onOpenChange={setIsViewOrderModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                  <DialogDescription>
                    Complete information about order #{selectedOrder?.ordernumber}
                  </DialogDescription>
                </DialogHeader>

                {selectedOrder && (
                  <div className="space-y-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Order #{selectedOrder.ordernumber}
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedOrder.createdat ? String(new Date(selectedOrder.createdat).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })) : 'Unknown date'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            selectedOrder.status === 'completed' ? 'default' :
                              selectedOrder.status === 'pending' ? 'secondary' :
                                selectedOrder.status === 'cancelled' ? 'destructive' :
                                  selectedOrder.status === 'delivered' ? 'default' :
                                    'outline'
                          }
                          className="mb-2"
                        >
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                        <p className="text-xl font-bold">₹{selectedOrder.total}</p>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm text-muted-foreground">Name</dt>
                              <dd className="font-medium">{selectedOrder.customername}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Email</dt>
                              <dd className="break-all">{selectedOrder.email}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Phone</dt>
                              <dd>{selectedOrder.phone}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Delivery Address</dt>
                              <dd className="text-sm">{selectedOrder.deliveryaddress}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      {/* Payment Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm text-muted-foreground">Payment Method</dt>
                              <dd className="font-medium">{selectedOrder.paymentmethod}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Payment Status</dt>
                              <dd>
                                <Badge variant={selectedOrder.paymentstatus === 'pending' ? 'secondary' : 'default'}>
                                  {selectedOrder.paymentstatus}
                                </Badge>
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Subtotal</dt>
                              <dd>₹{selectedOrder.subtotal}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Delivery Charge</dt>
                              <dd>₹{selectedOrder.deliverycharge}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Discount</dt>
                              <dd>₹{selectedOrder.discountamount}</dd>
                            </div>
                            <div className="pt-2 border-t">
                              <dt className="text-sm text-muted-foreground">Total Amount</dt>
                              <dd className="text-xl font-bold">₹{selectedOrder.total}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Order Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          <div className="space-y-4">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.productName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × ₹{item.unitPrice}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">₹{item.totalPrice}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No items in this order</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Additional Information */}
                    {(selectedOrder.occasion || selectedOrder.requirements) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            {selectedOrder.occasion && (
                              <div>
                                <dt className="text-sm text-muted-foreground">Occasion</dt>
                                <dd>{selectedOrder.occasion}</dd>
                              </div>
                            )}
                            {selectedOrder.requirements && (
                              <div>
                                <dt className="text-sm text-muted-foreground">Special Requirements</dt>
                                <dd>{selectedOrder.requirements}</dd>
                              </div>
                            )}
                          </dl>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewOrderModalOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Order Status Modal */}
            <Dialog open={isEditOrderModalOpen} onOpenChange={setIsEditOrderModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Order Status</DialogTitle>
                  <DialogDescription>
                    Change the status of order #{selectedOrder?.ordernumber}
                  </DialogDescription>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label>Current Status</Label>
                      <Badge
                        variant={
                          selectedOrder.status === 'completed' ? 'default' :
                            selectedOrder.status === 'pending' ? 'secondary' :
                              selectedOrder.status === 'cancelled' ? 'destructive' :
                                selectedOrder.status === 'delivered' ? 'default' :
                                  'outline'
                        }
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>New Status</Label>
                      <Select
                        defaultValue={selectedOrder.status}
                        onValueChange={async (value) => {
                          if (!selectedOrder) return;
                          try {
                            setIsLoading(true);
                            // Update order status using the correct endpoint and ID field
                            const response = await api.put(`/api/admin/orders/${selectedOrder.id}/status`, {
                              status: value
                            });

                            if (response.status === 200) {
                              // Update orders list with new status
                              setOrders(orders.map(o =>
                                o.id === selectedOrder.id
                                  ? { ...o, status: value }
                                  : o
                              ));

                              setIsEditOrderModalOpen(false);

                              toast({
                                title: "Status Updated",
                                description: `Order status changed to ${value}`,
                                variant: "default",
                              });
                            }
                          } catch (error) {
                            console.error('Error updating status:', error);
                            toast({
                              title: "Error",
                              description: "Failed to update order status",
                              variant: "destructive",
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOrderModalOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      case "classes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Class Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage courses and educational programs
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshClasses}
                  disabled={isClassesLoading}
                >
                  {isClassesLoading ? "Refreshing..." : "Refresh"}
                </Button>
                <Button onClick={() => setShowClassForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Class
                </Button>
              </div>
            </div>

            {showClassForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Class</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowClassForm(false);
                      setClassImageFile(''); // Clear image state
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      // Parse features from textarea
                      const featuresText = formData.get('features')?.toString() || '';
                      const featuresArray = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

                      const classData = {
                        title: formData.get('title')?.toString() || '',
                        description: formData.get('description')?.toString() || '',
                        price: parseFloat(formData.get('price')?.toString() || '0'),
                        duration: formData.get('duration')?.toString() || '',
                        sessions: parseInt(formData.get('sessions')?.toString() || '1'),
                        features: featuresArray,
                        nextbatch: formData.get('nextbatch')?.toString() || '',
                        category: formData.get('category')?.toString() || 'General',
                        image: classImageFile || null // Use base64 image
                      };
                      console.log('Creating class with data:', classData);
                      const response = await api.post('/api/admin/AdminClasses/Add', classData);
                      if (response.status === 201) {
                        // Refresh classes list
                        const updatedClasses = await api.get('/api/admin/AdminClasses');
                        const formattedClasses = Array.isArray(updatedClasses.data) ?
                          updatedClasses.data.map(cls => {
                            let features = cls.features;
                            if (typeof features === 'string') {
                              try {
                                features = JSON.parse(features);
                              } catch {
                                features = [];
                              }
                            }
                            return {
                              ...cls,
                              features: Array.isArray(features) ? features : [],
                              price: parseFloat(cls.price) || 0,
                              sessions: parseInt(cls.sessions) || 0
                            };
                          }) : [];
                        setClasses(formattedClasses);

                        setShowClassForm(false);
                        setClassImageFile(''); // Clear uploaded image
                        e.currentTarget.reset();

                        toast({
                          title: "Success",
                          description: "Class created successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error creating class:', error);
                      toast({
                        title: "Error",
                        description: "Failed to create class. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Class Title</Label>
                        <Input id="title" name="title" placeholder="Enter class title" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Masterclass">Masterclass</SelectItem>
                            <SelectItem value="Professional Courses">Professional Courses</SelectItem>
                            <SelectItem value="Special Workshops">Special Workshops</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="2500" required />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" name="duration" placeholder="3 hours" required />
                      </div>
                      <div>
                        <Label htmlFor="sessions">Number of Sessions</Label>
                        <Input id="sessions" name="sessions" type="number" min="1" placeholder="4" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nextbatch">Next Batch Date</Label>
                      <Input id="nextbatch" name="nextbatch" type="date" required />
                    </div>

                    <div>
                      <Label htmlFor="description">Class Description</Label>
                      <Textarea id="description" name="description" placeholder="Describe what students will learn..." rows={4} required />
                    </div>

                    <div>
                      <Label htmlFor="features">Features (one per line)</Label>
                      <Textarea
                        id="features"
                        name="features"
                        placeholder={`Professional certificate\nHands-on practice\nTake-home materials\nLifetime support`}
                        rows={4}
                      />
                    </div>

                    {/* Class Image Upload Section */}
                    <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <Label>Class Image (Optional)</Label>
                        <span className="text-sm text-muted-foreground">
                          {classImageFile ? '1 image uploaded' : 'No image selected'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files;
                              if (!files || !files[0]) return;

                              const file = files[0];

                              try {
                                setIsLoading(true);

                                // Check file size (limit to 5MB)
                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: "File too large",
                                    description: "Please select an image smaller than 5MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                // Compress and convert to base64
                                const reader = new FileReader();
                                reader.onload = () => {
                                  // Remove data URL prefix for base64 only if needed
                                  const result = reader.result as string;
                                  const base64Data = result.split('base64,')[1] || result;
                                  setClassImageFile(base64Data);
                                  toast({
                                    title: "Image uploaded",
                                    description: `Image size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
                                    variant: "default",
                                  });
                                };
                                reader.onerror = () => {
                                  toast({
                                    title: "Upload failed",
                                    description: "Failed to process image. Please try again.",
                                    variant: "destructive",
                                  });
                                };
                                reader.readAsDataURL(file);
                              } catch (error) {
                                console.error('Error processing image:', error);
                                toast({
                                  title: "Upload failed",
                                  description: "Failed to process image. Please try again.",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsLoading(false);
                              }

                              e.target.value = '';
                            }}
                          />

                          {classImageFile && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setClassImageFile('');
                                toast({
                                  title: "Image removed",
                                  description: "Class image has been removed",
                                });
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        {/* Image Preview */}
                        {classImageFile && (
                          <div className="relative">
                            <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
                              <img
                                src={`data:image/png;base64,${classImageFile}`}
                                alt="Class preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Size: {getBase64Size(classImageFile).toFixed(2)}MB
                            </p>
                          </div>
                        )}

                        {!classImageFile && (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Upload a class image (optional)
                            </p>
                            <p className="text-xs text-muted-foreground/75 mt-1">
                              Supports JPG, PNG. Max 5MB.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Class"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowClassForm(false);
                        setClassImageFile(''); // Clear image state
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Classes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isClassesLoading ? "Loading classes..." : `${classes.length} ${classes.length === 1 ? 'class' : 'classes'} total`}
                </p>
              </CardHeader>
              <CardContent>
                {isClassesLoading ? (
                  <div className="flex items-center justify-center h-32 gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading classes...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes && Array.isArray(classes) && classes.length > 0 ? classes.map((cls) => {
                      if (!cls || typeof cls !== 'object') return null;

                      return (
                        <div
                          key={cls?.id || Math.random()}
                          className="border rounded-lg bg-card hover:shadow-lg transition-all duration-200"
                        >
                          {/* Class Image */}
                          <div className="aspect-video overflow-hidden relative rounded-t-lg">
                            {cls.image ? (
                              <img
                                src={`data:image/png;base64,${cls.image}`}
                                alt={cls.title}
                                className="w-full h-full object-cover"
                              />

                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="shadow-sm">
                                {cls.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Class Content */}
                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-2 font-sans">{cls.title || 'Untitled Class'}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 font-sans">{cls.description || 'No description available'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Price:</span> ₹{cls.price || 0}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {cls.duration || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Sessions:</span> {cls.sessions || 0}
                              </div>
                              <div>
                                <span className="font-medium">Next Batch:</span>
                                <span className="text-xs block">{cls.nextbatch ? String(new Date(cls.nextbatch).toLocaleDateString()) : 'Not scheduled'}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClass(cls);
                                  setIsViewClassModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClass(cls);
                                  setEditClassImageFile(''); // Reset edit image state
                                  setIsEditClassModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClass(cls);
                                  setIsDeleteClassModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full flex flex-col items-center justify-center h-32 gap-2">
                        <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No classes found</p>
                        <Button variant="outline" size="sm" onClick={() => setShowClassForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Class
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>            {/* View Class Details Modal */}
            <Dialog open={isViewClassModalOpen} onOpenChange={setIsViewClassModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Class Details</DialogTitle>
                </DialogHeader>
                {selectedClass && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Title:</strong> {selectedClass.title || 'N/A'}
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedClass.category || 'N/A'}
                      </div>
                      <div>
                        <strong>Price:</strong> ₹{selectedClass.price || 0}
                      </div>
                      <div>
                        <strong>Duration:</strong> {selectedClass.duration || 'N/A'}
                      </div>
                      <div>
                        <strong>Sessions:</strong> {selectedClass.sessions || 0}
                      </div>
                      <div>
                        <strong>Next Batch:</strong> {selectedClass.nextbatch ? String(new Date(selectedClass.nextbatch).toLocaleDateString()) : 'Not scheduled'}
                      </div>
                    </div>
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedClass.description || 'No description available'}</p>
                    </div>
                    {selectedClass.features && Array.isArray(selectedClass.features) && selectedClass.features.length > 0 && (
                      <div>
                        <strong>Features:</strong>
                        <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
                          {selectedClass.features.map((feature, index) => (
                            <li key={index}>{String(feature)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setIsViewClassModalOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Class Modal */}
            <Dialog open={isEditClassModalOpen} onOpenChange={setIsEditClassModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Class</DialogTitle>
                </DialogHeader>
                {selectedClass && (
                  <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      // Parse features from textarea
                      const featuresText = formData.get('features')?.toString() || '';
                      const featuresArray = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

                      const updateData = {
                        title: formData.get('title')?.toString() || '',
                        description: formData.get('description')?.toString() || '',
                        price: parseFloat(formData.get('price')?.toString() || '0'),
                        duration: formData.get('duration')?.toString() || '',
                        sessions: parseInt(formData.get('sessions')?.toString() || '1'),
                        features: featuresArray,
                        nextbatch: formData.get('nextbatch')?.toString() || '',
                        category: formData.get('category')?.toString() || 'General',
                        image: editClassImageFile || selectedClass.image || null // Use new base64 image or keep existing
                      };

                      console.log('Updating class with data:', updateData);

                      const response = await api.put(`/api/admin/AdminClasses/${selectedClass.id}`, updateData);

                      if (response.status === 200) {
                        // Refresh classes list
                        const updatedClasses = await api.get('/api/admin/AdminClasses');
                        const formattedClasses = Array.isArray(updatedClasses.data) ?
                          updatedClasses.data.map(cls => {
                            let features = cls.features;
                            if (typeof features === 'string') {
                              try {
                                features = JSON.parse(features);
                              } catch {
                                features = [];
                              }
                            }
                            return {
                              ...cls,
                              features: Array.isArray(features) ? features : [],
                              price: parseFloat(cls.price) || 0,
                              sessions: parseInt(cls.sessions) || 0
                            };
                          }) : [];
                        setClasses(formattedClasses);

                        setIsEditClassModalOpen(false);
                        setEditClassImageFile(''); // Clear edit image state
                        setSelectedClass(null);

                        toast({
                          title: "Success",
                          description: "Class updated successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error updating class:', error);
                      toast({
                        title: "Error",
                        description: "Failed to update class. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-title">Class Title</Label>
                          <Input
                            id="edit-title"
                            name="title"
                            placeholder="Enter class title"
                            defaultValue={selectedClass.title || ''}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">Category</Label>
                          <Select name="category" defaultValue={selectedClass.category || 'General'}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Workshop">Workshop</SelectItem>
                              <SelectItem value="Masterclass">Masterclass</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="edit-price">Price (₹)</Label>
                          <Input
                            id="edit-price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="2500"
                            defaultValue={selectedClass.price || ''}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-duration">Duration</Label>
                          <Input
                            id="edit-duration"
                            name="duration"
                            placeholder="3 hours"
                            defaultValue={selectedClass.duration || ''}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-sessions">Number of Sessions</Label>
                          <Input
                            id="edit-sessions"
                            name="sessions"
                            type="number"
                            min="1"
                            placeholder="4"
                            defaultValue={selectedClass.sessions || ''}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="edit-nextbatch">Next Batch Date</Label>
                        <Input
                          id="edit-nextbatch"
                          name="nextbatch"
                          type="date"
                          defaultValue={selectedClass.nextbatch ? new Date(selectedClass.nextbatch).toISOString().split('T')[0] : ''}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-description">Class Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          placeholder="Describe what students will learn..."
                          rows={4}
                          defaultValue={selectedClass.description || ''}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-features">Features (one per line)</Label>
                        <Textarea
                          id="edit-features"
                          name="features"
                          placeholder="Professional certificate\nHands-on practice\nTake-home materials\nLifetime support"
                          rows={4}
                          defaultValue={Array.isArray(selectedClass.features) ? selectedClass.features.join('\n') : ''}
                        />
                      </div>

                      {/* Edit Class Image Upload Section */}
                      <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                        <div className="flex items-center justify-between">
                          <Label>Class Image (Optional)</Label>
                          <span className="text-sm text-muted-foreground">
                            {editClassImageFile || selectedClass.image ? '1 image uploaded' : 'No image selected'}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              className="flex-1"
                              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                const files = e.target.files;
                                if (!files || !files[0]) return;

                                const file = files[0];

                                try {
                                  setIsLoading(true);

                                  // Check file size (limit to 5MB)
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast({
                                      title: "File too large",
                                      description: "Please select an image smaller than 5MB",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  // Compress and convert to base64
                                  const compressedImage = await compressImage(file, 0.1);
                                  const base64Data = compressedImage.split('base64,')[1] || compressedImage;

                                  // Check final size
                                  const sizeInMB = getBase64Size(base64Data);
                                  if (sizeInMB > 0.1) {
                                    toast({
                                      title: "Image still too large",
                                      description: `Compressed image is ${sizeInMB.toFixed(2)}MB. Please try a smaller image.`,
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  setEditClassImageFile(base64Data);

                                  toast({
                                    title: "Image uploaded",
                                    description: `Image compressed to ${sizeInMB.toFixed(2)}MB`,
                                    variant: "default",
                                  });
                                } catch (error) {
                                  console.error('Error processing image:', error);
                                  toast({
                                    title: "Upload failed",
                                    description: "Failed to process image. Please try again.",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setIsLoading(false);
                                }

                                e.target.value = '';
                              }}
                            />

                            {(editClassImageFile || selectedClass.image) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditClassImageFile('');
                                  toast({
                                    title: "Image removed",
                                    description: "Class image has been removed",
                                  });
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          {/* Image Preview */}
                          {(editClassImageFile || selectedClass.image) && (
                            <div className="relative">
                              <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
                                <img
                                  src={`data:image/png;base64,${editClassImageFile || selectedClass.image}`}
                                  alt="Class preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {editClassImageFile
                                  ? `Size: ${getBase64Size(editClassImageFile).toFixed(2)}MB`
                                  : 'Current image'
                                }
                              </p>
                            </div>
                          )}

                          {!editClassImageFile && !selectedClass.image && (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Upload a class image (optional)
                              </p>
                              <p className="text-xs text-muted-foreground/75 mt-1">
                                Supports JPG, PNG. Max 5MB.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsEditClassModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Class"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Class Modal */}
            <Dialog open={isDeleteClassModalOpen} onOpenChange={setIsDeleteClassModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Class</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this class? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                {selectedClass && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted">
                      <h3 className="font-semibold">{selectedClass.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedClass.category} • ₹{selectedClass.price}</p>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteClassModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!selectedClass?.id) return;

                      setIsLoading(true);
                      try {
                        console.log('Deleting class with ID:', selectedClass.id);

                        const response = await api.delete(`/api/admin/AdminClasses/${selectedClass.id}`);

                        if (response.status === 200) {
                          // Refresh classes list
                          const updatedClasses = await api.get('/api/admin/AdminClasses');
                          const formattedClasses = Array.isArray(updatedClasses.data) ?
                            updatedClasses.data.map(cls => {
                              let features = cls.features;
                              if (typeof features === 'string') {
                                try {
                                  features = JSON.parse(features);
                                } catch {
                                  features = [];
                                }
                              }
                              return {
                                ...cls,
                                features: Array.isArray(features) ? features : [],
                                price: parseFloat(cls.price) || 0,
                                sessions: parseInt(cls.sessions) || 0
                              };
                            }) : [];
                          setClasses(formattedClasses);

                          setIsDeleteClassModalOpen(false);
                          setSelectedClass(null);

                          toast({
                            title: "Success",
                            description: "Class deleted successfully",
                            variant: "default",
                          });
                        }
                      } catch (error) {
                        console.error('Error deleting class:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete class. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "event-class-enrollments":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-sans">Event & Class Enrollments</h2>
                <p className="text-sm text-muted-foreground">Manage enrollment data</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchEventClassEnrollments}
                disabled={isEventClassEnrollmentsLoading}
              >
                {isEventClassEnrollmentsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900 mr-1"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            {/* Event Enrollments Section */}
            <Card className="compact">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-4 w-4" />
                  Event Enrollments ({eventEnrollments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isEventClassEnrollmentsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : eventEnrollments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No event enrollments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs lg:text-sm min-w-[500px]">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left p-2 lg:p-3 font-medium font-sans">Email</th>
                          <th className="text-left p-2 lg:p-3 font-medium font-sans">Event Title</th>
                          <th className="text-left p-2 lg:p-3 font-medium font-sans">Event Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventEnrollments.map((enrollment, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="p-2 lg:p-3">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate max-w-[150px] lg:max-w-[200px]">{enrollment.email}</span>
                              </div>
                            </td>
                            <td className="p-2 lg:p-3 font-medium truncate max-w-[120px] lg:max-w-[180px]">{enrollment.event_title}</td>
                            <td className="p-2 lg:p-3 text-muted-foreground text-xs lg:text-sm">{enrollment.event_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class Enrollments Section */}
            <Card className="compact">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-4 w-4" />
                  Class Enrollments ({classEnrollments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isEventClassEnrollmentsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : classEnrollments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No class enrollments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs lg:text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left p-2 lg:p-3 font-medium">Name</th>
                          <th className="text-left p-2 lg:p-3 font-medium">Email</th>
                          <th className="text-left p-2 lg:p-3 font-medium">Phone</th>
                          <th className="text-left p-2 lg:p-3 font-medium">Course</th>
                          <th className="text-left p-2 lg:p-3 font-medium">Batch</th>
                          <th className="text-left p-2 lg:p-3 font-medium">Questions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classEnrollments.map((enrollment, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="p-2 lg:p-3 font-medium truncate max-w-[100px] lg:max-w-[120px]">{enrollment.name}</td>
                            <td className="p-2 lg:p-3">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate max-w-[120px] lg:max-w-[150px]">{enrollment.email}</span>
                              </div>
                            </td>
                            <td className="p-2 lg:p-3">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate max-w-[80px] lg:max-w-[100px]">{enrollment.phone}</span>
                              </div>
                            </td>
                            <td className="p-2 truncate max-w-[140px]">{enrollment.course_title}</td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs px-2 py-1">{enrollment.batch}</Badge>
                            </td>
                            <td className="p-2 text-xs text-muted-foreground max-w-[150px] truncate">
                              {enrollment.status_question || 'No questions'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-sans">Student Feedback Management</h1>
              <Button onClick={() => setShowFeedbackForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Feedback
              </Button>
            </div>

            {showFeedbackForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New Student Feedback</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowFeedbackForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);
                      const feedbackData = {
                        student_name: formData.get('student_name')?.toString() || '',
                        course_name: formData.get('course_name')?.toString() || '',
                        feedback_text: formData.get('feedback_text')?.toString() || '',
                        rating: parseInt(formData.get('rating')?.toString() || '5'),
                      };

                      const response = await api.post('/api/student-feedback', feedbackData);
                      if (response.status === 201) {
                        setStudentFeedback([response.data.data, ...studentFeedback]);
                        setShowFeedbackForm(false);
                        // Reset form
                        e.currentTarget.reset();
                        toast({
                          title: "Success",
                          description: "Student feedback added successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error adding feedback:', error);
                      toast({
                        title: "Error",
                        description: "Failed to add feedback. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="student_name">Student Name</Label>
                        <Input
                          id="student_name"
                          name="student_name"
                          placeholder="Enter student name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="course_name">Course Name</Label>
                        <Input
                          id="course_name"
                          name="course_name"
                          placeholder="Enter course name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select name="rating" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                          <SelectItem value="4">4 Stars - Very Good</SelectItem>
                          <SelectItem value="3">3 Stars - Good</SelectItem>
                          <SelectItem value="2">2 Stars - Fair</SelectItem>
                          <SelectItem value="1">1 Star - Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="feedback_text">Feedback</Label>
                      <Textarea
                        id="feedback_text"
                        name="feedback_text"
                        placeholder="Enter student feedback..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Feedback"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFeedbackForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Student Feedback List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {studentFeedback.length} {studentFeedback.length === 1 ? 'feedback' : 'feedback entries'} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border rounded-lg p-4 bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{feedback.student_name}</h3>
                          <p className="text-sm text-muted-foreground">{feedback.course_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < feedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-muted-foreground">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setIsDeleteFeedbackModalOpen(true);
                            }}
                            title="Delete Feedback"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-2 font-sans">
                        "{feedback.feedback_text}"
                      </p>

                      {feedback.created_at && (
                        <p className="text-xs text-muted-foreground">
                          Added on {String(new Date(feedback.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }))}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {studentFeedback.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No student feedback found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Feedback Confirmation Modal */}
            <Dialog open={isDeleteFeedbackModalOpen} onOpenChange={setIsDeleteFeedbackModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Student Feedback</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the feedback from {selectedFeedback?.student_name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteFeedbackModalOpen(false);
                      setSelectedFeedback(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    onClick={async () => {
                      if (!selectedFeedback) return;

                      setIsLoading(true);
                      try {
                        await api.delete(`/api/student-feedback/${selectedFeedback.id}`);
                        setStudentFeedback(studentFeedback.filter(f => f.id !== selectedFeedback.id));
                        setIsDeleteFeedbackModalOpen(false);
                        setSelectedFeedback(null);

                        toast({
                          title: "Success",
                          description: "Student feedback deleted successfully",
                        });
                      } catch (error) {
                        console.error('Error deleting student feedback:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete feedback. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "status-feedback":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-sans">Status Feedback Management</h1>
              <Button onClick={() => setShowStatusFeedbackForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Status Feedback
              </Button>
            </div>

            {showStatusFeedbackForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New Status Feedback</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowStatusFeedbackForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);
                      const feedbackData = {
                        title: formData.get('title')?.toString() || '',
                        status: formData.get('status')?.toString() || '',
                        description: formData.get('description')?.toString() || '',
                        priority: formData.get('priority')?.toString() || 'medium',
                        assigned_to: formData.get('assigned_to')?.toString() || '',
                        created_by: formData.get('created_by')?.toString() || '',
                      };

                      const response = await api.post('/api/status-feedback', feedbackData);
                      if (response.status === 201) {
                        setStatusFeedback([response.data.data, ...statusFeedback]);
                        setShowStatusFeedbackForm(false);
                        e.currentTarget.reset();
                        toast({
                          title: "Success",
                          description: "Status feedback added successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error adding status feedback:', error);
                      toast({
                        title: "Error",
                        description: "Failed to add status feedback. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter feedback title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="assigned_to">Assigned To</Label>
                        <Input
                          id="assigned_to"
                          name="assigned_to"
                          placeholder="Enter assignee name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="created_by">Created By</Label>
                      <Input
                        id="created_by"
                        name="created_by"
                        placeholder="Enter creator name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter detailed description..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Feedback"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowStatusFeedbackForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Status Feedback List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {statusFeedback.length} {statusFeedback.length === 1 ? 'feedback' : 'feedback entries'} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border rounded-lg p-4 bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{feedback.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge
                              variant={
                                feedback.status === 'completed' ? 'default' :
                                  feedback.status === 'in-progress' ? 'secondary' :
                                    feedback.status === 'on-hold' ? 'outline' :
                                      feedback.status === 'cancelled' ? 'destructive' :
                                        'secondary'
                              }
                            >
                              {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                            </Badge>
                            <Badge
                              variant={
                                feedback.priority === 'urgent' ? 'destructive' :
                                  feedback.priority === 'high' ? 'destructive' :
                                    feedback.priority === 'medium' ? 'secondary' :
                                      'outline'
                              }
                            >
                              {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setSelectedStatusFeedback(feedback);
                              setIsEditStatusModalOpen(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this status feedback?')) {
                                try {
                                  await api.delete(`/api/status-feedback/${feedback.id}`);
                                  setStatusFeedback(statusFeedback.filter(f => f.id !== feedback.id));
                                  toast({
                                    title: "Success",
                                    description: "Status feedback deleted successfully",
                                    variant: "default",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete status feedback",
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                            title="Delete Feedback"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-3">
                        {feedback.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <strong>Assigned to:</strong> {feedback.assigned_to}
                        </div>
                        <div>
                          <strong>Created by:</strong> {feedback.created_by}
                        </div>
                      </div>

                      {feedback.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Created on {String(new Date(feedback.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }))}
                        </p>
                      )}
                    </div>
                  ))}

                  {statusFeedback.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No status feedback found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* View Details Modal - Only for viewing, no editing */}
            <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Status Feedback Details</DialogTitle>
                  <DialogDescription>
                    Complete information about this status feedback entry
                  </DialogDescription>
                </DialogHeader>
                {selectedStatusFeedback && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                        <p className="text-sm">{selectedStatusFeedback.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <p className="text-sm">
                          <Badge variant={
                            selectedStatusFeedback.status === 'completed' ? 'default' :
                              selectedStatusFeedback.status === 'in-progress' ? 'secondary' :
                                selectedStatusFeedback.status === 'on-hold' ? 'outline' :
                                  selectedStatusFeedback.status === 'cancelled' ? 'destructive' :
                                    'secondary'
                          }>
                            {selectedStatusFeedback.status.charAt(0).toUpperCase() + selectedStatusFeedback.status.slice(1)}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                        <p className="text-sm">
                          <Badge variant={
                            selectedStatusFeedback.priority === 'urgent' ? 'destructive' :
                              selectedStatusFeedback.priority === 'high' ? 'destructive' :
                                selectedStatusFeedback.priority === 'medium' ? 'secondary' :
                                  'outline'
                          }>
                            {selectedStatusFeedback.priority.charAt(0).toUpperCase() + selectedStatusFeedback.priority.slice(1)}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                        <p className="text-sm">{selectedStatusFeedback.assigned_to}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                      <p className="text-sm">{selectedStatusFeedback.created_by}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-sm leading-relaxed">{selectedStatusFeedback.description}</p>
                    </div>
                    {selectedStatusFeedback.created_at && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                        <p className="text-sm">
                          {String(new Date(selectedStatusFeedback.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }))}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditStatusModalOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "office-timing":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-sans">Office Hours Management</h1>
              <Button onClick={() => setShowOfficeTimingForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Office Hours
              </Button>
            </div>

            {showOfficeTimingForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add Office Hours</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowOfficeTimingForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);
                      const timingData = {
                        office_day: formData.get('office_day')?.toString() || '',
                        open_time: formData.get('open_time')?.toString() || '',
                        close_time: formData.get('close_time')?.toString() || '',
                        is_holiday: formData.get('is_holiday') === 'on',
                      };

                      const response = await api.post('/api/admin/office-timing', timingData);
                      if (response.data.success) {
                        setOfficeTimings([...officeTimings, response.data.data]);
                        setShowOfficeTimingForm(false);
                        e.currentTarget.reset();
                        toast({
                          title: "Success",
                          description: "Office hours added successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error adding office timing:', error);
                      toast({
                        title: "Error",
                        description: "Failed to add office hours. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="office_day">Day of Week</Label>
                        <Select name="office_day" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          id="is_holiday"
                          name="is_holiday"
                        />
                        <Label htmlFor="is_holiday">Holiday (Closed)</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="open_time">Opening Time</Label>
                        <Input
                          id="open_time"
                          name="open_time"
                          type="time"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="close_time">Closing Time</Label>
                        <Input
                          id="close_time"
                          name="close_time"
                          type="time"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Office Hours"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowOfficeTimingForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Office Hours List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {officeTimings.length} {officeTimings.length === 1 ? 'day' : 'days'} configured
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officeTimings.map((timing) => (
                    <div
                      key={timing.id}
                      className="border rounded-lg p-4 bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{timing.office_day}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            {timing.is_holiday ? (
                              <Badge variant="destructive">Closed</Badge>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                {formatTime(timing.open_time)} - {formatTime(timing.close_time)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setSelectedOfficeTiming(timing);
                              setIsEditOfficeTimingModalOpen(true);
                            }}
                            title="Edit Office Hours"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setSelectedOfficeTiming(timing);
                              setIsDeleteOfficeTimingModalOpen(true);
                            }}
                            title="Delete Office Hours"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {officeTimings.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <Clock className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No office hours configured</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Edit Office Timing Modal */}
            <Dialog open={isEditOfficeTimingModalOpen} onOpenChange={setIsEditOfficeTimingModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Office Hours</DialogTitle>
                  <DialogDescription>
                    Update the office hours for {selectedOfficeTiming?.office_day}
                  </DialogDescription>
                </DialogHeader>
                {selectedOfficeTiming && (
                  <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);
                      const updates = {
                        office_day: formData.get('office_day')?.toString() || '',
                        open_time: formData.get('open_time')?.toString() || '',
                        close_time: formData.get('close_time')?.toString() || '',
                        is_holiday: formData.get('is_holiday') === 'on',
                      };

                      const response = await api.put(`/api/admin/office-timing/${selectedOfficeTiming.id}`, updates);
                      if (response.data.success) {
                        setOfficeTimings(officeTimings.map(t =>
                          t.id === selectedOfficeTiming.id ? response.data.data : t
                        ));
                        setIsEditOfficeTimingModalOpen(false);
                        toast({
                          title: "Success",
                          description: "Office hours updated successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error updating office timing:', error);
                      toast({
                        title: "Error",
                        description: "Failed to update office hours",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit_office_day" className="text-right">Day</Label>
                        <Select name="office_day" defaultValue={selectedOfficeTiming.office_day}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit_open_time" className="text-right">Open</Label>
                        <Input
                          id="edit_open_time"
                          name="open_time"
                          type="time"
                          defaultValue={selectedOfficeTiming.open_time}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit_close_time" className="text-right">Close</Label>
                        <Input
                          id="edit_close_time"
                          name="close_time"
                          type="time"
                          defaultValue={selectedOfficeTiming.close_time}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit_is_holiday" className="text-right">Holiday</Label>
                        <div className="col-span-3">
                          <Checkbox
                            id="edit_is_holiday"
                            name="is_holiday"
                            defaultChecked={selectedOfficeTiming.is_holiday}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditOfficeTimingModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Office Timing Confirmation Modal */}
            <Dialog open={isDeleteOfficeTimingModalOpen} onOpenChange={setIsDeleteOfficeTimingModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Office Hours</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete office hours for {selectedOfficeTiming?.office_day}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteOfficeTimingModalOpen(false);
                      setSelectedOfficeTiming(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    onClick={async () => {
                      if (!selectedOfficeTiming) return;

                      setIsLoading(true);
                      try {
                        const response = await api.delete(`/api/admin/office-timing/${selectedOfficeTiming.id}`);
                        if (response.data.success) {
                          setOfficeTimings(officeTimings.filter(t => t.id !== selectedOfficeTiming.id));
                          setIsDeleteOfficeTimingModalOpen(false);
                          setSelectedOfficeTiming(null);

                          toast({
                            title: "Success",
                            description: "Office hours deleted successfully",
                          });
                        }
                      } catch (error) {
                        console.error('Error deleting office timing:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete office hours. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Calendar Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage events, workshops, and classes
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshEvents}
                  disabled={isEventsLoading}
                >
                  {isEventsLoading ? "Refreshing..." : "Refresh"}
                </Button>
                <Button onClick={() => setShowEventForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Add Event Form */}
            {showEventForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Event</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowEventForm(false);
                      setEventImageFile('');
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      const eventData: EventFormData = {
                        title: formData.get('title')?.toString() || '',
                        event_type: formData.get('event_type')?.toString() || '',
                        event_date: formData.get('event_date')?.toString() || '',
                        event_time: formData.get('event_time')?.toString() || '',
                        duration: formData.get('duration')?.toString() || '',
                        instructor: formData.get('instructor')?.toString() || '',
                        spots_left: parseInt(formData.get('spots_left')?.toString() || '0'),
                        image: eventImageFile || undefined,
                        booking_available: formData.get('booking_available') === 'on',
                        amount: parseFloat(formData.get('amount')?.toString() || '0')
                      };

                      console.log('Creating event with data:', eventData);
                      const response = await api.post('/api/events', eventData);

                      if (response.status === 201) {
                        await fetchEvents(); // Refresh events list
                        setShowEventForm(false);
                        setEventImageFile('');
                        e.currentTarget.reset();

                        toast({
                          title: "Success",
                          description: "Event created successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error creating event:', error);
                      toast({
                        title: "Error",
                        description: "Failed to create event. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" name="title" placeholder="Enter event title" required />
                      </div>
                      <div>
                        <Label htmlFor="event_type">Event Type</Label>
                        <Select name="event_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(EventType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="event_date">Event Date</Label>
                        <Input id="event_date" name="event_date" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="event_time">Event Time</Label>
                        <Input id="event_time" name="event_time" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" name="duration" placeholder="e.g., 2 hours" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input id="instructor" name="instructor" placeholder="Instructor name" />
                      </div>
                      <div>
                        <Label htmlFor="spots_left">Available Spots</Label>
                        <Input id="spots_left" name="spots_left" type="number" min="0" placeholder="20" />
                      </div>
                      <div>
                        <Label htmlFor="amount">Price (₹)</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" />
                      </div>
                    </div>

                    {/* Event Image Upload */}
                    <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <Label>Event Image (Optional)</Label>
                        <span className="text-sm text-muted-foreground">
                          {eventImageFile ? '1 image uploaded' : 'No image selected'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (!files || !files[0]) return;

                            const file = files[0];

                            try {
                              setIsLoading(true);

                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: "Please select an image smaller than 5MB",
                                  variant: "destructive",
                                });
                                return;
                              }

                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    // Remove data URL prefix for base64 only if needed
                                    const result = reader.result as string;
                                    const base64Only = result.replace(/^data:image\/[a-z]+;base64,/, '');
                                    setEventImageFile(base64Only);
                                    toast({
                                      title: "Success",
                                      description: "Image uploaded successfully",
                                    });
                                  };
                                  reader.onerror = () => {
                                    toast({
                                      title: "Error",
                                      description: "Failed to process image",
                                      variant: "destructive",
                                    });
                                  };
                                  reader.readAsDataURL(file);
                            } catch (error) {
                              console.error('Error processing image:', error);
                              toast({
                                title: "Error",
                                description: "Failed to process image",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }

                            e.target.value = '';
                          }}
                        />

                        {eventImageFile && (
                          <div className="relative w-32 h-32">
                            <img
                              src={`data:image/jpeg;base64,${eventImageFile}`}
                              alt="Event preview"
                              className="w-full h-full object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                              onClick={() => setEventImageFile('')}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="booking_available" name="booking_available" defaultChecked />
                      <Label htmlFor="booking_available">Booking Available</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Event..." : "Create Event"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowEventForm(false);
                        setEventImageFile('');
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Events List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {events.length} {events.length === 1 ? 'event' : 'events'} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {isEventsLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Loading events...</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="group relative bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border overflow-hidden"
                      >
                        {/* Event Image */}
                        <div className="aspect-video overflow-hidden relative">
                          {event.image ? (
                            <img
                              src={`data:image/jpeg;base64,${event.image}`}
                              alt={event.title || 'Event'}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                          )}

                          {/* Quick Action Buttons Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="View Details"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsViewEventModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="Edit Event"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEditEventModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              title="Delete Event"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsDeleteEventModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant={event.booking_available ? "default" : "destructive"}
                              className="shadow-sm"
                            >
                              {event.booking_available ? "Open" : "Closed"}
                            </Badge>
                          </div>

                          {/* Event Type Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="shadow-sm">
                              {event.event_type}
                            </Badge>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold line-clamp-2 font-sans">{event.title || 'Unnamed Event'}</h3>
                            <p className="font-bold text-lg font-sans">₹{event.amount || 0}</p>
                          </div>

                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              {event.event_date}
                              {event.event_time && (
                                <span> at {formatTimeValue(event.event_time)}</span>
                              )}
                            </p>

                            {event.duration && (
                              <p className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatTimeValue(event.duration)}
                              </p>
                            )}

                            {event.instructor && (
                              <p className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                {event.instructor}
                              </p>
                            )}

                            {event.spots_left !== undefined && (
                              <p className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {event.spots_left} spots left
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {events.length === 0 && !isEventsLoading && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No events found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* View Event Modal */}
            <Dialog open={isViewEventModalOpen} onOpenChange={setIsViewEventModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Event Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {selectedEvent && (
                    <>
                      {selectedEvent.image && (
                        <div className="flex justify-center">
                          <img
                            src={`data:image/jpeg;base64,${selectedEvent.image}`}
                            alt={selectedEvent.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Title</Label>
                        <div className="col-span-3">{selectedEvent.title}</div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <div className="col-span-3">{selectedEvent.event_type}</div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Date</Label>
                        <div className="col-span-3">{selectedEvent.event_date}</div>
                      </div>
                      {selectedEvent.event_time && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Time</Label>
                          <div className="col-span-3">{formatTimeValue(selectedEvent.event_time)}</div>
                        </div>
                      )}
                      {selectedEvent.duration && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Duration</Label>
                          <div className="col-span-3">{formatTimeValue(selectedEvent.duration)}</div>
                        </div>
                      )}
                      {selectedEvent.instructor && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Instructor</Label>
                          <div className="col-span-3">{selectedEvent.instructor}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Price</Label>
                        <div className="col-span-3">₹{selectedEvent.amount}</div>
                      </div>
                      {selectedEvent.spots_left !== undefined && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Spots Left</Label>
                          <div className="col-span-3">{selectedEvent.spots_left}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Booking</Label>
                        <div className="col-span-3">
                          <Badge variant={selectedEvent.booking_available ? "default" : "destructive"}>
                            {selectedEvent.booking_available ? "Available" : "Closed"}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewEventModalOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Event Modal */}
            <Dialog open={isEditEventModalOpen} onOpenChange={setIsEditEventModalOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                {selectedEvent && (
                  <form className="space-y-4" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (!selectedEvent) return;

                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      const eventData: Partial<EventFormData> = {
                        title: formData.get('title')?.toString(),
                        event_type: formData.get('event_type')?.toString(),
                        event_date: formData.get('event_date')?.toString(),
                        event_time: formData.get('event_time')?.toString(),
                        duration: formData.get('duration')?.toString(),
                        instructor: formData.get('instructor')?.toString(),
                        spots_left: parseInt(formData.get('spots_left')?.toString() || '0'),
                        booking_available: formData.get('booking_available') === 'on',
                        amount: parseFloat(formData.get('amount')?.toString() || '0')
                      };

                      // Only include image if a new one was uploaded
                      if (editEventImageFile) {
                        eventData.image = editEventImageFile;
                      }

                      console.log('Updating event with data:', eventData);
                      const response = await api.put(`/api/events/${selectedEvent.id}`, eventData);

                      if (response.status === 200) {
                        await fetchEvents(); // Refresh events list
                        setIsEditEventModalOpen(false);
                        setEditEventImageFile('');

                        toast({
                          title: "Success",
                          description: "Event updated successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error updating event:', error);
                      toast({
                        title: "Error",
                        description: "Failed to update event. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_title">Event Title</Label>
                        <Input id="edit_title" name="title" defaultValue={selectedEvent.title} required />
                      </div>
                      <div>
                        <Label htmlFor="edit_event_type">Event Type</Label>
                        <Select name="event_type" defaultValue={selectedEvent.event_type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(EventType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit_event_date">Event Date</Label>
                        <Input id="edit_event_date" name="event_date" type="date" defaultValue={selectedEvent.event_date} required />
                      </div>
                      <div>
                        <Label htmlFor="edit_event_time">Event Time</Label>
                        <Input id="edit_event_time" name="event_time" type="time" defaultValue={formatTimeValue(selectedEvent.event_time) || ''} />
                      </div>
                      <div>
                        <Label htmlFor="edit_duration">Duration</Label>
                        <Input id="edit_duration" name="duration" defaultValue={formatTimeValue(selectedEvent.duration) || ''} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit_instructor">Instructor</Label>
                        <Input id="edit_instructor" name="instructor" defaultValue={selectedEvent.instructor || ''} />
                      </div>
                      <div>
                        <Label htmlFor="edit_spots_left">Available Spots</Label>
                        <Input id="edit_spots_left" name="spots_left" type="number" min="0" defaultValue={selectedEvent.spots_left || 0} />
                      </div>
                      <div>
                        <Label htmlFor="edit_amount">Price (₹)</Label>
                        <Input id="edit_amount" name="amount" type="number" step="0.01" min="0" defaultValue={selectedEvent.amount || 0} />
                      </div>
                    </div>

                    {/* Event Image Upload */}
                    <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <Label>Event Image</Label>
                        <span className="text-sm text-muted-foreground">
                          {editEventImageFile ? 'New image selected' : selectedEvent.image ? 'Current image' : 'No image'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (!files || !files[0]) return;

                            const file = files[0];

                            try {
                              setIsLoading(true);

                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: "Please select an image smaller than 5MB",
                                  variant: "destructive",
                                });
                                return;
                              }

                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    // Remove data URL prefix for base64 only if needed
                                    const result = reader.result as string;
                                    const base64Only = result.replace(/^data:image\/[a-z]+;base64,/, '');
                                    setEditEventImageFile(base64Only);
                                    toast({
                                      title: "Success",
                                      description: "New image uploaded successfully",
                                    });
                                  };
                                  reader.onerror = () => {
                                    toast({
                                      title: "Error",
                                      description: "Failed to process image",
                                      variant: "destructive",
                                    });
                                  };
                                  reader.readAsDataURL(file);
                            } catch (error) {
                              console.error('Error processing image:', error);
                              toast({
                                title: "Error",
                                description: "Failed to process image",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }

                            e.target.value = '';
                          }}
                        />

                        {/* Show current or new image */}
                        {(editEventImageFile || selectedEvent.image) && (
                          <div className="relative w-32 h-32">
                            <img
                              src={editEventImageFile ? `data:image/jpeg;base64,${editEventImageFile}` : `data:image/jpeg;base64,${selectedEvent.image}`}
                              alt="Event preview"
                              className="w-full h-full object-cover rounded-lg border"
                            />
                            {editEventImageFile && (
                              <button
                                type="button"
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                                onClick={() => setEditEventImageFile('')}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit_booking_available"
                        name="booking_available"
                        defaultChecked={selectedEvent.booking_available}
                      />
                      <Label htmlFor="edit_booking_available">Booking Available</Label>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsEditEventModalOpen(false);
                        setEditEventImageFile('');
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Event"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Event Modal */}
            <Dialog open={isDeleteEventModalOpen} onOpenChange={setIsDeleteEventModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Event</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteEventModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    onClick={async () => {
                      if (!selectedEvent) return;

                      setIsLoading(true);
                      try {
                        await api.delete(`/api/events/${selectedEvent.id}`);
                        await fetchEvents(); // Refresh events list
                        setIsDeleteEventModalOpen(false);
                        setSelectedEvent(null);

                        toast({
                          title: "Success",
                          description: "Event deleted successfully",
                        });
                      } catch (error) {
                        console.error('Error deleting event:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete event. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Students Management</h1>
                <p className="text-sm text-muted-foreground">
                  View all students from events and course enrollments
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshStudents}
                  disabled={isStudentsLoading}
                >
                  {isStudentsLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Students Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Event Students
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Students enrolled in events and workshops
                  </p>
                </CardHeader>
                <CardContent>
                  {isStudentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {students
                        .filter(student => student.source === 'Event Students')
                        .map((student, index) => (
                          <div
                            key={`event-${index}`}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Event
                            </Badge>
                          </div>
                        ))}
                      {students.filter(student => student.source === 'Event Students').length === 0 && !isStudentsLoading && (
                        <p className="text-center text-muted-foreground py-4">No event students found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Course Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Course Students
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Students enrolled in courses and programs
                  </p>
                </CardHeader>
                <CardContent>
                  {isStudentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {students
                        .filter(student => student.source === 'Call Students')
                        .map((student, index) => (
                          <div
                            key={`course-${index}`}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Course
                            </Badge>
                          </div>
                        ))}
                      {students.filter(student => student.source === 'Call Students').length === 0 && !isStudentsLoading && (
                        <p className="text-center text-muted-foreground py-4">No course students found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {students.filter(s => s.source === 'Event Students').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Event Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {students.filter(s => s.source === 'Call Students').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Course Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{students.length}</p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "instructors":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold truncate font-sans">Instructors Management</h1>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Manage instructors and their specializations
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshInstructors}
                  disabled={isInstructorsLoading}
                  className="w-full sm:w-auto"
                >
                  {isInstructorsLoading ? "Refreshing..." : "Refresh"}
                </Button>
                <Button
                  onClick={() => setShowInstructorForm(true)}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Add Instructor</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>

            {/* Add Instructor Form */}
            {showInstructorForm && (
              <Card className="mx-auto max-w-4xl">
                <CardHeader className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg lg:text-xl">Add New Instructor</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowInstructorForm(false);
                      setInstructorImageFile('');
                    }} className="self-end sm:self-auto">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <form className="space-y-4 lg:space-y-6" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      const instructorData = {
                        name: formData.get('name')?.toString() || '',
                        email: formData.get('email')?.toString() || '',
                        phone: formData.get('phone')?.toString() || '',
                        specialization: formData.get('specialization')?.toString() || '',
                        experience_years: parseInt(formData.get('experience_years')?.toString() || '0'),
                        bio: formData.get('bio')?.toString() || '',
                        hourly_rate: parseFloat(formData.get('hourly_rate')?.toString() || '0'),
                        profile_image: instructorImageFile || null,
                        is_active: formData.get('is_active') === 'on'
                      };

                      console.log('Creating instructor with data:', instructorData);
                      const response = await api.post('/api/admin/instructors', instructorData);

                      if (response.status === 201) {
                        await fetchInstructors();
                        setShowInstructorForm(false);
                        setInstructorImageFile('');
                        e.currentTarget.reset();

                        toast({
                          title: "Success",
                          description: "Instructor created successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error creating instructor:', error);
                      toast({
                        title: "Error",
                        description: "Failed to create instructor. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input id="name" name="name" placeholder="Enter instructor name" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="instructor@example.com" required className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                        <Input id="phone" name="phone" placeholder="+91 9876543210" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
                        <Input id="specialization" name="specialization" placeholder="e.g., Wedding Arrangements" className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <Label htmlFor="experience_years" className="text-sm font-medium">Experience (Years)</Label>
                        <Input id="experience_years" name="experience_years" type="number" min="0" placeholder="5" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="hourly_rate" className="text-sm font-medium">Hourly Rate (₹)</Label>
                        <Input id="hourly_rate" name="hourly_rate" type="number" step="0.01" min="0" placeholder="1500.00" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea id="bio" name="bio" placeholder="Brief description about the instructor..." rows={3} className="mt-1 resize-none" />
                    </div>

                    {/* Profile Image Upload */}
                    <div className="space-y-3 lg:space-y-4 p-3 lg:p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <Label className="text-sm font-medium">Profile Image (Optional)</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="flex-1"
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (!files || !files[0]) return;

                            const file = files[0];
                            try {
                              if (file.size > 10 * 1024 * 1024) {
                                toast({
                                  title: "Error",
                                  description: "Image must be less than 10MB",
                                  variant: "destructive",
                                });
                                return;
                              }

                              setIsLoading(true);
                              const reader = new FileReader();
                              reader.onload = () => {
                                setInstructorImageFile(reader.result as string);
                                toast({
                                  title: "Success",
                                  description: "Image uploaded successfully",
                                });
                              };
                              reader.onerror = () => {
                                toast({
                                  title: "Error",
                                  description: "Failed to process image",
                                  variant: "destructive",
                                });
                              };
                              reader.readAsDataURL(file);
                            } catch (error) {
                              console.error('Error processing image:', error);
                              toast({
                                title: "Error",
                                description: "Failed to process image",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                            e.target.value = '';
                          }}
                        />
                        {instructorImageFile && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setInstructorImageFile('')}
                            className="w-full sm:w-auto"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {instructorImageFile && (
                        <div className="flex justify-center sm:justify-start">
                          <img
                            src={instructorImageFile}
                            alt="Profile preview"
                            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="is_active" name="is_active" defaultChecked />
                      <Label htmlFor="is_active">Active Instructor</Label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 pt-2">
                      <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                        {isLoading ? "Creating Instructor..." : "Create Instructor"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowInstructorForm(false)} className="flex-1 sm:flex-none">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Instructors List */}
            <Card>
              <CardHeader>
                <CardTitle>Instructors List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {instructors.length} {instructors.length === 1 ? 'instructor' : 'instructors'} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {isInstructorsLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Loading instructors...</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {instructors.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="border rounded-lg p-3 lg:p-4 bg-card hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          {/* Profile Image */}
                          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                            {instructor.profile_image ? (
                              <img
                                src={instructor.profile_image.startsWith('data:')
                                  ? instructor.profile_image
                                  : `data:image/jpeg;base64,${instructor.profile_image}`}
                                alt={instructor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                            )}
                          </div>

                          {/* Instructor Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base lg:text-lg truncate font-sans">{instructor.name}</h3>
                                <p className="text-xs lg:text-sm text-muted-foreground truncate font-sans">{instructor.email}</p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {instructor.is_active ? (
                                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Active</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 space-y-1">
                              {instructor.specialization && (
                                <p className="text-sm font-medium text-blue-600 font-sans">{instructor.specialization}</p>
                              )}
                              {instructor.experience_years > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {instructor.experience_years} years experience
                                </p>
                              )}
                              {instructor.hourly_rate > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  ₹{instructor.hourly_rate}/hour
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-3 lg:mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setIsViewInstructorModalOpen(true);
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="text-xs lg:text-sm">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setEditInstructorImageFile(instructor.profile_image || '');
                              setIsEditInstructorModalOpen(true);
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="text-xs lg:text-sm">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setIsDeleteInstructorModalOpen(true);
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="text-xs lg:text-sm">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {instructors.length === 0 && !isInstructorsLoading && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No instructors found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* View Instructor Modal */}
            <Dialog open={isViewInstructorModalOpen} onOpenChange={setIsViewInstructorModalOpen}>
              <DialogContent className="sm:max-w-[90vw] lg:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg lg:text-xl">Instructor Details</DialogTitle>
                </DialogHeader>
                {selectedInstructor && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        {selectedInstructor.profile_image ? (
                          <img
                            src={selectedInstructor.profile_image.startsWith('data:')
                              ? selectedInstructor.profile_image
                              : `data:image/jpeg;base64,${selectedInstructor.profile_image}`}
                            alt={selectedInstructor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedInstructor.name}</h3>
                        <p className="text-muted-foreground">{selectedInstructor.email}</p>
                        {selectedInstructor.phone && (
                          <p className="text-sm text-muted-foreground">{selectedInstructor.phone}</p>
                        )}
                      </div>
                      <Badge variant={selectedInstructor.is_active ? "default" : "secondary"}>
                        {selectedInstructor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Specialization</Label>
                        <p className="text-sm mt-1">{selectedInstructor.specialization || "Not specified"}</p>
                      </div>
                      <div>
                        <Label>Experience</Label>
                        <p className="text-sm mt-1">{selectedInstructor.experience_years} years</p>
                      </div>
                      <div>
                        <Label>Hourly Rate</Label>
                        <p className="text-sm mt-1">₹{selectedInstructor.hourly_rate}</p>
                      </div>
                      <div>
                        <Label>Joined Date</Label>
                        <p className="text-sm mt-1">
                          {new Date(selectedInstructor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {selectedInstructor.bio && (
                      <div>
                        <Label>Bio</Label>
                        <p className="text-sm mt-1 text-muted-foreground">{selectedInstructor.bio}</p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewInstructorModalOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Instructor Confirmation Modal */}
            <Dialog open={isDeleteInstructorModalOpen} onOpenChange={setIsDeleteInstructorModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Instructor</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedInstructor?.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteInstructorModalOpen(false);
                      setSelectedInstructor(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    onClick={async () => {
                      if (!selectedInstructor) return;

                      setIsLoading(true);
                      try {
                        await api.delete(`/api/admin/instructors/${selectedInstructor.id}`);
                        setInstructors(instructors.filter(i => i.id !== selectedInstructor.id));
                        setIsDeleteInstructorModalOpen(false);
                        setSelectedInstructor(null);

                        toast({
                          title: "Success",
                          description: "Instructor deleted successfully",
                        });
                      } catch (error) {
                        console.error('Error deleting instructor:', error);
                        toast({
                          title: "Error",
                          description: "Failed to delete instructor. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Instructor Modal */}
            <Dialog open={isEditInstructorModalOpen} onOpenChange={setIsEditInstructorModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Instructor</DialogTitle>
                  <DialogDescription>
                    Update instructor information and settings
                  </DialogDescription>
                </DialogHeader>
                {selectedInstructor && (
                  <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      const formData = new FormData(e.currentTarget);

                      const updates = {
                        name: formData.get('name')?.toString() || '',
                        email: formData.get('email')?.toString() || '',
                        phone: formData.get('phone')?.toString() || '',
                        specialization: formData.get('specialization')?.toString() || '',
                        experience_years: parseInt(formData.get('experience_years')?.toString() || '0'),
                        bio: formData.get('bio')?.toString() || '',
                        hourly_rate: parseFloat(formData.get('hourly_rate')?.toString() || '0'),
                        profile_image: editInstructorImageFile || selectedInstructor.profile_image,
                        is_active: formData.get('is_active') === 'on'
                      };

                      console.log('Updating instructor with data:', updates);
                      const response = await api.put(`/api/admin/instructors/${selectedInstructor.id}`, updates);

                      if (response.data.success) {
                        // Update the instructor in the list
                        setInstructors(instructors.map(instructor =>
                          instructor.id === selectedInstructor.id ? response.data.data : instructor
                        ));
                        setIsEditInstructorModalOpen(false);
                        setSelectedInstructor(null);
                        setEditInstructorImageFile('');

                        toast({
                          title: "Success",
                          description: "Instructor updated successfully",
                          variant: "default",
                        });
                      }
                    } catch (error) {
                      console.error('Error updating instructor:', error);
                      toast({
                        title: "Error",
                        description: "Failed to update instructor. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit_name">Full Name</Label>
                          <Input
                            id="edit_name"
                            name="name"
                            defaultValue={selectedInstructor.name}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_email">Email</Label>
                          <Input
                            id="edit_email"
                            name="email"
                            type="email"
                            defaultValue={selectedInstructor.email}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit_phone">Phone</Label>
                          <Input
                            id="edit_phone"
                            name="phone"
                            defaultValue={selectedInstructor.phone || ''}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_specialization">Specialization</Label>
                          <Input
                            id="edit_specialization"
                            name="specialization"
                            defaultValue={selectedInstructor.specialization || ''}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit_experience_years">Experience (Years)</Label>
                          <Input
                            id="edit_experience_years"
                            name="experience_years"
                            type="number"
                            min="0"
                            defaultValue={selectedInstructor.experience_years || 0}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_hourly_rate">Hourly Rate (₹)</Label>
                          <Input
                            id="edit_hourly_rate"
                            name="hourly_rate"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={selectedInstructor.hourly_rate || 0}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="edit_bio">Bio</Label>
                        <Textarea
                          id="edit_bio"
                          name="bio"
                          rows={4}
                          defaultValue={selectedInstructor.bio || ''}
                        />
                      </div>

                      {/* Profile Image Upload */}
                      <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                        <Label>Profile Image</Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files;
                              if (!files || !files[0]) return;

                              const file = files[0];
                              try {
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    title: "Error",
                                    description: "Image must be less than 10MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                setIsLoading(true);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setEditInstructorImageFile(reader.result as string);
                                  toast({
                                    title: "Success",
                                    description: "Image uploaded successfully",
                                  });
                                };
                                reader.onerror = () => {
                                  toast({
                                    title: "Error",
                                    description: "Failed to process image",
                                    variant: "destructive",
                                  });
                                };
                                reader.readAsDataURL(file);
                              } catch (error) {
                                console.error('Error processing image:', error);
                                toast({
                                  title: "Error",
                                  description: "Failed to process image",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsLoading(false);
                              }
                              e.target.value = '';
                            }}
                          />
                          {editInstructorImageFile && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => setEditInstructorImageFile('')}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        {/* Current or New Image Preview */}
                        <div className="flex gap-4">
                          {(editInstructorImageFile || selectedInstructor.profile_image) && (
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                {editInstructorImageFile ? 'New Image' : 'Current Image'}
                              </Label>
                              <img
                                src={editInstructorImageFile || (
                                  selectedInstructor.profile_image?.startsWith('data:')
                                    ? selectedInstructor.profile_image
                                    : `data:image/jpeg;base64,${selectedInstructor.profile_image}`
                                )}
                                alt="Profile preview"
                                className="w-24 h-24 object-cover rounded-lg border mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit_is_active"
                          name="is_active"
                          defaultChecked={selectedInstructor.is_active}
                        />
                        <Label htmlFor="edit_is_active">Active Instructor</Label>
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditInstructorModalOpen(false);
                          setSelectedInstructor(null);
                          setEditInstructorImageFile('');
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Instructor"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-sans">Impact Management</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage site impact values shown on the public site.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={refreshImpacts} disabled={isImpactsLoading}>
                  {isImpactsLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button onClick={() => setShowImpactForm(true)} disabled={impacts.length >= 4}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Impact
                </Button>
              </div>
            </div>

            {showImpactForm && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add Impact</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowImpactForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                      <Label>Title</Label>
                      <Input value={impactTitle} onChange={(e) => setImpactTitle(e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <Label>Value</Label>
                      <Input value={impactValue} onChange={(e) => setImpactValue(e.target.value)} />
                    </div>
                    <div className="md:col-span-1 flex gap-2">
                      <Button onClick={handleCreateImpact} disabled={isLoading || ( !editingImpactId && impacts.length >= 4 )}>{editingImpactId ? 'Update' : 'Save'}</Button>
                      <Button variant="outline" onClick={() => { setShowImpactForm(false); setImpactTitle(''); setImpactValue(''); setEditingImpactId(null); }}>Cancel</Button>
                    </div>
                  </div>
                </CardContent>
                {!editingImpactId && impacts.length >= 4 && (
                  <div className="p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-100 rounded">
                    Maximum of 4 impacts allowed. Delete an existing impact to add a new one.
                  </div>
                )}
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Impact Values</CardTitle>
                <p className="text-sm text-muted-foreground">{impacts.length} {impacts.length === 1 ? 'impact' : 'impacts'} total</p>
              </CardHeader>
              <CardContent>
                {isImpactsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : impacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No impacts found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {impacts.map((imp) => (
                      <div key={imp.id} className="flex items-center justify-between border rounded-lg p-3 bg-card">
                        <div>
                          <div className="font-medium">{imp.title}</div>
                          <div className="text-sm text-muted-foreground">{imp.value}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setImpactTitle(imp.title); setImpactValue(imp.value); setEditingImpactId(imp.id); setShowImpactForm(true); }}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteImpact(imp.id)} disabled={isLoading}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );


        
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground font-sans">Select a section from the sidebar</p>
          </div>
        );
    }
  };

  // Function to handle product operations
  const handleDeleteProduct = async (): Promise<void> => {
    if (!selectedProduct?.id) return;

    setIsLoading(true);
    try {
      await api.delete(`/api/admin/products/${selectedProduct.id}`);
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);

      // Refresh products list to ensure sync
      await refreshProducts();

      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (updatedData: Partial<Product>): Promise<void> => {
    if (!selectedProduct?.id) return;

    setIsLoading(true);
    try {
      const response = await api.put(`/api/admin/products/${selectedProduct.id}`, updatedData);
      if (response.status === 200) {
        setProducts(products.map(p => p.id === selectedProduct.id ? response.data : p));
        setIsEditModalOpen(false);
        setSelectedProduct(null);

        // Refresh products list to ensure sync
        await refreshProducts();

        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImagesOneByOne = async (productId: string, images: string[]): Promise<void> => {
    const imageFields = ['image', 'imagefirst', 'imagesecond', 'imagethirder', 'imagefoure'];

    for (let i = 0; i < Math.min(images.length, 5); i++) {
      try {
        const fieldName = imageFields[i];
        const imageData = images[i];

        // Clean base64 data
        const cleanImage = imageData.includes('base64,')
          ? imageData.split('base64,')[1]
          : imageData;

        await api.put(`/api/admin/products/${productId}`, {
          [fieldName]: cleanImage
        });

        console.log(`Uploaded image ${i + 1} to ${fieldName}`);
      } catch (error: any) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        const errorMessage = error?.response?.status === 431
          ? `Image ${i + 1} is too large. Try compressing it further.`
          : `Failed to upload image ${i + 1}`;

        toast({
          title: "Upload Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* View Product Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base lg:text-lg">Product Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 lg:gap-4 py-3 lg:py-4">
            {selectedProduct && (
              <>
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Name</Label>
                  <div className="sm:col-span-3 text-sm lg:text-base">{selectedProduct.name || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Price</Label>
                  <div className="sm:col-span-3 text-sm lg:text-base">₹{selectedProduct.price || 0}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Category</Label>
                  <div className="sm:col-span-3 text-sm lg:text-base">
                    {(() => {
                      const cats = getCategoryArray(selectedProduct.category);
                      return cats.length ? <CategoryList cats={cats} maxVisible={3} /> : <span className="text-sm text-muted-foreground">N/A</span>;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Stock</Label>
                  <div className="sm:col-span-3 text-sm lg:text-base">{selectedProduct.stockquantity}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Status</Label>
                  <div className="sm:col-span-3">
                    <Badge variant={selectedProduct.instock ? "default" : "destructive"} className="text-xs">
                      {selectedProduct.instock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 lg:gap-4">
                  <Label className="sm:text-right font-medium">Description</Label>
                  <div className="sm:col-span-3 text-sm lg:text-base break-words">{selectedProduct.description}</div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base lg:text-lg">Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedData = {
                name: formData.get('name') as string,
                price: parseFloat(formData.get('price') as string),
                category: formData.get('category') as string,
                stockquantity: parseInt(formData.get('stockquantity') as string),
                description: formData.get('description') as string,
                instock: (formData.get('instock') as string) === 'true'
              };
              handleUpdateProduct(updatedData);
            }}>
              <div className="grid gap-3 lg:gap-4 py-3 lg:py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label htmlFor="name" className="sm:text-right font-medium">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedProduct.name}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label htmlFor="price" className="sm:text-right font-medium">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={selectedProduct.price}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label htmlFor="category" className="sm:text-right font-medium">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={Array.isArray(selectedProduct.category) ? getCategoryArray(selectedProduct.category).join(', ') : String(selectedProduct.category || '')}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 lg:gap-4">
                  <Label htmlFor="stockquantity" className="text-right">Stock</Label>
                  <Input
                    id="stockquantity"
                    name="stockquantity"
                    type="number"
                    defaultValue={selectedProduct.stockquantity}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instock" className="text-right">Status</Label>
                  <Select name="instock" defaultValue={selectedProduct.instock ? "true" : "false"}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={selectedProduct.description}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-sans">Delete Product</DialogTitle>
            <DialogDescription>
              <span className="font-sans">Are you sure you want to delete this product? This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedProduct && (
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">{(() => {
                  const cats = getCategoryArray(selectedProduct.category);
                  return cats.length ? <CategoryList cats={cats} maxVisible={3} /> : <span className="text-sm text-muted-foreground">N/A</span>;
                })()}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Responsive Left Sidebar */}
          <Sidebar className="w-64 lg:w-64 border-r border-border bg-background shadow-sm font-sans">
            {/* Simple Header */}
            <div className="p-3 lg:p-4 border-b border-border font-sans">
              <Link to="/" className="flex items-center gap-2 group">
                <Button variant="ghost" size="sm" className="p-1 lg:p-2">
                  <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
                <img
                  src={flowerSchoolLogo}
                  alt="The Flower School"
                  className="h-6 lg:h-8 w-auto"
                />
                <div className="hidden sm:block">
                  <h2 className="font-semibold text-foreground text-xs lg:text-sm font-sans">Admin</h2>
                </div>
              </Link>
            </div>

            {/* Simple Navigation */}
            <SidebarContent className="p-1 lg:p-2">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {sidebarItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                              "w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg transition-colors cursor-pointer font-sans",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <IconComponent className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                            <span className="font-medium text-xs lg:text-sm truncate font-sans">{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main Content Area - Responsive */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Mobile-friendly Top Header */}
            <header className="h-14 lg:h-20 border-b border-border bg-background/95 backdrop-blur shadow-sm sticky top-0 z-10 font-sans">
              <div className="flex items-center justify-between h-full px-3 lg:px-8">
                <div className="flex items-center gap-2 lg:gap-6">
                  <SidebarTrigger className="flex lg:hidden" />
                  <div className="min-w-0 flex-1">
                    <h1 className="font-bold text-lg lg:text-2xl text-foreground truncate font-sans">
                      {sidebarItems.find(item => item.id === activeTab)?.title || "Dashboard"}
                    </h1>
                    <p className="text-xs lg:text-sm text-muted-foreground font-medium hidden sm:block truncate font-sans">
                      {sidebarItems.find(item => item.id === activeTab)?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 lg:gap-4">
                  <Link to="/">
                    <Button variant="outline" size="sm" className="text-xs lg:text-sm px-2 lg:px-4 font-sans">
                      <Home className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Back to Site</span>
                      <span className="sm:hidden">Home</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            {/* Responsive Page Content */}
            <main className="flex-1 p-3 lg:p-8 bg-gradient-to-br from-background to-muted/20 overflow-auto font-sans">
              <div className="max-w-full">
                {renderContent()}
              </div>
            </main>
          </div>

          {/* Custom Alert Modal */}
          <Dialog open={alertModal.open} onOpenChange={(open) => setAlertModal(prev => ({ ...prev, open }))}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  {alertModal.title}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground whitespace-pre-line">{alertModal.message}</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setAlertModal(prev => ({ ...prev, open: false }))} className="w-full">
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;