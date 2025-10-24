// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   ShoppingCart, 
//   Package, 
//   Users, 
//   Calendar,
//   DollarSign,
//   TrendingUp,
//   BookOpen,
//   GraduationCap,
//   Settings,
//   Bell,
//   BarChart3,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   X
// } from "lucide-react";

// interface AdminDashboardProps {
//   onClose: () => void;
// }

// const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [customRequests, setCustomRequests] = useState([]);
//   const [products, setProducts] = useState([]);

//   // Fetch custom requests
//   useEffect(() => {
//     fetch("/api/custom")
//       .then((res) => res.json())
//       .then((data) => setCustomRequests(data || []));
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     fetch("/api/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data || []));
//   }, []);

//   const stats = [
//     {
//       title: "Total Sales",
//       value: "$12,450",
//       change: "+12%",
//       icon: DollarSign,
//       color: "text-success"
//     },
//     {
//       title: "New Orders",
//       value: "34",
//       change: "+8%",
//       icon: ShoppingCart,
//       color: "text-primary"
//     },
//     {
//       title: "Products",
//       value: "156",
//       change: "+3%",
//       icon: Package,
//       color: "text-accent"
//     },
//     {
//       title: "Students",
//       value: "89",
//       change: "+15%",
//       icon: Users,
//       color: "text-secondary-dark"
//     }
//   ];

//   const recentOrders = [
//     { id: "#ORD-001", customer: "Sarah Johnson", items: "Red Rose Bouquet", amount: "$89.99", status: "Processing" },
//     { id: "#ORD-002", customer: "Michael Chen", items: "Wedding Package", amount: "$499.99", status: "Completed" },
//     { id: "#ORD-003", customer: "Emily Rodriguez", items: "Lily Arrangement", amount: "$75.99", status: "Shipped" },
//     { id: "#ORD-004", customer: "David Thompson", items: "Monthly Subscription", amount: "$129.99", status: "Active" },
//   ];

//   const upcomingClasses = [
//     { name: "Flower Arrangement Basics", date: "March 15, 2024", students: 12, instructor: "Maria Garcia" },
//     { name: "Wedding Florals Workshop", date: "March 20, 2024", students: 8, instructor: "John Smith" },
//     { name: "Kids Floral Art", date: "March 22, 2024", students: 15, instructor: "Lisa Wong" },
//   ];

//   const products = [
//     { id: 1, name: "Red Rose Bouquet", category: "Roses", price: "$89.99", stock: 25, status: "Active" },
//     { id: 2, name: "White Lily Arrangement", category: "Lilies", price: "$75.99", stock: 18, status: "Active" },
//     { id: 3, name: "Orchid Collection", category: "Orchids", price: "$120.99", stock: 12, status: "Low Stock" },
//     { id: 4, name: "Wedding Bouquet", category: "Bouquets", price: "$199.99", stock: 8, status: "Active" },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Processing": return "bg-warning/10 text-warning";
//       case "Completed": return "bg-success/10 text-success";
//       case "Shipped": return "bg-primary/10 text-primary";
//       case "Active": return "bg-success/10 text-success";
//       case "Low Stock": return "bg-destructive/10 text-destructive";
//       default: return "bg-muted/10 text-muted-foreground";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-background rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-card">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
//             <p className="text-muted-foreground">Manage your flower business and school</p>
//           </div>
//           <Button variant="ghost" size="icon" onClick={onClose}>
//             <X className="h-6 w-6" />
//           </Button>
//         </div>

//         {/* Content */}
//         <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
//             <TabsList className="grid w-full grid-cols-5 mb-6">
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
//               <TabsTrigger value="school">Flower School</TabsTrigger>
//               <TabsTrigger value="custom">Custom</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>
//             {/* Custom Tab */}
//             <TabsContent value="custom" className="space-y-6">
//               <h2 className="text-2xl font-bold">Custom Requests</h2>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Custom Requests</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-border">
//                           <th className="text-left py-3 px-4">Product</th>
//                           <th className="text-left py-3 px-4">Product Image</th>
//                           <th className="text-left py-3 px-4">Custom Images</th>
//                           <th className="text-left py-3 px-4">Comment</th>
//                           <th className="text-left py-3 px-4">Created At</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {customRequests.map((req, idx) => {
//                           // Find product by id (assuming req.productId exists)
//                           const product = products.find(p => p.id === req.productId);
//                           return (
//                             <tr key={req.id || idx} className="border-b border-border/50">
//                               <td className="py-3 px-4 font-medium">{product ? product.name : "Unknown"}</td>
//                               <td className="py-3 px-4">
//                                 {product && product.image ? (
//                                   <img src={typeof product.image === 'string' ? `data:image/jpeg;base64,${product.image}` : product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
//                                 ) : "-"}
//                               </td>
//                               <td className="py-3 px-4">
//                                 {req.images ? (
//                                   Array.isArray(req.images)
//                                     ? req.images.map((img, i) => (
//                                         <img key={i} src={`data:image/jpeg;base64,${img}`} alt="Custom" className="h-12 w-12 object-cover rounded mr-2 inline-block" />
//                                       ))
//                                     : <img src={`data:image/jpeg;base64,${req.images}`} alt="Custom" className="h-12 w-12 object-cover rounded" />
//                                 ) : "-"}
//                               </td>
//                               <td className="py-3 px-4">{req.comment}</td>
//                               <td className="py-3 px-4">{req.created_at ? new Date(req.created_at).toLocaleString() : "-"}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats.map((stat) => (
//                   <Card key={stat.title} className="hover:shadow-soft transition-shadow">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground">{stat.title}</p>
//                           <p className="text-2xl font-bold text-foreground">{stat.value}</p>
//                           <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
//                         </div>
//                         <stat.icon className={`h-8 w-8 ${stat.color}`} />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Orders */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <ShoppingCart className="h-5 w-5 mr-2" />
//                       Recent Orders
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {recentOrders.map((order) => (
//                         <div key={order.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
//                           <div>
//                             <p className="font-medium text-foreground">{order.id}</p>
//                             <p className="text-sm text-muted-foreground">{order.customer}</p>
//                             <p className="text-sm text-muted-foreground">{order.items}</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-foreground">{order.amount}</p>
//                             <Badge className={getStatusColor(order.status)}>
//                               {order.status}
//                             </Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Upcoming Classes */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Calendar className="h-5 w-5 mr-2" />
//                       Upcoming Classes
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {upcomingClasses.map((class_, index) => (
//                         <div key={index} className="p-3 bg-muted/20 rounded-lg">
//                           <div className="flex items-center justify-between mb-2">
//                             <p className="font-medium text-foreground">{class_.name}</p>
//                             <Badge className="bg-primary/10 text-primary">
//                               {class_.students} students
//                             </Badge>
//                           </div>
//                           <p className="text-sm text-muted-foreground">{class_.date}</p>
//                           <p className="text-sm text-muted-foreground">Instructor: {class_.instructor}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* E-Commerce Tab */}
//             <TabsContent value="ecommerce" className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold">E-Commerce Management</h2>
//                 <Button className="shadow-soft">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Button>
//               </div>

//               {/* Products Table */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Products</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-border">
//                           <th className="text-left py-3 px-4">Product</th>
//                           <th className="text-left py-3 px-4">Category</th>
//                           <th className="text-left py-3 px-4">Price</th>
//                           <th className="text-left py-3 px-4">Stock</th>
//                           <th className="text-left py-3 px-4">Status</th>
//                           <th className="text-left py-3 px-4">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {products.map((product) => (
//                           <tr key={product.id} className="border-b border-border/50">
//                             <td className="py-3 px-4 font-medium">{product.name}</td>
//                             <td className="py-3 px-4">{product.category}</td>
//                             <td className="py-3 px-4">{product.price}</td>
//                             <td className="py-3 px-4">{product.stock}</td>
//                             <td className="py-3 px-4">
//                               <Badge className={getStatusColor(product.status)}>
//                                 {product.status}
//                               </Badge>
//                             </td>
//                             <td className="py-3 px-4">
//                               <div className="flex space-x-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* School Tab */}
//             <TabsContent value="school" className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold">Flower School Management</h2>
//                 <div className="flex space-x-2">
//                   <Button variant="outline">
//                     <Calendar className="h-4 w-4 mr-2" />
//                     View Calendar
//                   </Button>
//                   <Button className="shadow-soft">
//                     <Plus className="h-4 w-4 mr-2" />
//                     New Class
//                   </Button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <BookOpen className="h-5 w-5 mr-2" />
//                       Active Programs
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-primary mb-2">12</div>
//                     <p className="text-muted-foreground">Running this month</p>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <GraduationCap className="h-5 w-5 mr-2" />
//                       Total Students
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-primary mb-2">89</div>
//                     <p className="text-muted-foreground">Enrolled students</p>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <TrendingUp className="h-5 w-5 mr-2" />
//                       Revenue
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold text-primary mb-2">$8,950</div>
//                     <p className="text-muted-foreground">This month</p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Settings Tab */}
//             <TabsContent value="settings" className="space-y-6">
//               <h2 className="text-2xl font-bold">Settings</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Store Settings</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <Button variant="outline" className="w-full justify-start">
//                       <Settings className="h-4 w-4 mr-2" />
//                       General Settings
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start">
//                       <DollarSign className="h-4 w-4 mr-2" />
//                       Payment Settings
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start">
//                       <Bell className="h-4 w-4 mr-2" />
//                       Notifications
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Reports & Analytics</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <Button variant="outline" className="w-full justify-start">
//                       <BarChart3 className="h-4 w-4 mr-2" />
//                       Sales Reports
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start">
//                       <TrendingUp className="h-4 w-4 mr-2" />
//                       Analytics
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start">
//                       <Users className="h-4 w-4 mr-2" />
//                       Customer Insights
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;