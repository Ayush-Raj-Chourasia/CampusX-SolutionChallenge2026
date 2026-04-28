import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Users, 
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  IndianRupee,
  Eye,
  Ban,
  Search,
  Bell,
  Settings,
  BarChart3,
  FileText,
  Clock,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const stats = [
  { 
    label: "Total Users", 
    value: "2,847", 
    change: "+12%", 
    icon: Users, 
    color: "from-primary to-secondary" 
  },
  { 
    label: "Active Listings", 
    value: "1,234", 
    change: "+8%", 
    icon: ShoppingBag, 
    color: "from-secondary to-success" 
  },
  { 
    label: "Transactions", 
    value: "₹4.2L", 
    change: "+24%", 
    icon: IndianRupee, 
    color: "from-success to-secondary" 
  },
  { 
    label: "Fraud Blocked", 
    value: "23", 
    change: "-45%", 
    icon: Shield, 
    color: "from-destructive to-accent" 
  },
];

const initialVerifications = [
  { id: 1, name: "Rahul Sharma", email: "rahul.s@iitd.ac.in", college: "IIT Delhi", submitted: "2 hours ago", idType: "Student ID", status: "pending" },
  { id: 2, name: "Sneha Patel", email: "sneha.p@iitb.ac.in", college: "IIT Bombay", submitted: "4 hours ago", idType: "Student ID", status: "pending" },
  { id: 3, name: "Amit Kumar", email: "amit.k@nitk.edu.in", college: "NIT Karnataka", submitted: "5 hours ago", idType: "College ID", status: "pending" },
];

const initialFraudAlerts = [
  { 
    id: 1, 
    type: "Suspicious Pricing", 
    item: "iPhone 15 Pro Max", 
    price: "₹15,000", 
    marketPrice: "₹1,29,000", 
    seller: "new_user_123", 
    risk: "high",
    reason: "Price 88% below market average",
    status: "active"
  },
  { 
    id: 2, 
    type: "Duplicate Listing", 
    item: "MacBook Pro 2023", 
    seller: "tech_seller", 
    risk: "medium",
    reason: "Same images used in 3 different listings",
    status: "active"
  },
  { 
    id: 3, 
    type: "Unverified Meetup", 
    item: "Camera DSLR", 
    seller: "photo_hub", 
    risk: "low",
    reason: "Proposing off-campus meetup location",
    status: "active"
  },
];

const recentTransactions = [
  { id: 1, buyer: "Priya M.", seller: "Rahul S.", item: "Engineering Kit", amount: 450, status: "completed", date: "Today" },
  { id: 2, buyer: "Amit K.", seller: "Sneha R.", item: "MacBook Air", amount: 55000, status: "in_escrow", date: "Today" },
  { id: 3, buyer: "Vikram P.", seller: "Arjun N.", item: "Guitar", amount: 6000, status: "completed", date: "Yesterday" },
  { id: 4, buyer: "Neha S.", seller: "Ravi T.", item: "Study Table", amount: 3500, status: "dispute", date: "Yesterday" },
];

const adminNotifications = [
  { id: 1, title: "New verification request", message: "3 students awaiting approval", time: "Just now", unread: true },
  { id: 2, title: "High-risk listing detected", message: "iPhone 15 Pro Max at ₹15,000", time: "5 min ago", unread: true },
  { id: 3, title: "Dispute opened", message: "Transaction #4521 requires attention", time: "1 hour ago", unread: true },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "verifications" | "fraud" | "users">("overview");
  const [pendingVerifications, setPendingVerifications] = useState(initialVerifications);
  const [fraudAlerts, setFraudAlerts] = useState(initialFraudAlerts);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<typeof initialVerifications[0] | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [investigateModalOpen, setInvestigateModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof initialFraudAlerts[0] | null>(null);

  const handleApprove = (id: number) => {
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    toast.success("User verified successfully!");
  };

  const handleReject = (id: number) => {
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    toast.error("Verification rejected");
  };

  const handleReview = (verification: typeof initialVerifications[0]) => {
    setSelectedVerification(verification);
    setReviewModalOpen(true);
  };

  const handleInvestigate = (alert: typeof initialFraudAlerts[0]) => {
    setSelectedAlert(alert);
    setInvestigateModalOpen(true);
  };

  const handleBlockUser = (sellerId: string) => {
    setFraudAlerts(prev => prev.filter(a => a.seller !== sellerId));
    toast.success(`User @${sellerId} has been blocked`);
    setInvestigateModalOpen(false);
  };

  const handleDismissAlert = (id: number) => {
    setFraudAlerts(prev => prev.filter(a => a.id !== id));
    toast.info("Alert dismissed");
    setInvestigateModalOpen(false);
  };

  const handleExport = () => {
    toast.success("Transaction report exported to CSV");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 hidden lg:block">
        <Link to="/" className="block mb-8">
          <Logo size="md" />
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </Link>

        <nav className="space-y-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "verifications", label: "Verifications", icon: CheckCircle2, badge: pendingVerifications.length },
            { id: "fraud", label: "Fraud Detection", icon: AlertTriangle, badge: fraudAlerts.length },
            { id: "users", label: "User Management", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === item.id 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="font-semibold text-sm text-success">System Status</span>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage CampusX operations</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {adminNotifications.filter(n => n.unread).length}
                </span>
              </Button>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Admin Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {adminNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-muted/80 ${notif.unread ? "bg-secondary/10 border border-secondary/20" : "bg-muted/50"}`}
                      onClick={() => {
                        if (notif.title.includes("verification")) setActiveTab("verifications");
                        if (notif.title.includes("risk")) setActiveTab("fraud");
                        setNotificationsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm">{notif.title}</p>
                        {notif.unread && <div className="w-2 h-2 bg-secondary rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Settings */}
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
                <Settings className="w-5 h-5" />
              </Button>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Admin Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-medium mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Email alerts for high-risk fraud
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Push notifications for verifications
                      </label>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-medium mb-2">Security</h3>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("2FA settings opening...")}>
                      Configure 2FA
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-medium mb-2">System</h3>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Cache cleared!")}>
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toast.info(`${stat.label}: ${stat.value}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith("+") ? "text-success" : "text-destructive"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Verifications */}
        <div className="bg-card rounded-xl border border-border mb-8">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <h2 className="font-semibold">Pending Verifications</h2>
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                {pendingVerifications.length} pending
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("verifications")}>
              View All
            </Button>
          </div>
          <div className="divide-y divide-border">
            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success" />
                <p>All verifications processed!</p>
              </div>
            ) : (
              pendingVerifications.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium">{user.college}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {user.submitted}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleReview(user)}>
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                    <Button variant="trust" size="sm" className="gap-1" onClick={() => handleApprove(user.id)}>
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(user.id)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fraud Alerts */}
        <div className="bg-card rounded-xl border border-border mb-8">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold">Fraud Detection Alerts</h2>
              <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                {fraudAlerts.length} alerts
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("fraud")}>
              View All
            </Button>
          </div>
          <div className="divide-y divide-border">
            {fraudAlerts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 text-success" />
                <p>No fraud alerts detected!</p>
              </div>
            ) : (
              fraudAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.risk === "high" ? "bg-destructive" : 
                      alert.risk === "medium" ? "bg-accent" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{alert.type}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          alert.risk === "high" ? "bg-destructive/10 text-destructive" : 
                          alert.risk === "medium" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                        }`}>
                          {alert.risk.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.reason}</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium">{alert.item}</p>
                    <p className="text-xs text-muted-foreground">by @{alert.seller}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleInvestigate(alert)}>
                      Investigate
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleBlockUser(alert.seller)}>
                      <Ban className="w-4 h-4" />
                      Block
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="font-semibold">Recent Transactions</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Item</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Buyer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Seller</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{tx.item}</td>
                    <td className="p-4 text-muted-foreground">{tx.buyer}</td>
                    <td className="p-4 text-muted-foreground">{tx.seller}</td>
                    <td className="p-4 font-medium text-secondary">₹{tx.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        tx.status === "completed" ? "bg-success/10 text-success" :
                        tx.status === "in_escrow" ? "bg-accent/10 text-accent" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {tx.status === "in_escrow" ? "In Escrow" : 
                         tx.status === "completed" ? "Completed" : "Dispute"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{tx.date}</td>
                    <td className="p-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info(`Viewing transaction #${tx.id} details`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
            <DialogDescription>Review the student's submitted documents</DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedVerification.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedVerification.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">College</p>
                  <p className="font-medium">{selectedVerification.college}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Type</p>
                  <p className="font-medium">{selectedVerification.idType}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Uploaded Document</p>
                <div className="aspect-video bg-background rounded-lg flex items-center justify-center border">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">college_id.pdf</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={() => {
              handleReject(selectedVerification?.id || 0);
              setReviewModalOpen(false);
            }}>
              Reject
            </Button>
            <Button variant="trust" onClick={() => {
              handleApprove(selectedVerification?.id || 0);
              setReviewModalOpen(false);
            }}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Investigate Modal */}
      <Dialog open={investigateModalOpen} onOpenChange={setInvestigateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Investigate Alert</DialogTitle>
            <DialogDescription>Review the fraud detection details</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${
                selectedAlert.risk === "high" ? "bg-destructive/10 border border-destructive/20" :
                selectedAlert.risk === "medium" ? "bg-accent/10 border border-accent/20" :
                "bg-muted"
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    selectedAlert.risk === "high" ? "text-destructive" :
                    selectedAlert.risk === "medium" ? "text-accent" : "text-muted-foreground"
                  }`} />
                  <span className="font-medium">{selectedAlert.risk.toUpperCase()} RISK</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Alert Type</p>
                  <p className="font-medium">{selectedAlert.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-medium">{selectedAlert.item}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">@{selectedAlert.seller}</p>
                </div>
                {selectedAlert.price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Listed Price</p>
                    <p className="font-medium text-destructive">{selectedAlert.price}</p>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Detection Reason</p>
                <p className="font-medium">{selectedAlert.reason}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleDismissAlert(selectedAlert?.id || 0)}>
              Dismiss
            </Button>
            <Button variant="destructive" onClick={() => handleBlockUser(selectedAlert?.seller || "")}>
              <Ban className="w-4 h-4 mr-2" />
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
