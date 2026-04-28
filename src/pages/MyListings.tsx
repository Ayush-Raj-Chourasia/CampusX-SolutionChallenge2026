import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/listings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('All listings:', data.data);
        console.log('Current user:', user);
        
        // Get user ID - try both 'id' and '_id' fields
        const userId = user.id || user._id;
        console.log('User ID for filtering:', userId);
        
        // Filter to show only current user's listings
        const myListings = data.data.filter((l: any) => {
          console.log('Comparing listing sellerId:', l.sellerId, 'with user ID:', userId);
          // Compare seller and sellerId fields with user id/_id
          return String(l.seller) === String(userId) || 
                 String(l.sellerId) === String(userId);
        });
        console.log('Filtered my listings:', myListings);
        setListings(myListings);
      } else {
        toast.error('Failed to load listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Error loading your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const token = sessionStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Listing deleted successfully');
        setListings(listings.filter(l => l.id !== id));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting listing');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link to="/sell">
          <Button>+ Add New Listing</Button>
        </Link>
      </div>
      
      {listings.length === 0 ? (
        <div className="p-6 bg-card rounded-xl text-center">
          <p className="text-muted-foreground mb-4">You have no listings yet.</p>
          <Link to="/sell">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(l => (
            <div key={l.id} className="bg-card p-4 rounded-xl border border-border">
              <div className="aspect-video bg-muted flex items-center justify-center text-4xl overflow-hidden rounded-lg">
                {l.images && l.images.length > 0 && l.images[0] ? (
                  typeof l.images[0] === 'string' && (l.images[0].startsWith('http') || l.images[0].startsWith('data:image')) ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{l.images[0]}</span>
                  )
                ) : (
                  <span>📦</span>
                )}
              </div>
              <h3 className="font-semibold mt-3 line-clamp-1">{l.title}</h3>
              <p className="text-primary font-bold">₹{l.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: <span className={l.status === 'sold' ? 'text-red-500' : 'text-green-500'}>
                  {l.status === 'sold' ? 'Sold' : 'Active'}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{l.views || 0} views</p>
              
              <div className="mt-4 flex gap-2">
                <Link to={`/product/${l.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View</Button>
                </Link>
                <Link to={`/edit-listing/${l.id}`} className="flex-1">
                  <Button variant="default" className="w-full gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => setDeleteId(l.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;
