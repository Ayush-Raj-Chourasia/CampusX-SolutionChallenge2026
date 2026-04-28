import { useEffect, useState } from "react";
import { useListingsStore } from "@/stores/listingsStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const listings = useListingsStore(s => s.listings);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userEmail, setUserEmail] = useState('guest');

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    const key = user ? JSON.parse(user).collegeEmail : 'guest';
    setUserEmail(key);
    const stored = sessionStorage.getItem(`favorites_${key}`);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const remove = (id: number) => {
    const newFav = favorites.filter(f => f !== id);
    setFavorites(newFav);
    sessionStorage.setItem(`favorites_${userEmail}`, JSON.stringify(newFav));
  };

  const items = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Favorites</h1>
      {items.length === 0 ? (
        <div className="p-6 bg-card rounded-xl text-center">
          <p className="text-muted-foreground">No favorites yet. Add items by clicking the heart on any listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(i => (
            <div key={i.id} className="bg-card p-4 rounded-xl border border-border">
              <div className="aspect-video bg-muted flex items-center justify-center text-4xl">{i.image}</div>
              <h3 className="font-semibold mt-3">{i.title}</h3>
              <p className="text-muted-foreground">₹{i.price}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/product/${i.id}`}><Button>View</Button></Link>
                <Button variant="outline" onClick={() => remove(i.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
